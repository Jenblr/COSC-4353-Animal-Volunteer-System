const { Notification } = require('../../../models');
const notificationService = require('../../services/notificationService');
const { Op } = require('sequelize');

jest.mock('../../../models', () => ({
    Notification: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    },
    Sequelize: {
        Op: require('sequelize').Op
    }
}));

describe('Notification Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllNotifications', () => {
        it('should fetch all notifications ordered by creation date', async () => {
            const mockNotifications = [
                { id: 1, message: 'Test 1' },
                { id: 2, message: 'Test 2' }
            ];
            Notification.findAll.mockResolvedValue(mockNotifications);

            const result = await notificationService.getAllNotifications();

            expect(Notification.findAll).toHaveBeenCalledWith({
                order: [['createdAt', 'DESC']]
            });
            expect(result).toEqual(mockNotifications);
        });

        it('should handle errors when fetching notifications', async () => {
            const error = new Error('Database error');
            Notification.findAll.mockRejectedValue(error);

            await expect(notificationService.getAllNotifications())
                .rejects
                .toThrow('Database error');
        });
    });

    describe('getNotificationById', () => {
        it('should fetch a notification by id', async () => {
            const mockNotification = { id: 1, message: 'Test' };
            Notification.findByPk.mockResolvedValue(mockNotification);

            const result = await notificationService.getNotificationById(1);

            expect(Notification.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockNotification);
        });

        it('should handle errors when fetching notification by id', async () => {
            Notification.findByPk.mockRejectedValue(new Error('Not found'));

            await expect(notificationService.getNotificationById(999))
                .rejects
                .toThrow('Not found');
        });

        it('should return null if notification is not found', async () => {
            Notification.findByPk.mockResolvedValue(null);

            const result = await notificationService.getNotificationById(999);

            expect(Notification.findByPk).toHaveBeenCalledWith(999);
            expect(result).toBeNull();
        });
    });

    describe('createEventNotification', () => {
        it('should create a new event notification', async () => {
            const mockEvent = {
                eventName: 'Test Event',
                eventDate: '2024-12-25'
            };
            const expectedMessage = `New volunteer opportunity: Test Event on 2024-12-25!`;
            const mockCreatedNotification = {
                id: 1,
                type: 'New Event',
                message: expectedMessage
            };

            Notification.create.mockResolvedValue(mockCreatedNotification);

            const result = await notificationService.createEventNotification(mockEvent);

            expect(Notification.create).toHaveBeenCalledWith({
                type: 'New Event',
                message: expectedMessage,
                recipientEmail: null,
                isRead: false
            });
            expect(result).toEqual(mockCreatedNotification);
        });

        it('should handle errors when creating an event notification', async () => {
            const mockEvent = {
                eventName: 'Test Event',
                eventDate: '2024-12-25'
            };
            Notification.create.mockRejectedValue(new Error('Create error'));

            await expect(notificationService.createEventNotification(mockEvent))
                .rejects
                .toThrow('Create error');
        });
    });

    describe('createVolunteerMatchNotification', () => {
        it('should create a volunteer match notification', async () => {
            const mockData = {
                volunteerEmail: 'test@example.com',
                eventName: 'Test Event',
                eventDate: '2024-12-25'
            };
            const expectedMessage = `You (test@example.com) have been matched to volunteer at Test Event on 2024-12-25. Please check your volunteer history for details.`;
            
            const mockCreatedNotification = {
                id: 1,
                type: 'Volunteer Match',
                message: expectedMessage,
                recipientEmail: 'test@example.com'
            };

            Notification.create.mockResolvedValue(mockCreatedNotification);

            const result = await notificationService.createVolunteerMatchNotification(
                mockData.volunteerEmail,
                mockData.eventName,
                mockData.eventDate
            );

            expect(Notification.create).toHaveBeenCalledWith({
                type: 'Volunteer Match',
                message: expectedMessage,
                recipientEmail: 'test@example.com',
                isRead: false
            });
            expect(result).toEqual(mockCreatedNotification);
        });

        it('should handle errors when creating a volunteer match notification', async () => {
            Notification.create.mockRejectedValue(new Error('Create error'));

            await expect(
                notificationService.createVolunteerMatchNotification(
                    'test@example.com',
                    'Test Event',
                    '2024-12-25'
                )
            ).rejects.toThrow('Create error');
        });
    });

    describe('deleteNotification', () => {
        it('should delete an existing notification', async () => {
            const mockNotification = {
                id: 1,
                message: 'Test',
                destroy: jest.fn()
            };
            Notification.findByPk.mockResolvedValue(mockNotification);
            mockNotification.destroy.mockResolvedValue(true);

            const result = await notificationService.deleteNotification(1);

            expect(Notification.findByPk).toHaveBeenCalledWith(1);
            expect(mockNotification.destroy).toHaveBeenCalled();
            expect(result).toEqual(mockNotification);
        });

        it('should handle errors when deleting a notification', async () => {
            Notification.findByPk.mockRejectedValue(new Error('Delete error'));

            await expect(notificationService.deleteNotification(1))
                .rejects
                .toThrow('Delete error');
        });
    });

    describe('getNotificationsForUser', () => {
        it('should fetch notifications for a specific user including global notifications', async () => {
            const userEmail = 'test@example.com';
            const mockNotifications = [
                { id: 1, message: 'Global notification', recipientEmail: null },
                { id: 2, message: 'User notification', recipientEmail: userEmail }
            ];

            Notification.findAll.mockResolvedValue(mockNotifications);

            const result = await notificationService.getNotificationsForUser(userEmail);

            expect(Notification.findAll).toHaveBeenCalledWith({
                where: {
                    [Op.or]: [
                        { recipientEmail: null },
                        { recipientEmail: userEmail }
                    ]
                },
                order: [['createdAt', 'DESC']]
            });
            expect(result).toEqual(mockNotifications);
        });

        it('should handle errors when fetching user notifications', async () => {
            const userEmail = 'test@example.com';
            Notification.findAll.mockRejectedValue(new Error('Database error'));

            await expect(notificationService.getNotificationsForUser(userEmail))
                .rejects
                .toThrow('Database error');
        });

        it('should return an empty array if no notifications are found', async () => {
            const userEmail = 'test@example.com';
            Notification.findAll.mockResolvedValue([]);

            const result = await notificationService.getNotificationsForUser(userEmail);

            expect(Notification.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});
