const Property = require('../models/Property');

// Create Property
const createProperty = async (req, res) => {
  const {
    propertyType,
    location,
    features,
    media, 
    pricing,
    details,
  } = req.body;
  const { userId, role } = req.user;

  try {
    // Ensure only landlords can create properties
    if (role !== 'Property Owner/Landlord') {
      return res.status(403).json({ error: 'Only landlords can create properties' });
    }

    // Validate required fields
    if (!propertyType || !location || !pricing || !details?.description) {
      return res.status(400).json({ error: 'Missing required property fields' });
    }

    // Create a new property instance
    const property = new Property({
      owner: userId,
      propertyType,
      location,
      features,
      media,
      pricing,
      details,
    });

    // Save the property to the database
    await property.save();
    res.status(201).json({ message: 'Property listed successfully', property });
  } catch (err) {
    console.error('Property creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get All Properties
const getAllProperties = async (req, res) => {
  const { 
    page = 1, 
    limit = 3, 
    propertyType, 
    city, 
    neighborhood, 
    bedrooms, 
    bathrooms, 
    size, 
    furnished, 
    amenities, 
    priceMin, 
    priceMax, 
    paymentTerms, 
    preferredTenant, 
    availabilityDate 
  } = req.query;

  try {
    // Construct the query object
    const query = {};

    if (propertyType) query.propertyType = propertyType;
    if (city) query['location.city'] = { $regex: city, $options: 'i' }; // Case-insensitive match
    if (neighborhood) query['location.neighborhood'] = { $regex: neighborhood, $options: 'i' };

    if (bedrooms) query['features.bedrooms'] = { $gte: Number(bedrooms) }; // Minimum bedrooms
    if (bathrooms) query['features.bathrooms'] = { $gte: Number(bathrooms) }; // Minimum bathrooms
    if (size) query['features.size'] = { $gte: Number(size) }; // Minimum size
    if (furnished !== undefined) query['features.furnished'] = furnished === 'true'; // Convert to boolean
    if (amenities) query['features.amenities'] = { $all: amenities.split(',') }; // All selected amenities

    if (priceMin || priceMax) {  
      query['pricing.price'] = {};
      if (priceMin) query['pricing.price'].$gte = Number(priceMin); // Minimum price
      if (priceMax) query['pricing.price'].$lte = Number(priceMax); // Maximum price
    }

    if (paymentTerms) query['pricing.paymentTerms'] = paymentTerms;
    if (preferredTenant) query['details.preferredTenant'] = { $regex: preferredTenant, $options: 'i' };
    if (availabilityDate) query['details.availabilityDate'] = { $gte: new Date(availabilityDate) }; // Available on or after

    // Get total count for pagination
    const total = await Property.countDocuments(query);

    // Fetch paginated results
    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Send response
    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      properties,
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get Property by ID
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId).populate('owner', 'name email');
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ property });
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Property
const updateProperty = async (req, res) => {
  const { propertyId, location, propertyType, purpose, description } = req.body;
  const { userId, role } = req.user;

  try {
    if (role !== 'Property Owner/Landlord') {
      return res.status(403).json({ error: 'Only landlords can update properties' });
    }

    const property = await Property.findOne({ _id: propertyId, owner: userId });
    if (!property) {
      return res.status(404).json({ error: 'Property not found or unauthorized' });
    }

    property.location = location || property.location;
    property.propertyType = propertyType || property.propertyType;
    property.purpose = purpose || property.purpose;
    property.description = description || property.description;

    await property.save();
    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (err) {
    console.error('Property update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Property
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { userId, role } = req.user;

  try {
    if (role !== 'Property Owner/Landlord') {
      return res.status(403).json({ error: 'Only landlords can delete properties' });
    }

    const property = await Property.findOneAndDelete({ _id: propertyId, owner: userId });
    if (!property) {
      return res.status(404).json({ error: 'Property not found or unauthorized' });
    }

    res.status(200).json({ message: 'Property deleted successfully', property });
  } catch (err) {
    console.error('Property deletion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty }
