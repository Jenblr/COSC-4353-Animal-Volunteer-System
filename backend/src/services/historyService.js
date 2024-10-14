// historyService.js

const volunteerHistory = [
  {
    id: 1,
    volunteer: 'Adam Larson',
    eventName: 'Pet Training Workshop',
    eventDescription: 'Assist in training sessions for shelter animals',
    location: 'Special Pals Animal Shelter',
    requiredSkills: ['Animal training', 'Communication'],
    urgency: 'Medium',
    eventDate: '10-01-2024',
    participationStatus: 'Pending',
  },
  {
    id: 2,
    volunteer: 'Claire Smith',
    eventName: 'Pet Photography Day',
    eventDescription: 'Take photos of animals for adoption profiles',
    location: 'Citizens for Animal Protection',
    requiredSkills: ['Photography', 'Animal handling'],
    urgency: 'Medium',
    eventDate: '09-22-2024',
    participationStatus: 'Confirmed',
  },
];

exports.getHistory = (userId) => {
  console.log('Fetching history for userId:', userId);
  return volunteerHistory;
};

exports.addHistoryRecord = (userId, recordData) => {
  console.log('Adding history record for userId:', userId);
  const newRecord = {
    id: volunteerHistory.length + 1,
    ...recordData
  };
  volunteerHistory.push(newRecord);
  return { status: 201, record: newRecord };
};

exports.updateHistoryRecord = (userId, recordId, updateData) => {
  console.log('Updating record. UserId:', userId, 'RecordId:', recordId);
  const recordIndex = volunteerHistory.findIndex(r => r.id === parseInt(recordId));
  
  if (recordIndex === -1) {
    return { status: 404, message: 'History record not found' };
  }

  volunteerHistory[recordIndex] = { ...volunteerHistory[recordIndex], ...updateData };
  return { status: 200, record: volunteerHistory[recordIndex] };
};

exports.deleteHistoryRecord = (userId, recordId) => {
  console.log('Deleting record. UserId:', userId, 'RecordId:', recordId);
  const recordIndex = volunteerHistory.findIndex(r => r.id === parseInt(recordId));
  
  if (recordIndex === -1) {
    return { status: 404, message: 'History record not found' };
  }

  volunteerHistory.splice(recordIndex, 1);
  return { status: 200, message: 'Record deleted successfully' };
};