const matchingService = require('../../services/matchingService');
const eventService = require('../../services/eventService');
const profileService = require('../../services/profileService');

jest.mock('../../services/eventService');
jest.mock('../../services/profileService');

describe('Matching Service', () => {

  describe('getMatchingVolunteers', () => {

    it('should return volunteers matching the event requirements for availability, city, and skills', async () => {
      const mockEvent = {
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking'],
      };

      const mockProfiles = [
        {
          userId: '1',
          fullName: 'John Doe',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Cleaning', 'Dog Walking'],
        },
        {
          userId: '2',
          fullName: 'Jane Smith',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Dog Walking'],
        },
      ];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getAllProfiles.mockResolvedValue(mockProfiles);

      const result = await matchingService.getMatchingVolunteers('1');

      expect(result.length).toBe(2);
      expect(result).toEqual(mockProfiles);
    });

    it('should return no volunteers if none match the event requirements', async () => {
      const mockEvent = {
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking'],
      };

      const mockProfiles = [
        {
          userId: '1',
          fullName: 'John Doe',
          city: 'DifferentCity', //city mismatch
          availability: ['2024-06-15'],
          skills: ['Cleaning'],
        },
        {
          userId: '2',
          fullName: 'Jane Smith',
          city: 'Anytown',
          availability: ['2024-06-20'], //date mismatch
          skills: ['Dog Walking'],
        },
      ];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getAllProfiles.mockResolvedValue(mockProfiles);

      const result = await matchingService.getMatchingVolunteers('1');

      expect(result.message).toBe('No matching volunteers found for this event.');
    });

    it('should throw an error if event is not found', async () => {
      eventService.getEventById.mockRejectedValue(new Error('Event not found'));

      await expect(matchingService.getMatchingVolunteers('invalid_event'))
        .rejects.toThrow('Event not found');
    });

    it('should return an empty list if there are no profiles in the system', async () => {
      const mockEvent = {
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning', 'Dog Walking'],
      };

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getAllProfiles.mockResolvedValue([]);

      const result = await matchingService.getMatchingVolunteers('1');

      expect(result.message).toBe('No matching volunteers found for this event.');
    });

  });

  describe('matchVolunteerToEvent', () => {

    it('should match volunteers to an event if they meet all criteria', async () => {
      const mockEvent = {
        eventName: 'Animal Shelter Cleanup',
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning'],
      };

      const mockVolunteers = [
        {
          userId: '1',
          fullName: 'John Doe',
          city: 'Anytown',
          availability: ['2024-06-15'],
          skills: ['Cleaning'],
        },
      ];

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getProfile.mockResolvedValueOnce(mockVolunteers[0]);

      const result = await matchingService.matchVolunteerToEvent('1', ['1']);

      expect(result.length).toBe(1);
      expect(result[0].message).toContain('Volunteer John Doe successfully matched to event Animal Shelter Cleanup');
    });

    it('should return a 404 if the event does not exist', async () => {
      eventService.getEventById.mockResolvedValue(null);

      await expect(matchingService.matchVolunteerToEvent('invalid_event', ['1']))
        .rejects.toEqual({ status: 404, message: 'Event not found' });
    });

    it('should return an error if the volunteer is not available on the event date', async () => {
      const mockEvent = {
        eventName: 'Animal Shelter Cleanup',
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning'],
      };

      const mockVolunteer = {
        userId: '1',
        fullName: 'John Doe',
        city: 'Anytown',
        availability: ['2024-06-20'], //date mismatch
        skills: ['Cleaning'],
      };

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getProfile.mockResolvedValue(mockVolunteer);

      const result = await matchingService.matchVolunteerToEvent('1', ['1']);

      expect(result.length).toBe(1);
      expect(result[0].message).toContain('Volunteer is not available on the event date');
    });

    it('should return an error if the volunteer does not have the required skills', async () => {
      const mockEvent = {
        eventName: 'Animal Shelter Cleanup',
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning'],
      };

      const mockVolunteer = {
        userId: '1',
        fullName: 'John Doe',
        city: 'Anytown',
        availability: ['2024-06-15'],
        skills: ['Dog Walking'], //skill mismatch
      };

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getProfile.mockResolvedValue(mockVolunteer);

      const result = await matchingService.matchVolunteerToEvent('1', ['1']);

      expect(result.length).toBe(1);
      expect(result[0].message).toContain('Volunteer does not have the required skills for this event');
    });

    it('should handle duplicate volunteer IDs gracefully and process both occurrences', async () => {
      const mockEvent = {
        eventName: 'Animal Shelter Cleanup',
        eventDate: '2024-06-15',
        city: 'Anytown',
        requiredSkills: ['Cleaning'],
      };

      const mockVolunteer = {
        userId: '1',
        fullName: 'John Doe',
        city: 'Anytown',
        availability: ['2024-06-15'],
        skills: ['Cleaning'],
      };

      eventService.getEventById.mockResolvedValue(mockEvent);
      profileService.getProfile.mockResolvedValue(mockVolunteer);

      //duplicate IDs in the volunteer array
      const result = await matchingService.matchVolunteerToEvent('1', ['1', '1']);

      expect(result.length).toBe(2);
      expect(result[0].message).toContain('Volunteer John Doe successfully matched');
      expect(result[1].message).toContain('Volunteer John Doe successfully matched');
    });

  });

});

