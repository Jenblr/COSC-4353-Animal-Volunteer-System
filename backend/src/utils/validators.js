/* 'validators.js' file:
- Handles input validation 
*/

const { body, validationResult } = require('express-validator');

exports.validateRegistration = [
    body('username')
        .isEmail().withMessage('Username must be a valid email address'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isIn(['admin', 'volunteer']).withMessage('Role must be either admin or volunteer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateLogin = [
    body('username')
        .isEmail().withMessage('Username must be a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
