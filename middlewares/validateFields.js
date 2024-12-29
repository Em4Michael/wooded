const validateRole = (req, res, next) => {
  const { role } = req.body;
  const validRoles = ['Property Owner/Landlord', 'Tenant/Buyer', 'Service Provider', 'Legal Advisor'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  next();
};

const validateServices = (req, res, next) => {
  const { serviceInterests } = req.body;
  const validServices = ['Property Listing', 'Home Loans', 'Facility Management', 'Real Estate Legal Services'];
  if (!serviceInterests.every(service => validServices.includes(service))) {
    return res.status(400).json({ error: 'Invalid service interests' });
  }
  next();
};

const validatePropertyListing = (req, res, next) => {
  const { location, propertyType, listingPurpose } = req.body;
  if (!location || !propertyType || !listingPurpose) {
    return res.status(400).json({ error: 'All property listing fields are required' });
  }
  next();
};



module.exports = { validateRole, validateServices, validatePropertyListing };
