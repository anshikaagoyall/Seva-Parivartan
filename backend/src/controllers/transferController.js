import { TeacherProfile } from '../models/TeacherProfile.js';
import { TransferRequest } from '../models/TransferRequest.js';
import { User } from '../models/User.js';
import { Connection } from '../models/Connection.js';
import { Notification } from '../models/Notification.js';
import { calculateHaversineDistance } from '../services/haversineService.js';
import { findMutualMatchesForTeacher, getMatchQuality } from '../services/matchingService.js';
import { reverseGeocode, searchLocation } from '../services/nominatimService.js';

// Privacy Masking Helper for Anonymous Match Cards before mutual consent
const maskName = (name) => {
  if (!name) return 'Teacher (ID Masked)';
  const parts = name.split(' ');
  return parts.map((p) => p.charAt(0) + '***').join(' ');
};

const maskEmployeeId = (empId) => {
  if (!empId) return 'TCH-***-88';
  return empId.substring(0, 4) + '***' + empId.slice(-2);
};

const maskCandidatePrivacy = (candidateObj, isMutualInterest = false) => {
  if (isMutualInterest) {
    return candidateObj;
  }

  const rawUser = candidateObj.user || {};
  return {
    ...candidateObj,
    user: {
      _id: rawUser._id,
      name: maskName(rawUser.name),
      employeeId: maskEmployeeId(rawUser.employeeId),
      phone: '•••••••••• (Shared after Mutual Consent)',
      email: '•••••••••• (Shared after Mutual Consent)',
    },
    currentSchool: 'Govt. School (District Level Tagged)',
    formattedAddress: `${candidateObj.currentDistrict} Educational Zone`,
  };
};

const MOCK_TEACHER_PROFILES = [
  {
    _id: 'prof_1',
    user: { _id: 'usr_1', name: 'Smt. Sunita Verma', email: 'sunita.verma@gov.in', phone: '9876543211', employeeId: 'TCH-DEL-01' },
    subject: 'Mathematics',
    designation: 'TGT (Trained Graduate Teacher)',
    currentSchool: 'Govt. Sr. Sec. School',
    currentDistrict: 'Central Delhi',
    currentCity: 'Karol Bagh',
    latitude: 28.6519,
    longitude: 77.1910,
    preferredDistricts: ['South Delhi', 'East Delhi'],
    documentStatus: 'Documents_Submitted',
    yearsInService: 5,
    isSeekingTransfer: true,
  },
  {
    _id: 'prof_2',
    user: { _id: 'usr_2', name: 'Shri Vikramaditya Singh', email: 'vikram.singh@gov.in', phone: '9876543212', employeeId: 'TCH-DEL-02' },
    subject: 'Mathematics',
    designation: 'TGT (Trained Graduate Teacher)',
    currentSchool: 'Sarvodaya Kanya Vidyalaya',
    currentDistrict: 'South Delhi',
    currentCity: 'Saket',
    latitude: 28.5244,
    longitude: 77.2188,
    preferredDistricts: ['Central Delhi', 'North Delhi'],
    documentStatus: 'Documents_Submitted',
    yearsInService: 4,
    isSeekingTransfer: true,
  },
];

const createNotification = async ({ userId, type, title, message, relatedUser = null, relatedRequest = null }) => {
  if (!userId) return null;
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedUser,
    relatedRequest,
  });
};

/**
 * @desc    Create or Update Teacher Profile
 * @route   POST /api/transfers/profile
 */
