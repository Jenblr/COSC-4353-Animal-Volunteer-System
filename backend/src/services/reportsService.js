const PDFDocument = require('pdfkit');
const { User, VolunteerHistory, Event, Profile } = require('../../models');
const { Op } = require('sequelize');

const reportsService = {
  generateVolunteerReport: async (format) => {
    try {
      const volunteers = await User.findAll({
        where: {
          role: 'volunteer',
          isRegistered: true
        },
        include: [
          {
            model: Profile,
            as: 'Profile',
            required: false
          },
          {
            model: VolunteerHistory,
            as: 'VolunteerHistories',
            required: false,
            include: [{
              model: Event,
              required: false,
              attributes: [
                'eventName',
                'eventDescription',
                'eventDate',
                'startTime',
                'endTime',
                'city',
                'state',
                'urgency'
              ]
            }]
          }
        ],
        order: [
          ['email', 'ASC'],
          [{ model: VolunteerHistory, as: 'VolunteerHistories' }, Event, 'eventDate', 'DESC']
        ]
      });

      if (!volunteers || volunteers.length === 0) {
        throw new Error('No volunteers found in the system');
      }

      console.log(`Found ${volunteers.length} volunteers`);

      const reportData = volunteers.map(volunteer => ({
        email: volunteer.email,
        fullName: volunteer.Profile?.fullName || 'N/A',
        location: `${volunteer.Profile?.city || 'N/A'}, ${volunteer.Profile?.state || 'N/A'}`,
        totalEvents: volunteer.VolunteerHistories?.length || 0,
        participationHistory: (volunteer.VolunteerHistories || []).map(history => ({
          eventName: history.Event?.eventName || 'N/A',
          eventDate: history.Event?.eventDate || 'N/A',
          eventTime: history.Event ? `${history.Event.startTime} - ${history.Event.endTime}` : 'N/A',
          location: history.Event ? `${history.Event.city}, ${history.Event.state}` : 'N/A',
          urgency: history.Event?.urgency || 'N/A',
          status: history.participationStatus || 'Not Attended',
          matchedAt: history.matchedAt || 'N/A'
        }))
      }));

      console.log('Processed report data:', reportData);

      if (format === 'PDF') {
        return await generatePDFReport(reportData);
      } else {
        return await generateCSVReport(reportData);
      }
    } catch (error) {
      console.error('Error in generateVolunteerReport:', error);
      throw error;
    }
  },

  generateSpecificVolunteerReport: async (volunteerId, format) => {
    try {
      const volunteer = await User.findOne({
        where: {
          id: volunteerId,
          role: 'volunteer',
          isRegistered: true
        },
        include: [
          {
            model: Profile,
            as: 'Profile',
            required: false
          },
          {
            model: VolunteerHistory,
            as: 'VolunteerHistories',
            required: false,
            include: [{
              model: Event,
              attributes: [
                'eventName',
                'eventDescription',
                'eventDate',
                'startTime',
                'endTime',
                'city',
                'state',
                'urgency',
                'requiredSkills'
              ]
            }]
          }
        ],
        order: [
          [{ model: VolunteerHistory, as: 'VolunteerHistories' }, Event, 'eventDate', 'DESC']
        ]
      });

      if (!volunteer) {
        throw new Error('Volunteer not found');
      }

      const reportData = [{
        email: volunteer.email,
        fullName: volunteer.Profile?.fullName || 'Profile Not Completed',
        location: volunteer.Profile ?
          `${volunteer.Profile.city || 'N/A'}, ${volunteer.Profile.state || 'N/A'}` :
          'Profile Not Completed',
        skills: volunteer.Profile?.skills || [],
        totalEvents: volunteer.VolunteerHistories?.length || 0,
        participationHistory: (volunteer.VolunteerHistories || []).map(history => ({
          eventName: history.Event.eventName,
          eventDescription: history.Event.eventDescription,
          eventDate: history.Event.eventDate,
          eventTime: `${history.Event.startTime} - ${history.Event.endTime}`,
          location: `${history.Event.city}, ${history.Event.state}`,
          urgency: history.Event.urgency,
          requiredSkills: history.Event.requiredSkills,
          status: history.participationStatus || 'Not Attended',
          matchedAt: history.matchedAt
        }))
      }];

      if (format === 'PDF') {
        return await generatePDFReport(reportData, true);
      } else {
        return await generateCSVReport(reportData, true);
      }
    } catch (error) {
      console.error('Error generating specific volunteer report:', error);
      throw error;
    }
  }
};

const generateParticipationStats = (history) => {
  const total = history.length;
  const stats = {
    total,
    notAttended: history.filter(h => h.status === 'Not Attended').length,
    matched: history.filter(h => h.status === 'Matched - Pending Attendance').length,
    attended: history.filter(h => h.status === 'Attended').length,
    cancelled: history.filter(h => h.status === 'Cancelled').length
  };
  return stats;
};

