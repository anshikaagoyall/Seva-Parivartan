/**
 * Comprehensive Indian Administrative Dataset
 * Covers States & Union Territories, Districts, Cities/Blocks, PIN Codes, and default Geo Coordinates.
 */

export const INDIA_ADMINISTRATIVE_DATA = {
  'Delhi (NCT)': {
    'Central Delhi': {
      cities: ['Karol Bagh', 'Connaught Place', 'Daryaganj', 'Paharganj', 'Rajendra Nagar'],
      pin: '110001',
      lat: 28.6519,
      lng: 77.1910,
    },
    'South Delhi': {
      cities: ['Saket', 'Hauz Khas', 'Mehrauli', 'Greater Kailash', 'Green Park'],
      pin: '110017',
      lat: 28.5244,
      lng: 77.2188,
    },
    'North West Delhi': {
      cities: ['Rohini', 'Pitampura', 'Kanjhawala', 'Shalimar Bagh', 'Model Town'],
      pin: '110085',
      lat: 28.7041,
      lng: 77.1025,
    },
    'South West Delhi': {
      cities: ['Vasant Kunj', 'Dwarka', 'Najafgarh', 'Janakpuri', 'Vasant Vihar'],
      pin: '110070',
      lat: 28.5293,
      lng: 77.1539,
    },
    'East Delhi': {
      cities: ['Mayur Vihar', 'Preet Vihar', 'Shahdara', 'Laxmi Nagar', 'Gandhi Nagar'],
      pin: '110091',
      lat: 28.6083,
      lng: 77.2942,
    },
    'New Delhi': {
      cities: ['Chanakyapuri', 'Barakhamba Road', 'Lodhi Colony', 'Khan Market'],
      pin: '110003',
      lat: 28.6139,
      lng: 77.2090,
    },
  },

  Maharashtra: {
    'Mumbai City': {
      cities: ['Colaba', 'Fort', 'Marine Lines', 'Dadra', 'Nariman Point'],
      pin: '400001',
      lat: 18.9388,
      lng: 72.8353,
    },
    'Mumbai Suburban': {
      cities: ['Andheri', 'Bandra', 'Borivali', 'Juhu', 'Powai', 'Kurla'],
      pin: '400053',
      lat: 19.1197,
      lng: 72.8464,
    },
    Pune: {
      cities: ['Kothrud', 'Viman Nagar', 'Hinjawadi', 'Shivajinagar', 'Hadapsar', 'Baner'],
      pin: '411001',
      lat: 18.5204,
      lng: 73.8567,
    },
    Nagpur: {
      cities: ['Dharampeth', 'Civil Lines', 'Sitabuldi', 'Sadar'],
      pin: '440001',
      lat: 21.1458,
      lng: 79.0882,
    },
    Thane: {
      cities: ['Ghodbunder Road', 'Majiwada', 'Naupada', 'Vartak Nagar'],
      pin: '400601',
      lat: 19.2183,
      lng: 72.9781,
    },
  },

  'Uttar Pradesh': {
    'Gautam Buddha Nagar': {
      cities: ['Noida Sector 62', 'Greater Noida Alpha', 'Dadri', 'Knowledge Park'],
      pin: '201301',
      lat: 28.6280,
      lng: 77.3649,
    },
    Ghaziabad: {
      cities: ['Indirapuram', 'Vaishali', 'Raj Nagar Extension', 'Vasundhara'],
      pin: '201014',
      lat: 28.6692,
      lng: 77.4538,
    },
    Lucknow: {
      cities: ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Mahanagar'],
      pin: '226001',
      lat: 26.8467,
      lng: 80.9462,
    },
    Varanasi: {
      cities: ['Lanka', 'Sigra', 'Godowlia', 'Bhelpura', 'Cantonment'],
      pin: '221001',
      lat: 25.3176,
      lng: 82.9739,
    },
    Agra: {
      cities: ['Tajganj', 'Sanjay Place', 'Kamla Nagar', 'Civil Lines'],
      pin: '282001',
      lat: 27.1767,
      lng: 78.0081,
    },
    Kanpur: {
      cities: ['Swaroop Nagar', 'Civil Lines', 'Kidwai Nagar', 'Kalyanpur'],
      pin: '208001',
      lat: 26.4499,
      lng: 80.3319,
    },
  },

  Karnataka: {
    'Bengaluru Urban': {
      cities: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City'],
      pin: '560001',
      lat: 12.9716,
      lng: 77.5946,
    },
    Mysuru: {
      cities: ['Gokulam', 'Vijayanagar', 'Saraswathipuram', 'Jayalakshmipuram'],
      pin: '570001',
      lat: 12.2958,
      lng: 76.6394,
    },
    Mangaluru: {
      cities: ['Hapankatta', 'Bejai', 'Kodialbail', 'Kadri'],
      pin: '575001',
      lat: 12.9141,
      lng: 74.8560,
    },
  },

  'Tamil Nadu': {
    Chennai: {
      cities: ['T. Nagar', 'Adyar', 'Anna Nagar', 'Velachery', 'Mylapore'],
      pin: '600001',
      lat: 13.0827,
      lng: 80.2707,
    },
    Coimbatore: {
      cities: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Ramanathapuram'],
      pin: '641001',
      lat: 11.0168,
      lng: 76.9558,
    },
    Madurai: {
      cities: ['KK Nagar', 'Anna Nagar', 'Tallakulam', 'Simmakkal'],
      pin: '625001',
      lat: 9.9252,
      lng: 78.1198,
    },
  },

  'West Bengal': {
    Kolkata: {
      cities: ['Salt Lake Sector 5', 'Park Street', 'New Town', 'Bhowanipore', 'Alipore'],
      pin: '700001',
      lat: 22.5726,
      lng: 88.3639,
    },
    Howrah: {
      cities: ['Shibpur', 'Bally', 'Salkia', 'Liluah'],
      pin: '711101',
      lat: 22.5958,
      lng: 88.2636,
    },
    Darjeeling: {
      cities: ['Mall Road', 'Kurseong', 'Mirik', 'Kalimpong'],
      pin: '734101',
      lat: 27.0410,
      lng: 88.2663,
    },
  },

  Gujarat: {
    Ahmedabad: {
      cities: ['Navrangpura', 'Satellite', 'SG Highway', 'Bodakdev', 'Maninagar'],
      pin: '380001',
      lat: 23.0225,
      lng: 72.5714,
    },
    Surat: {
      cities: ['Adajan', 'Vesu', 'Ghopadpatti', 'Varachha'],
      pin: '395001',
      lat: 21.1702,
      lng: 72.8311,
    },
    Vadodara: {
      cities: ['Alkapuri', 'Race Course', 'Akota', 'Manjalpur'],
      pin: '390001',
      lat: 22.3072,
      lng: 73.1812,
    },
  },

  Rajasthan: {
    Jaipur: {
      cities: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Raja Park'],
      pin: '302017',
      lat: 26.9124,
      lng: 75.7873,
    },
    Jodhpur: {
      cities: ['Ratanada', 'Sardarpura', 'Shastri Nagar', 'Paota'],
      pin: '342001',
      lat: 26.2389,
      lng: 73.0243,
    },
    Udaipur: {
      cities: ['Hiran Magri', 'Fatehpura', 'Panchwati', 'Sukher'],
      pin: '313001',
      lat: 24.5854,
      lng: 73.7125,
    },
  },

  Bihar: {
    Patna: {
      cities: ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Rajendra Nagar', 'Patliputra'],
      pin: '800001',
      lat: 25.5941,
      lng: 85.1376,
    },
    Gaya: {
      cities: ['Bodhgaya', 'Civil Lines', 'Delha', 'Manpur'],
      pin: '823001',
      lat: 24.7914,
      lng: 85.0002,
    },
  },

  Haryana: {
    Gurugram: {
      cities: ['Cyber City', 'DLF Phase 3', 'Sohna Road', 'Golf Course Road', 'Sector 56'],
      pin: '122001',
      lat: 28.4595,
      lng: 77.0266,
    },
    Faridabad: {
      cities: ['NIT Faridabad', 'Sector 15', 'Ballabhgarh', 'Greater Faridabad'],
      pin: '121001',
      lat: 28.4089,
      lng: 77.3178,
    },
    Panchkula: {
      cities: ['Sector 5', 'Sector 20', 'Kalka', 'Pinjore'],
      pin: '134109',
      lat: 30.6942,
      lng: 76.8606,
    },
  },

  Punjab: {
    Ludhiana: {
      cities: ['Model Town', 'Civil Lines', 'Ferozepur Road', 'BRS Nagar'],
      pin: '141001',
      lat: 30.9010,
      lng: 75.8573,
    },
    Amritsar: {
      cities: ['Ranjit Avenue', 'Lawrence Road', 'Golden Temple Zone', 'GT Road'],
      pin: '143001',
      lat: 31.6340,
      lng: 74.8723,
    },
  },

  Kerala: {
    Thiruvananthapuram: {
      cities: ['Kowdiar', 'Vazhuthacaud', 'Pattom', 'Kazhakoottam'],
      pin: '695001',
      lat: 8.5241,
      lng: 76.9366,
    },
    Kochi: {
      cities: ['MG Road', 'Marine Drive', 'Kakkanad', 'Edappally'],
      pin: '682001',
      lat: 9.9312,
      lng: 76.2673,
    },
  },

  Telangana: {
    Hyderabad: {
      cities: ['Banjara Hills', 'Jubilee Hills', 'HITEC City', 'Gachibowli', 'Madhapur'],
      pin: '500001',
      lat: 17.3850,
      lng: 78.4867,
    },
  },
};
