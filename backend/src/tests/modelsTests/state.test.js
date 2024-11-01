const { sequelize, State } = require('../../../models');

describe('State Model', () => {
    beforeAll(async () => {
        // Sync database before tests
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Close database connection after tests
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear data before each test
        await State.destroy({ truncate: true, cascade: true });
    });

    test('should create a state with valid data', async () => {
        const stateData = {
            code: 'TX',
            name: 'Texas'
        };

        const state = await State.create(stateData);
        expect(state.code).toBe('TX');
        expect(state.name).toBe('Texas');
    });

    test('should not allow null code', async () => {
        const stateData = {
            code: null,
            name: 'Texas'
        };

        await expect(State.create(stateData)).rejects.toThrow();
    });

    test('should not allow null name', async () => {
        const stateData = {
            code: 'TX',
            name: null
        };

        await expect(State.create(stateData)).rejects.toThrow();
    });

    test('should enforce code length of 2 characters', async () => {
        const stateData = {
            code: 'TEX',
            name: 'Texas'
        };

        await expect(State.create(stateData)).rejects.toThrow();
    });

    test('should not allow duplicate state codes', async () => {
        const stateData = {
            code: 'TX',
            name: 'Texas'
        };

        await State.create(stateData);
        await expect(State.create(stateData)).rejects.toThrow();
    });
});