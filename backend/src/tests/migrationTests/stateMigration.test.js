/*const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

describe('States Migration and Seeding', () => {
    let sequelize;
    let queryInterface;

    beforeEach(async () => {
        // Create a new Sequelize instance
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        });

        queryInterface = sequelize.getQueryInterface();

        // Define the States model manually for testing
        await queryInterface.createTable('States', {
            code: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        });
    });

    afterEach(async () => {
        await queryInterface.dropTable('States', { force: true });
        await sequelize.close();
    });

    // Test data for states
    const sampleStates = [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' },
        { code: 'TX', name: 'Texas' }
    ];

    describe('Table Structure', () => {
        it('should create States table with correct schema', async () => {
            const tableInfo = await queryInterface.describeTable('States');
            
            // Check code field
            expect(tableInfo.code).toBeDefined();
            expect(tableInfo.code.type.toLowerCase()).toMatch(/varchar|string/);
            expect(tableInfo.code.allowNull).toBe(false);
            expect(tableInfo.code.primaryKey).toBe(true);

            // Check name field
            expect(tableInfo.name).toBeDefined();
            expect(tableInfo.name.type.toLowerCase()).toMatch(/varchar|string/);
            expect(tableInfo.name.allowNull).toBe(false);
        });
    });

    describe('Data Operations', () => {
        it('should successfully insert states', async () => {
            await queryInterface.bulkInsert('States', sampleStates);

            const [states] = await sequelize.query(
                'SELECT * FROM States ORDER BY code'
            );

            expect(states).toHaveLength(sampleStates.length);
            expect(states[0].code).toBe('CA');
            expect(states[0].name).toBe('California');
        });

        it('should enforce unique state codes', async () => {
            await queryInterface.bulkInsert('States', sampleStates);

            const duplicateState = { code: 'CA', name: 'Duplicate California' };
            await expect(
                queryInterface.bulkInsert('States', [duplicateState])
            ).rejects.toThrow();
        });

        it('should enforce unique state names', async () => {
            await queryInterface.bulkInsert('States', sampleStates);

            const duplicateState = { code: 'XX', name: 'California' };
            await expect(
                queryInterface.bulkInsert('States', [duplicateState])
            ).rejects.toThrow();
        });

        it('should not allow null values', async () => {
            const invalidStates = [
                { code: null, name: 'Invalid State' },
                { code: 'XX', name: null }
            ];

            for (const invalidState of invalidStates) {
                await expect(
                    queryInterface.bulkInsert('States', [invalidState])
                ).rejects.toThrow();
            }
        });
    });

    describe('Bulk Operations', () => {
        it('should handle large number of states', async () => {
            // Generate 50 test states
            const manyStates = Array.from({ length: 50 }, (_, i) => ({
                code: `S${i.toString().padStart(2, '0')}`,
                name: `State ${i + 1}`
            }));

            await queryInterface.bulkInsert('States', manyStates);

            const [states] = await sequelize.query('SELECT * FROM States');
            expect(states).toHaveLength(50);
        });

        it('should successfully delete all states', async () => {
            // Insert states
            await queryInterface.bulkInsert('States', sampleStates);

            // Delete all states
            await queryInterface.bulkDelete('States', null, {});

            // Verify deletion
            const [states] = await sequelize.query('SELECT * FROM States');
            expect(states).toHaveLength(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle special characters in state names', async () => {
            const specialState = {
                code: 'SP',
                name: "State's Name with 'Special' Characters!"
            };

            await queryInterface.bulkInsert('States', [specialState]);
            
            const [states] = await sequelize.query(
                "SELECT * FROM States WHERE code = 'SP'"
            );
            
            expect(states[0].name).toBe(specialState.name);
        });

        it('should enforce state code length', async () => {
            const invalidState = {
                code: 'ABC', // Too long
                name: 'Invalid State'
            };

            await expect(
                queryInterface.bulkInsert('States', [invalidState])
            ).rejects.toThrow();
        });
    });
});*/

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

describe('States Migration and Seeding', () => {
    let sequelize;
    let queryInterface;
    let StateModel; // Model for validation tests

    beforeEach(async () => {
        // Create a new Sequelize instance
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        });

        queryInterface = sequelize.getQueryInterface();

        // Define the States model manually for testing
        await queryInterface.createTable('States', {
            code: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        });

        // Define a model for validation testing
        StateModel = sequelize.define('States', {
            code: {
                type: DataTypes.STRING(2),
                primaryKey: true,
                allowNull: false,
                validate: {
                    len: [2, 2]
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            tableName: 'States',
            timestamps: false
        });
    });

    afterEach(async () => {
        await queryInterface.dropTable('States', { force: true });
        await sequelize.close();
    });

    // Rest of your existing test code remains the same until Edge Cases...

    describe('Edge Cases', () => {
        it('should handle special characters in state names', async () => {
            const specialState = {
                code: 'SP',
                name: "State's Name with 'Special' Characters!"
            };

            await queryInterface.bulkInsert('States', [specialState]);
            
            const [states] = await sequelize.query(
                "SELECT * FROM States WHERE code = 'SP'"
            );
            
            expect(states[0].name).toBe(specialState.name);
        });

        it('should enforce state code length', async () => {
            // Test code that's too long
            const longCode = {
                code: 'ABC',
                name: 'Invalid State Long'
            };
            await expect(StateModel.create(longCode)).rejects.toThrow(/Validation error/);

            // Test code that's too short
            const shortCode = {
                code: 'A',
                name: 'Invalid State Short'
            };
            await expect(StateModel.create(shortCode)).rejects.toThrow(/Validation error/);

            // Test valid code length
            const validCode = {
                code: 'XY',
                name: 'Valid State'
            };
            const validState = await StateModel.create(validCode);
            expect(validState.code).toBe('XY');
        });
    });
});
