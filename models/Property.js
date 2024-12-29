const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyType: { type: String, enum: ['Residential', 'Commercial', 'Co-Living', 'Vacation Rental', 'Land'], required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    neighborhood: { type: String },
    pinnedLocation: { type: { lat: Number, lng: Number }, required: true }
  },
  features: {
    bedrooms: { type: Number, required: false },
    bathrooms: { type: Number, required: false },
    size: { type: Number, required: false }, // Square footage
    furnished: { type: Boolean, required: false },
    amenities: [String], // Array of selected amenities
    floorPlan: { type: String, required: false } // File URL
  },
  media: {
    images: [String], // Array of image URLs
    videos: [String]  // Array of video URLs (optional)
  },
  pricing: {
    price: { type: Number, required: true },
    paymentTerms: { type: String, enum: ['Monthly', 'Yearly'], required: false },
    additionalCosts: { type: String, required: false } // Maintenance fees, utilities
  },
  details: {
    description: { type: String, required: true },
    preferredTenant: { type: String, required: false },
    availabilityDate: { type: Date, required: false }
  },
  published: { type: Boolean, default: false }, // Status of the listing
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
 