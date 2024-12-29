const authorizeLandlord = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Property Owner/Landlord') {
      return res.status(403).json({ error: 'Access denied: Only landlords can perform this action' });
    }
    next();
  };
  
  module.exports = { authorizeLandlord };
  