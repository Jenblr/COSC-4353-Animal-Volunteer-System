// Middleware to validate notification data
const validateNotification = (req, res, next) => {
    const { type, message } = req.body;
  
    if (!type || typeof type !== 'string') {
      return res.status(400).json({
        error: "Invalid notification: 'type' is a required field and must be a string.",
      });
    }
  
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: "Invalid notification: 'message' is a required field and must be a string.",
      });
    }
  
    next();
  };
  
  module.exports = { validateNotification };