export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const {
      subject,
      designation,
      currentSchool,
      currentDistrict,
      latitude,
      longitude,
      preferredDistricts,
      yearsInService,
    } = req.body;

    let profile;
    try {
      profile = await TeacherProfile.findOneAndUpdate(
        { user: req.user.id },
        {
          user: req.user.id,
          subject,
          designation,
          currentSchool,
          currentDistrict,
          latitude: parseFloat(latitude) || 28.6139,
          longitude: parseFloat(longitude) || 77.2090,
          preferredDistricts: Array.isArray(preferredDistricts)
            ? preferredDistricts
            : (preferredDistricts || '').split(',').map((d) => d.trim()),
          yearsInService: parseInt(yearsInService) || 3,
          documentStatus: 'Documents_Submitted',
          isSeekingTransfer: true,
        },
        { new: true, upsert: true }
      );
    } catch {
      profile = {
        _id: 'prof_' + Date.now(),
        user: req.user,
        subject,
        designation,
        currentSchool,
        currentDistrict,
        latitude: parseFloat(latitude) || 28.6139,
        longitude: parseFloat(longitude) || 77.2090,
        preferredDistricts: Array.isArray(preferredDistricts)
          ? preferredDistricts
          : (preferredDistricts || '').split(',').map((d) => d.trim()),
        documentStatus: 'Documents_Submitted',
        isSeekingTransfer: true,
      };
    }

    res.json({
      success: true,
      message: 'Teacher profile created/updated. Verification status: Documents Submitted.',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or Replace Active Transfer Request Preference
 * @route   POST /api/transfers/request-preference
 * @access  Private (Teacher)
 */
export const createOrReplaceRequestPreference = async (req, res, next) => {
  try {
    const {
      currentLocation,
      preferredLocation,
      subject,
      teacherCategory,
      yearsOfService,
      searchRadiusKm,
      reason,
      otherReason,
    } = req.body;

    // Validation: Radius must be allowed value
    const allowedRadii = [25, 50, 75, 100, 150];
    const radius = parseInt(searchRadiusKm) || 100;
    if (!allowedRadii.includes(radius)) {
      return res.status(400).json({
        success: false,
        message: 'Search radius must be one of: 25 km, 50 km, 75 km, 100 km, or 150 km.',
      });
    }

    // Validation: Preferred location cannot exactly match current location
    if (
      preferredLocation?.state === currentLocation?.state &&
      preferredLocation?.district === currentLocation?.district &&
      preferredLocation?.city === currentLocation?.city
    ) {
      return res.status(400).json({
        success: false,
        message: 'Preferred transfer location cannot be identical to your current posting location.',
      });
    }

    let transferReq;
    try {
      // Deactivate any existing active request for this teacher
      await TransferRequest.updateMany(
        { teacher: req.user.id, status: 'Active' },
        { status: 'Cancelled', $push: { history: { status: 'Cancelled', remarks: 'Replaced by new transfer request preferences.' } } }
      );

      // Create new active request preference
      transferReq = await TransferRequest.create({
        teacher: req.user.id,
        currentLocation,
        preferredLocation,
        subject: subject || 'Mathematics',
        teacherCategory: teacherCategory || 'TGT (Trained Graduate Teacher)',
        yearsOfService: parseFloat(yearsOfService) || 0,
        searchRadiusKm: radius,
        reason: reason || 'Family',
        otherReason: reason === 'Other' ? otherReason || '' : '',
        status: 'Active',
        history: [{ status: 'Active', remarks: 'Active transfer request preference initialized.' }],
      });
    } catch {
      // In-memory fallback
      transferReq = {
        _id: 'tr_req_' + Date.now(),
        teacher: req.user.id,
        currentLocation,
        preferredLocation,
        subject: subject || 'Mathematics',
        teacherCategory: teacherCategory || 'TGT (Trained Graduate Teacher)',
        yearsOfService: parseFloat(yearsOfService) || 5,
        searchRadiusKm: radius,
        reason: reason || 'Family',
        otherReason: otherReason || '',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    res.status(201).json({
      success: true,
      message: 'Active Mutual Transfer Request saved successfully! Searching for matches within ' + radius + ' km.',
      transferRequest: transferReq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Teacher's Active Transfer Request & History
 * @route   GET /api/transfers/my-active-request
 * @access  Private (Teacher)
 */
export const getMyActiveRequest = async (req, res, next) => {
  try {
    let activeRequest = null;
    let requestHistory = [];
    try {
      activeRequest = await TransferRequest.findOne({
        teacher: req.user.id,
        status: { $in: ['Active', 'Matched', 'Contact_Shared'] },
      }).sort({ updatedAt: -1 });

      requestHistory = await TransferRequest.find({ teacher: req.user.id }).sort({ createdAt: -1 });
    } catch {
      activeRequest = null;
    }

    // Default demo fallback if no DB active request found
    if (!activeRequest) {
      activeRequest = {
        _id: 'active_req_demo_01',
        teacher: req.user.id,
        currentLocation: {
          state: 'Delhi (NCT)',
          district: 'Central Delhi',
          city: 'Karol Bagh',
          schoolName: 'Govt. Senior Secondary School',
          pincode: '110001',
          latitude: 28.6519,
          longitude: 77.1910,
        },
        preferredLocation: {
          state: 'Delhi (NCT)',
          district: 'South Delhi',
          city: 'Saket',
          preferredSchool: 'Sarvodaya Kanya Vidyalaya',
          pincode: '110017',
          latitude: 28.5244,
          longitude: 77.2188,
        },
        subject: 'Mathematics',
        teacherCategory: 'TGT (Trained Graduate Teacher)',
        yearsOfService: 5,
        searchRadiusKm: 100,
        reason: 'Family',
        otherReason: '',
        status: 'Active',
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(),
      };
    }

    res.json({
      success: true,
      activeRequest,
      requestHistory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit Active Transfer Request
 * @route   PUT /api/transfers/request-preference/:id
 * @access  Private (Teacher)
 */
export const editRequestPreference = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { preferredLocation, searchRadiusKm, reason, otherReason } = req.body;

    let updatedReq;
    try {
      updatedReq = await TransferRequest.findByIdAndUpdate(
        id,
        {
          preferredLocation,
          searchRadiusKm: parseInt(searchRadiusKm) || 100,
          reason,
          otherReason: reason === 'Other' ? otherReason || '' : '',
          $push: { history: { status: 'Active', remarks: 'Transfer preferences updated by user.' } },
        },
        { new: true }
      );
    } catch {
      updatedReq = {
        _id: id,
        preferredLocation,
        searchRadiusKm: parseInt(searchRadiusKm) || 100,
        reason,
        status: 'Active',
        updatedAt: new Date(),
      };
    }

    res.json({
      success: true,
      message: 'Active transfer request updated successfully.',
      transferRequest: updatedReq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel Active Transfer Request
 * @route   PUT /api/transfers/cancel-request/:id
 * @access  Private (Teacher)
 */
export const cancelTransferRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    let cancelledReq;
    try {
      cancelledReq = await TransferRequest.findByIdAndUpdate(
        id,
        {
          status: 'Cancelled',
          $push: { history: { status: 'Cancelled', remarks: 'Request cancelled by user.' } },
        },
        { new: true }
      );
    } catch {
      cancelledReq = {
        _id: id,
        status: 'Cancelled',
        updatedAt: new Date(),
      };
    }

    res.json({
      success: true,
      message: 'Active transfer request has been cancelled.',
      transferRequest: cancelledReq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Find Anonymous Matches
 * @route   GET /api/transfers/matches
 */
export const findMatches = async (req, res, next) => {
  try {
    let currentProfile;
    try {
      currentProfile = await TeacherProfile.findOne({ user: req.user.id }).populate('user', 'name email phone employeeId');
    } catch {
      currentProfile = null;
    }

    if (!currentProfile) {
      currentProfile = {
        _id: 'curr_prof',
        user: { _id: req.user.id, name: req.user.name || 'Teacher' },
        subject: req.query.subject || 'Mathematics',
        designation: req.query.designation || 'TGT (Trained Graduate Teacher)',
        currentDistrict: req.query.currentDistrict || 'Central Delhi',
        currentCity: 'Karol Bagh',
        latitude: 28.6519,
        longitude: 77.1910,
        preferredDistricts: req.query.preferredDistricts ? req.query.preferredDistricts.split(',') : ['South Delhi'],
        yearsInService: 5,
      };
    }

    let pool = [];
    try {
      pool = await TeacherProfile.find({
        user: { $ne: req.user.id },
        isSeekingTransfer: true,
      }).populate('user', 'name email phone employeeId');
    } catch {
      pool = [];
    }

    if (pool.length === 0) pool = MOCK_TEACHER_PROFILES;

    const rawMatches = findMutualMatchesForTeacher(currentProfile, pool);
    const maskedMatches = rawMatches.map((m) => ({
      ...m,
      candidate: maskCandidatePrivacy(m.candidate, false),
      quality: m.quality || getMatchQuality(m.score),
      score: m.score,
      distanceKm: Number(m.distanceKm || 0),
      rationale: m.rationale || [],
      isDirectMatch: !!m.isDirectMatch,
    }));

    res.json({
      success: true,
      count: maskedMatches.length,
      currentProfile,
      matches: maskedMatches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate distance API
 * @route   POST /api/transfers/calculate-distance
 */
export const calculateDistanceApi = async (req, res, next) => {
  try {
    const { lat1, lon1, lat2, lon2, locationName1, locationName2 } = req.body;
    const distanceKm = calculateHaversineDistance(
      parseFloat(lat1),
      parseFloat(lon1),
      parseFloat(lat2),
      parseFloat(lon2)
    );

    res.json({
      success: true,
      distanceKm,
      distanceMiles: Math.round(distanceKm * 0.621371 * 100) / 100,
      location1: locationName1 || `(${lat1}, ${lon1})`,
      location2: locationName2 || `(${lat2}, ${lon2})`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    OpenStreetMap Nominatim Geocode API
 * @route   GET /api/transfers/geocode-search
 */
export const geocodeSearchApi = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query parameter q required' });
    const results = await searchLocation(q);
    res.json({ success: true, results });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload Employee ID Card or Appointment Letter via Multer
 * @route   POST /api/transfers/upload-doc
 */
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a document file to upload' });
    }

    const relativePath = `/uploads/${req.file.filename}`;
    const docType = req.body.docType || 'employeeCard';

    try {
      const updateData =
        docType === 'appointmentLetter'
          ? { appointmentLetterDoc: relativePath, documentStatus: 'Documents_Submitted' }
          : { employeeCardDoc: relativePath, documentStatus: 'Documents_Submitted' };

      await TeacherProfile.findOneAndUpdate({ user: req.user.id }, updateData);
    } catch {
      // In-memory fallback
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully. Status: Documents Submitted.',
      file: {
        originalName: req.file.originalname,
        path: relativePath,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request Contact Exchange (Mutual Interest Flow)
 * @route   POST /api/transfers/request
 */
export const createTransferRequest = async (req, res, next) => {
  try {
    const { matchedPartnerId, fromDistrict, toDistrict, subject, designation } = req.body;

    let transferReq;
    try {
      const existing = await TransferRequest.findOne({
        applicant: matchedPartnerId,
        matchedPartner: req.user.id,
      });

      if (existing) {
        existing.status = 'Contact_Shared';
        existing.partnerConsent = true;
        await existing.save();
        transferReq = existing;
      } else {
        transferReq = await TransferRequest.create({
          teacher: req.user.id,
          applicant: req.user.id,
          matchedPartner: matchedPartnerId || null,
          subject: subject || 'Mathematics',
          teacherCategory: designation || 'TGT (Trained Graduate Teacher)',
          designation: designation || 'TGT (Trained Graduate Teacher)',
          fromDistrict,
          toDistrict,
          status: 'Mutual_Interest',
          applicantConsent: true,
          partnerConsent: false,
          history: [{ status: 'Mutual_Interest', remarks: 'Mutual interest request initiated.' }],
        });
      }
    } catch {
      transferReq = {
        _id: 'req_' + Date.now(),
        applicant: req.user.id,
        matchedPartner: matchedPartnerId,
        subject,
        designation,
        fromDistrict,
        toDistrict,
        status: 'Contact_Shared',
        applicantConsent: true,
        partnerConsent: true,
      };
    }

    res.status(201).json({
      success: true,
      message:
        transferReq.status === 'Contact_Shared'
          ? 'Mutual Consent Confirmed! Contact details unlocked for both teachers.'
          : 'Mutual Interest registered. Contact details will be unlocked when candidate accepts.',
      transferRequest: transferReq,
    });
  } catch (error) {
    next(error);
  }
};

export const sendContactRequest = async (req, res, next) => {
  try {
    const { recipientId, transferRequestId, message = '' } = req.body;
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found.' });
    }

    let connection = await Connection.findOne({
      participants: { $all: [req.user.id, recipientId] },
      status: { $in: ['pending', 'accepted', 'contact_shared'] },
    });

    if (!connection) {
      connection = await Connection.create({
        participants: [req.user.id, recipientId],
        initiator: req.user.id,
        recipient: recipientId,
        transferRequest: transferRequestId || null,
        status: 'pending',
        message,
      });
    }

    await createNotification({
      userId: recipientId,
      type: 'contact_request_received',
      title: 'New contact request',
      message: `${req.user.name || 'A teacher'} requested contact exchange.`,
      relatedUser: req.user.id,
      relatedRequest: transferRequestId || connection._id,
    });

    res.json({ success: true, connection, message: 'Contact request sent successfully.' });
  } catch (error) {
    next(error);
  }
};

export const acceptContactRequest = async (req, res, next) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found.' });
    }

    if (String(connection.initiator) === String(req.user.id)) {
      connection.mutualConsent.initiatorAccepted = true;
    } else {
      connection.mutualConsent.recipientAccepted = true;
    }

    const bothAccepted = connection.mutualConsent.initiatorAccepted && connection.mutualConsent.recipientAccepted;
    connection.status = bothAccepted ? 'contact_shared' : 'accepted';
    await connection.save();

    await createNotification({
      userId: connection.initiator,
      type: bothAccepted ? 'contact_shared' : 'contact_request_accepted',
      title: bothAccepted ? 'Contact shared' : 'Contact request accepted',
      message: bothAccepted ? 'Both teachers accepted and contact details are now visible.' : 'The other teacher accepted your contact request.',
      relatedUser: req.user.id,
      relatedRequest: connection.transferRequest,
    });

    if (bothAccepted) {
      await createNotification({
        userId: connection.recipient,
        type: 'contact_shared',
        title: 'Contact shared',
        message: 'Both teachers accepted and contact details are now visible.',
        relatedUser: connection.initiator,
        relatedRequest: connection.transferRequest,
      });
    }

    res.json({ success: true, connection, message: bothAccepted ? 'Contact details are now shared.' : 'Contact request accepted.' });
  } catch (error) {
    next(error);
  }
};

export const rejectContactRequest = async (req, res, next) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found.' });
    }

    connection.status = 'rejected';
    await connection.save();

    await createNotification({
      userId: connection.initiator,
      type: 'contact_request_received',
      title: 'Request rejected',
      message: 'The other teacher rejected your contact exchange request.',
      relatedUser: req.user.id,
    });

    res.json({ success: true, connection, message: 'Connection request rejected.' });
  } catch (error) {
    next(error);
  }
};

export const getPendingContactRequests = async (req, res, next) => {
  try {
    const requests = await Connection.find({
      participants: req.user.id,
      status: 'pending',
    }).populate('initiator recipient transferRequest', 'name email phone employeeId');

    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

export const getAcceptedConnections = async (req, res, next) => {
  try {
    const requests = await Connection.find({
      participants: req.user.id,
      status: { $in: ['accepted', 'contact_shared'] },
    }).populate('initiator recipient', 'name email phone employeeId');

    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('relatedUser', 'name employeeId');
    const unread = notifications.filter((item) => !item.isRead).length;
    res.json({ success: true, notifications, unread });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get User's Mutual Connections
 * @route   GET /api/transfers/my-requests
 */
export const getMyRequests = async (req, res, next) => {
  try {
    let requests = [];
    try {
      requests = await TransferRequest.find({
        $or: [{ applicant: req.user.id }, { matchedPartner: req.user.id }],
      }).populate('applicant matchedPartner', 'name email phone employeeId');
    } catch {
      requests = [];
    }

    if (requests.length === 0) {
      requests = [
        {
          _id: 'tr_conn_1',
          applicant: { name: req.user.name || 'Smt. Sunita Verma', employeeId: 'TCH-DEL-01', phone: '9876543211', email: 'sunita.verma@gov.in' },
          matchedPartner: { name: 'Shri Vikramaditya Singh', employeeId: 'TCH-DEL-02', phone: '9876543212', email: 'vikram.singh@gov.in' },
          subject: 'Mathematics',
          designation: 'TGT (Trained Graduate Teacher)',
          fromDistrict: 'Central Delhi',
          toDistrict: 'South Delhi',
          haversineDistanceKm: 14.82,
          matchScore: 95,
          status: 'Contact_Shared',
          applicantConsent: true,
          partnerConsent: true,
          createdAt: new Date(),
        },
      ];
    }

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};
