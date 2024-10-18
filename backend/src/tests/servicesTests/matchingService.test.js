// // matchingService.test.js
const matchingService = require('../../services/matchingService');
const eventService = require('../../services/eventService');
const profileService = require('../../services/profileService');

//mock the dependencies
jest.mock('../../services/eventService');
jest.mock('../../services/profileService');

describe('Matching Service', () => {

  
  describe('getMatchingVolunteers', () => {
    it('should return matching volunteers based on availability, city, and skills', async () => {
      const mockEvent = {
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking']
      };

      const mockProfiles = [
        {
          userId: '1',
          fullName: 'John Doe',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Cleaning']
        },
        {
          userId: '2',
          fullName: 'Jane Smith',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Dog Walking']
        }
      ];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getAllProfiles.mockResolvedValue(mockProfiles);

      const result = await matchingService.getMatchingVolunteers('1');

      expect(result.length).toBe(2);
      expect(result).toEqual(mockProfiles);
    });

    
    it('should return a message if no matching volunteers are found', async () => {
      const mockEvent = {
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking']
      };

      const mockProfiles = [
        {
          userId: '1',
          fullName: 'John Doe',
          city: 'Different City', //different city
          availability: ['2024-06-15'],
          skills: ['Animal Care']
        }
      ];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getAllProfiles.mockResolvedValue(mockProfiles);

      const result = await matchingService.getMatchingVolunteers('1');

      expect(result.message).toBe('No matching volunteers found for this event.');
    });

    //no profiles in the system
    it('should return a message if no profiles exist', async () => {
      const mockEvent = {
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking']
      };

      //no profiles in the system
      const mockProfiles = [];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getAllProfiles.mockResolvedValue(mockProfiles);

      const result = await matchingService.getMatchingVolunteers('1');

      expect(result.message).toBe('No matching volunteers found for this event.');
    });

    // New: invalid event ID
    it('should throw an error for an invalid event ID', async () => {
      eventService.getEventById.mockRejectedValue(new Error('Event not found'));

      await expect(matchingService.getMatchingVolunteers('invalid_id')).rejects.toThrow('Event not found');
    });
  });


  describe('matchVolunteerToEvent', () => {
    
    it('should match multiple volunteers to an event if all criteria are met', async () => {
      const mockEvent = {
        eventName: 'Animal Shelter Cleanup',
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking']
      };

      const mockVolunteers = [
        {
          userId: '1',
          fullName: 'John Doe',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Cleaning']
        },
        {
          userId: '2',
          fullName: 'Jane Smith',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Dog Walking']
        }
      ];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getProfile
        .mockResolvedValueOnce(mockVolunteers[0]) //mock first volunteer
        .mockResolvedValueOnce(mockVolunteers[1]); //mock second volunteer

      const result = await matchingService.matchVolunteerToEvent('1', ['1', '2']);

      expect(result.length).toBe(2);
      expect(result[0].message).toContain('Volunteer John Doe successfully matched');
      expect(result[1].message).toContain('Volunteer Jane Smith successfully matched');
    });

    //no event found
    it('should return 404 if the event does not exist', async () => {
      eventService.getEventById.mockResolvedValue(null);

      await expect(matchingService.matchVolunteerToEvent('invalid_event', ['1']))
        .rejects.toEqual({ status: 404, message: 'Event not found' });
    });
    
  
    it('should handle duplicate volunteer IDs gracefully', async () => {
      const mockEvent = {
        eventName: 'Animal Shelter Cleanup',
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning']
      };

      const mockVolunteer = {
        userId: '1',
        fullName: 'John Doe',
        city: 'Anytown',
        availability: ['2024-06-15'],
        skills: ['Cleaning']
      };

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getProfile.mockResolvedValue(mockVolunteer);

      //duplicate IDs in the volunteer array
      const result = await matchingService.matchVolunteerToEvent('1', ['1', '1']);

      expect(result.length).toBe(2); //ensure it processes both occurrences
      expect(result[0].message).toContain('Volunteer John Doe successfully matched');
    });
  });
});


