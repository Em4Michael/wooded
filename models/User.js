const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    default: null,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Property Owner/Landlord', 'Tenant/Buyer', 'Service Provider', 'Legal Advisor'],
    required: true,
  },
  serviceInterests: {
    type: [String],
    enum: ['Property Listing', 'Home Loans', 'Facility Management', 'Real Estate Legal Services'],
    default: [],
  },
  propertyListings: [
    {
      location: String,
      propertyType: String,
      listingPurpose: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);