// // matchingService.test.js

const matchingService = require('../../services/matchingService');
const eventService = require('../../services/eventService');
const profileService = require('../../services/profileService');

//mock the dependencies
jest.mock('../../services/eventService');
jest.mock('../../services/profileService');

describe('matchingService', () => {
  describe('getMatchingVolunteers', () => {
      it('should return matching volunteers based on availability, city, and skills', async () => {
          const mockEvent = {
              eventDate: '2024-10-15',
              city: 'Houston',
              requiredSkills: ['Cleaning', 'Organizing shelter donations']
          };

          const mockProfiles = [
              {
                  userId: '1',
                  fullName: 'John Doe',
                  city: 'Houston',
                  availability: ['2024-10-15'],
                  skills: ['Cleaning', 'Animal Care']
              },
              {
                  userId: '2',
                  fullName: 'Jane Smith',
                  city: 'Houston',
                  availability: ['2024-10-15'],
                  skills: ['Grooming', 'Cleaning']
              }
          ];

          eventService.getEventById.mockResolvedValue(mockEvent);
          profileService.getAllProfiles.mockResolvedValue(mockProfiles);

          const result = await matchingService.getMatchingVolunteers(1);

          expect(result.length).toBe(2);
          expect(result).toEqual(mockProfiles);
      });

      it('should return a message if no matching volunteers are found', async () => {
          const mockEvent = {
              eventDate: '2024-10-15',
              city: 'Houston',
              requiredSkills: ['Cleaning', 'Organizing shelter donations']
          };

          const mockProfiles = [
              {
                  userId: '1',
                  fullName: 'John Doe',
                  city: 'Austin', //different city
                  availability: ['2024-10-15'],
                  skills: ['Animal Care']
              }
          ];

          eventService.getEventById.mockResolvedValue(mockEvent);
          profileService.getAllProfiles.mockResolvedValue(mockProfiles);

          const result = await matchingService.getMatchingVolunteers(1);

          expect(result.message).toBe('No matching volunteers found for this event.');
      });
  });

  describe('matchVolunteerToEvent', () => {
      it('should match a volunteer to an event if all criteria are met', async () => {
          const mockEvent = {
              eventName: 'Animal Shelter Cleanup',
              eventDate: '2024-10-15',
              city: 'Houston',
              requiredSkills: ['Cleaning', 'Organizing shelter donations']
          };

          const mockVolunteer = {
              userId: '1',
              fullName: 'John Doe',
              city: 'Houston',
              availability: ['2024-10-15'],
              skills: ['Cleaning']
          };

          eventService.getEventById.mockResolvedValue(mockEvent);
          profileService.getProfile.mockResolvedValue(mockVolunteer);

          const result = await matchingService.matchVolunteerToEvent(1, '1');

          expect(result.message).toBe('Volunteer John Doe successfully matched to event Animal Shelter Cleanup');
      });

      it('should throw an error if the volunteer is not available on the event date', async () => {
          const mockEvent = {
              eventName: 'Animal Shelter Cleanup',
              eventDate: '2024-10-15',
              city: 'Houston',
              requiredSkills: ['Cleaning', 'Organizing shelter donations']
          };

          const mockVolunteer = {
              userId: '1',
              fullName: 'John Doe',
              city: 'Houston',
              availability: ['2024-11-15'], //different date
              skills: ['Cleaning']
          };

          eventService.getEventById.mockResolvedValue(mockEvent);
          profileService.getProfile.mockResolvedValue(mockVolunteer);

          await expect(matchingService.matchVolunteerToEvent(1, '1')).rejects.toEqual({
              status: 400,
              message: 'Volunteer is not available on the event date'
          });
      });

      it('should throw an error if the volunteer is not in the same city as the event', async () => {
          const mockEvent = {
              eventName: 'Animal Shelter Cleanup',
              eventDate: '2024-10-15',
              city: 'Houston',
              requiredSkills: ['Cleaning', 'Organizing shelter donations']
          };

          const mockVolunteer = {
              userId: '1',
              fullName: 'John Doe',
              city: 'Austin', //different city
              availability: ['2024-10-15'],
              skills: ['Cleaning']
          };

          eventService.getEventById.mockResolvedValue(mockEvent);
          profileService.getProfile.mockResolvedValue(mockVolunteer);

          await expect(matchingService.matchVolunteerToEvent(1, '1')).rejects.toEqual({
              status: 400,
              message: 'Volunteer is not in the same city as the event'
          });
      });

      it('should throw an error if the volunteer does not have the required skills', async () => {
          const mockEvent = {
              eventName: 'Animal Shelter Cleanup',
              eventDate: '2024-10-15',
              city: 'Houston',
              requiredSkills: ['Cleaning', 'Organizing shelter donations']
          };

          const mockVolunteer = {
              userId: '1',
              fullName: 'John Doe',
              city: 'Houston',
              availability: ['2024-10-15'],
              skills: ['Animal Care'] //missing required skill
          };

          eventService.getEventById.mockResolvedValue(mockEvent);
          profileService.getProfile.mockResolvedValue(mockVolunteer);

          await expect(matchingService.matchVolunteerToEvent(1, '1')).rejects.toEqual({
              status: 400,
              message: 'Volunteer does not have the required skills for this event'
          });
      });
  });
});