const generatePDFReport = async (data, isDetailedReport = false) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting PDF generation');
      const doc = new PDFDocument({
        autoFirstPage: true,
        bufferPages: true,
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        size: 'A4'
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title
      doc.fontSize(20)
        .font('Helvetica-Bold')
        .text('Volunteer Participation Report', {
          align: 'center'
        });

      // File generated date
      doc.fontSize(10)
        .font('Helvetica')
        .text(`Generated on: ${new Date().toLocaleString()}`, {
          align: 'right'
        });
      doc.moveDown();

      data.forEach(volunteer => {
        // Volunteer information section
        doc.fontSize(16)
          .font('Helvetica-Bold')
          .text('Volunteer Information');

        doc.fontSize(12)
          .font('Helvetica')
          .text(`Name: ${volunteer.fullName}`)
          .text(`Email: ${volunteer.email}`)
          .text(`Location: ${volunteer.location}`)

        const stats = generateParticipationStats(volunteer.participationHistory);
        doc.moveDown()
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Participation Statistics')
          .font('Helvetica')
          .text(`Total Events: ${stats.total}`)
          .text(`Not Attended: ${stats.notAttended} / ${stats.total}`)
          .text(`Currently Matched: ${stats.matched} / ${stats.total}`)
          .text(`Attended: ${stats.attended} / ${stats.total}`)
          .text(`Cancelled: ${stats.cancelled} / ${stats.total}`);

        if (volunteer.skills?.length > 0) {
          doc.moveDown()
            .text(`Skills: ${volunteer.skills.join(', ')}`);
        }
        doc.moveDown();

        // Participation history section
        doc.fontSize(16)
          .font('Helvetica-Bold')
          .text('Participation History');
        doc.moveDown(0.5);

        if (volunteer.participationHistory.length > 0) {
          volunteer.participationHistory.forEach(history => {
            doc.fontSize(12)
              .font('Helvetica-Bold')
              .text(history.eventName);
            doc.fontSize(10)
              .font('Helvetica')
              .text(`Date: ${new Date(history.eventDate).toLocaleDateString()}`)
              .text(`Time: ${history.eventTime}`)
              .text(`Location: ${history.location}`)
              .text(`Status: ${history.status}`)
              .text(`Urgency: ${history.urgency}`);

            if (isDetailedReport) {
              doc.text(`Description: ${history.eventDescription}`)
                .text(`Required Skills: ${history.requiredSkills?.join(', ')}`);
            }
            doc.moveDown(0.5);
          });
        } else {
          doc.fontSize(12)
            .font('Helvetica')
            .text('No participation history');
        }
        doc.moveDown();

        if (data.indexOf(volunteer) !== data.length - 1) {
          doc.addPage();
        }
      });

      doc.end();
    } catch (error) {
      console.error('Error in PDF generation:', error);
      reject(error);
    }
  });
};

const generateCSVReport = async (data, isDetailedReport = false) => {
  try {
    const records = [];

    data.forEach(volunteer => {
      if (volunteer.participationHistory.length > 0) {
        volunteer.participationHistory.forEach(history => {
          const record = {
            volunteerName: volunteer.fullName,
            volunteerEmail: volunteer.email,
            volunteerLocation: volunteer.location,
            eventName: history.eventName,
            eventDate: new Date(history.eventDate).toLocaleDateString(),
            eventTime: history.eventTime,
            eventLocation: history.location,
            status: history.status,
            urgency: history.urgency
          };

          if (isDetailedReport) {
            record.eventDescription = history.eventDescription;
            record.requiredSkills = history.requiredSkills.join(', ');
            record.volunteerSkills = volunteer.skills.join(', ');
          }

          records.push(record);
        });
      } else {
        records.push({
          volunteerName: volunteer.fullName,
          volunteerEmail: volunteer.email,
          volunteerLocation: volunteer.location,
          eventName: 'No participation history',
          eventDate: '',
          eventTime: '',
          eventLocation: '',
          status: '',
          urgency: ''
        });
      }
    });

    const headers = [
      { id: 'volunteerName', title: 'VOLUNTEER NAME' },
      { id: 'volunteerEmail', title: 'EMAIL' },
      { id: 'volunteerLocation', title: 'VOLUNTEER LOCATION' },
      { id: 'eventName', title: 'EVENT NAME' },
      { id: 'eventDate', title: 'EVENT DATE' },
      { id: 'eventTime', title: 'EVENT TIME' },
      { id: 'eventLocation', title: 'EVENT LOCATION' },
      { id: 'status', title: 'STATUS' },
      { id: 'urgency', title: 'URGENCY' }
    ];

    if (isDetailedReport) {
      headers.push(
        { id: 'eventDescription', title: 'EVENT DESCRIPTION' },
        { id: 'requiredSkills', title: 'REQUIRED SKILLS' },
        { id: 'volunteerSkills', title: 'VOLUNTEER SKILLS' }
      );
    }

    let csvContent = headers.map(header => header.title).join(',') + '\n';

    records.forEach(record => {
      csvContent += headers.map(header => {
        const field = record[header.id]?.toString() || '';
        return `"${field.replace(/"/g, '""')}"`;
      }).join(',') + '\n';
    });

    return Buffer.from(csvContent, 'utf-8');
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};

module.exports = reportsService;