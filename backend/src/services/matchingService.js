import { calculateHaversineDistance } from './haversineService.js';

const normalizeText = (value) => (value || '').toString().trim().toLowerCase();

export const getMatchQuality = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Good';
  return 'Possible';
};

export const evaluateMutualMatch = (teacherA, teacherB) => {
  if (!teacherA || !teacherB) return { isMatch: false, score: 0, reason: 'Missing profile data' };
  if (teacherA._id?.toString() === teacherB._id?.toString()) {
    return { isMatch: false, score: 0, reason: 'Same profile' };
  }

  const rationale = [];
  let score = 0;

  const sameSubject = normalizeText(teacherA.subject) === normalizeText(teacherB.subject);
  if (sameSubject) {
    score += 10;
    rationale.push(`Same subject: ${teacherA.subject}`);
  } else {
    rationale.push(`Subject mismatch: ${teacherA.subject} vs ${teacherB.subject}`);
  }

  const sameCategory = normalizeText(teacherA.designation || teacherA.teacherCategory) === normalizeText(teacherB.designation || teacherB.teacherCategory);
  if (sameCategory) {
    score += 10;
    rationale.push(`Same teacher category: ${teacherA.designation || teacherA.teacherCategory}`);
  }

  const distanceKm = calculateHaversineDistance(
    Number(teacherA.latitude ?? 28.6139),
    Number(teacherA.longitude ?? 77.2090),
    Number(teacherB.latitude ?? 28.6139),
    Number(teacherB.longitude ?? 77.2090)
  );

  if (distanceKm <= 25) {
    score += 15;
    rationale.push(`Distance is ${distanceKm.toFixed(1)} km away`);
  } else if (distanceKm <= 50) {
    score += 10;
    rationale.push(`Distance is ${distanceKm.toFixed(1)} km away`);
  } else if (distanceKm <= 100) {
    score += 5;
    rationale.push(`Distance is ${distanceKm.toFixed(1)} km away`);
  }

  const aDistrict = normalizeText(teacherA.currentDistrict || teacherA.district);
  const bDistrict = normalizeText(teacherB.currentDistrict || teacherB.district);
  const aPreferred = Array.isArray(teacherA.preferredDistricts) ? teacherA.preferredDistricts.map(normalizeText) : [];
  const bPreferred = Array.isArray(teacherB.preferredDistricts) ? teacherB.preferredDistricts.map(normalizeText) : [];

  const exactMutualDistrict = aPreferred.includes(bDistrict) && bPreferred.includes(aDistrict);
  const sameDistrict = aDistrict === bDistrict;

  if (exactMutualDistrict) {
    score += 20;
    rationale.push(`Exact mutual district preference: ${teacherA.currentDistrict || teacherA.district} ⇄ ${teacherB.currentDistrict || teacherB.district}`);
  } else if (sameDistrict) {
    score += 20;
    rationale.push(`Same district match: ${teacherA.currentDistrict || teacherA.district}`);
  } else if (aPreferred.includes(bDistrict) || bPreferred.includes(aDistrict)) {
    score += 10;
    rationale.push('One-way district preference match');
  }

  const aCity = normalizeText(teacherA.currentCity || teacherA.currentBlock || teacherA.city);
  const bCity = normalizeText(teacherB.currentCity || teacherB.currentBlock || teacherB.city);
  if (aCity && bCity && aCity === bCity) {
    score += 40;
    rationale.push(`Exact mutual city match: ${teacherA.currentCity || teacherA.currentBlock || teacherA.city}`);
  }

  const aYears = Number(teacherA.yearsInService ?? teacherA.yearsOfService ?? 0);
  const bYears = Number(teacherB.yearsInService ?? teacherB.yearsOfService ?? 0);
  const experienceGap = Math.abs(aYears - bYears);
  if (experienceGap <= 3) {
    score += 5;
    rationale.push(`Similar years of service (${aYears} vs ${bYears})`);
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const quality = getMatchQuality(finalScore);

  return {
    isMatch: finalScore >= 35,
    score: finalScore,
    distanceKm,
    rationale,
    quality,
    isDirectMatch: exactMutualDistrict,
  };
};

export const findMutualMatchesForTeacher = (targetProfile, profilePool = []) => {
  const results = [];

  for (const candidate of profilePool) {
    const match = evaluateMutualMatch(targetProfile, candidate);
    if (match.isMatch) {
      results.push({
        candidate,
        score: match.score,
        distanceKm: match.distanceKm,
        rationale: match.rationale,
        quality: match.quality,
        isDirectMatch: match.isDirectMatch,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.distanceKm - b.distanceKm);
};
