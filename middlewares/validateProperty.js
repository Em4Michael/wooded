const validatePropertyCreation = (req, res, next) => {
    const { propertyType, location, pricing, details } = req.body;
  
    if (!propertyType || !location?.address || !pricing?.price || !details?.description) {
      return res.status(400).json({ error: 'Missing required property fields' });
    }
  
    next();
  };
  
  module.exports = { validatePropertyCreation };
  