const { sequelize, Profile, User, State } = require('../../../models');

describe('Profile Model', () => {
    beforeAll(async () => {
        // Synchronize database
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear all data in Profile, User, and State tables
        await Profile.destroy({ truncate: true, cascade: true });
        await User.destroy({ truncate: true, cascade: true });
        await State.destroy({ truncate: true, cascade: true });
    });

    describe('Profile Creation', () => {
        let user;
        let state;

        beforeEach(async () => {
            // Create test state and user for profile associations
            state = await State.create({
                code: 'TX',
                name: 'Texas'
            });

            user = await User.create({
                email: 'test@example.com',
                password: 'password123',
                role: 'volunteer'
            });
        });

        test('should create profile with all fields', async () => {
            const profileData = {
                userId: user.id,
                fullName: 'Test User',
                address1: '123 Test St',
                address2: 'Apt 4',
                city: 'Test City',
                state: 'TX', // Matches the code created in State
                zipCode: '12345',
                skills: ['Skill1', 'Skill2'],
                preferences: 'Test preferences',
                availability: [new Date()]
            };

            const profile = await Profile.create(profileData);

            expect(profile.fullName).toBe(profileData.fullName);
            expect(profile.userId).toBe(user.id);
            expect(profile.state).toBe('TX');
            expect(profile.skills).toHaveLength(2);
        });

        test('should create admin profile with minimal fields', async () => {
            const adminProfile = {
                userId: user.id,
                fullName: 'Admin User'
            };

            const profile = await Profile.create(adminProfile);

            expect(profile.fullName).toBe(adminProfile.fullName);
            expect(profile.userId).toBe(user.id);
            expect(profile.address1).toBeNull();
            expect(profile.skills).toEqual([]);
        });

        test('should not create profile without required fields', async () => {
            const invalidProfile = {
                userId: user.id
                // missing fullName
            };

            await expect(Profile.create(invalidProfile)).rejects.toThrow();
        });

        test('should not create profile with invalid state reference', async () => {
            const invalidStateProfile = {
                userId: user.id,
                fullName: 'Test User',
                state: 'XX' // Non-existent state code
            };

            await expect(Profile.create(invalidStateProfile)).rejects.toThrow();
        });
    });

    describe('Profile Associations', () => {
        test('should fetch profile with associated user and state', async () => {
            const user = await User.create({
                email: 'associateduser@example.com',
                password: 'password123',
                role: 'volunteer'
            });

            const state = await State.create({
                code: 'CA',
                name: 'California'
            });

            const profile = await Profile.create({
                userId: user.id,
                fullName: 'Associated User',
                state: 'CA'
            });

            // Fetch profile with associated data
            const fetchedProfile = await Profile.findOne({
                where: { userId: user.id },
                include: [
                    { model: User, as: 'User' },
                    { model: State, as: 'stateDetails' }
                ]
            });

            expect(fetchedProfile.User.email).toBe('associateduser@example.com');
            expect(fetchedProfile.stateDetails.name).toBe('California');
        });
    });
});



