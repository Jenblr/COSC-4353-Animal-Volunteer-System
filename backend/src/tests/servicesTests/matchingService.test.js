const matchingService = require('../../services/matchingService');
const eventService = require('../../services/eventService');

jest.mock('../../services/eventService');

describe('Matching Service', () => {
  describe('getMatchingVolunteers', () => {
    it('should return matching volunteers', async () => {
      const mockEvent = {
        eventId: '123',
        eventDate: '2024-06-01',
        city: 'Anytown',
        requiredSkills: ['Animal Care']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      const result = await matchingService.getMatchingVolunteers('123');

      expect(result).toHaveLength(1);
      expect(result[0].fullName).toBe('John Doe');
    });

    it('should return no matching volunteers message', async () => {
      const mockEvent = {
        eventId: '123',
        eventDate: '2024-12-01',
        city: 'Nowhere',
        requiredSkills: ['Cooking']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      const result = await matchingService.getMatchingVolunteers('123');

      expect(result).toEqual({ message: "No matching volunteers found for this event." });
    });
  });
  describe('matchVolunteerToEvent', () => {
    it('should successfully match volunteer to event', async () => {
      const mockEvent = {
        eventId: '123',
        eventName: 'Pet Care Day',
        eventDate: '2024-06-01',
        city: 'Anytown',
        requiredSkills: ['Animal Care']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      const result = await matchingService.matchVolunteerToEvent('123', '1');

      expect(result).toEqual({
        message: 'Volunteer John Doe successfully matched to event Pet Care Day'
      });
    });

    it('should throw error if volunteer not found', async () => {
      const mockEvent = {
        eventId: '123',
        eventDate: '2024-06-01',
        city: 'Anytown',
        requiredSkills: ['Animal Care']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      await expect(matchingService.matchVolunteerToEvent('123', 'nonexistent'))
        .rejects.toEqual({ status: 400, message: 'Volunteer not found' });
    });

    it('should throw error if volunteer is not available', async () => {
      const mockEvent = {
        eventId: '123',
        eventDate: '2024-12-01',
        city: 'Anytown',
        requiredSkills: ['Animal Care']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      await expect(matchingService.matchVolunteerToEvent('123', '1'))
        .rejects.toEqual({ status: 400, message: 'Volunteer is not available on the event date' });
    });

    //test for city mismatch
    it('should throw error if volunteer city does not match event city', async () => {
      const mockEvent = {
        eventId: '123',
        eventDate: '2024-06-01',
        city: 'Differenttown',
        requiredSkills: ['Animal Care']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      await expect(matchingService.matchVolunteerToEvent('123', '1'))
        .rejects.toEqual({ status: 400, message: 'Volunteer is not in the same city as the event' });
    });

    //test for skills mismatch
    it('should throw error if volunteer does not have required skills', async () => {
      const mockEvent = {
        eventId: '123',
        eventDate: '2024-06-01',
        city: 'Anytown',
        requiredSkills: ['Cooking']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      await expect(matchingService.matchVolunteerToEvent('123', '1'))
        .rejects.toEqual({ status: 400, message: 'Volunteer does not have the required skills for this event' });
    });

    //test for successful match with multiple skills
    it('should successfully match volunteer with multiple matching skills', async () => {
      const mockEvent = {
        eventId: '123',
        eventName: 'Animal Shelter Day',
        eventDate: '2024-07-15',
        city: 'Houston',
        requiredSkills: ['Grooming', 'Cleaning']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      const result = await matchingService.matchVolunteerToEvent('123', '2');

      expect(result).toEqual({
        message: 'Volunteer Jane Smith successfully matched to event Animal Shelter Day'
      });
    });

    //test for partial skills match (should still succeed)
    it('should successfully match volunteer with partial skills match', async () => {
      const mockEvent = {
        eventId: '123',
        eventName: 'Pet Grooming Day',
        eventDate: '2024-07-15',
        city: 'Houston',
        requiredSkills: ['Grooming', 'Animal Care']
      };
      eventService.getEventById.mockResolvedValue(mockEvent);

      const result = await matchingService.matchVolunteerToEvent('123', '2');

      expect(result).toEqual({
        message: 'Volunteer Jane Smith successfully matched to event Pet Grooming Day'
      });
    });
  });
});
