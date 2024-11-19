const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const UserModel = require('../../../models/user');

describe('User Model', () => {
  let sequelize;
  let User, Profile, VolunteerHistory;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    
    User = UserModel(sequelize, DataTypes);
    
    Profile = sequelize.define('Profile', {
      userId: DataTypes.INTEGER,
    });

    VolunteerHistory = sequelize.define('VolunteerHistory', {
      volunteerId: DataTypes.INTEGER,
    });

    User.associate({ Profile, VolunteerHistory });

    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('Model Validations', () => {
    it('should allow valid email and password', async () => {
      const user = await User.create({
        email: 'valid@example.com',
        password: 'password123',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('valid@example.com');
    });

    it('should throw a validation error for invalid email', async () => {
      await expect(
        User.create({
          email: 'invalid-email',
          password: 'password123',
        })
      ).rejects.toThrow('Validation isEmail on email failed');
    });

    it('should throw a validation error when email is null', async () => {
      await expect(
        User.create({
          password: 'password123',
        })
      ).rejects.toThrow('User.email cannot be null');
    });

    it('should throw a validation error when password is null', async () => {
      await expect(
        User.create({
          email: 'user@example.com',
        })
      ).rejects.toThrow('User.password cannot be null');
    });
  });

  describe('Hooks', () => {
    it('should hash the password before creation', async () => {
      const user = await User.create({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(user.password).not.toBe('password123');
      const isMatch = await bcrypt.compare('password123', user.password);
      expect(isMatch).toBe(true);
    });

    it('should hash the password before update if changed', async () => {
      const user = await User.create({
        email: 'user@example.com',
        password: 'password123',
      });

      const originalPassword = user.password;
      user.password = 'newpassword123';
      user.changed('password', true); 
      await user.save();

      expect(user.password).not.toBe(originalPassword);
      const isMatch = await bcrypt.compare('newpassword123', user.password);
      expect(isMatch).toBe(true);
    });

    it('should not hash the password if it has not changed during update', async () => {
      const user = await User.create({
        email: 'user@example.com',
        password: 'password123',
      });

      const originalPassword = user.password;
      user.email = 'newemail@example.com';
      await user.save();

      expect(user.password).toBe(originalPassword);
    });
  });

  describe('Instance Methods', () => {
    it('should validate the password correctly', async () => {
      const user = await User.create({
        email: 'user@example.com',
        password: 'password123',
      });

      const isValid = await user.validatePassword('password123');
      expect(isValid).toBe(true);

      const isInvalid = await user.validatePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Associations', () => {
    it('should have defined associations', () => {
      const associations = User.associations;

      expect(associations.Profile).toBeDefined();
      expect(associations.VolunteerHistories).toBeDefined();
      expect(associations.Profile.foreignKey).toBe('userId');
      expect(associations.VolunteerHistories.foreignKey).toBe('volunteerId');
    });
  });
});