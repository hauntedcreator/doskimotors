const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [String],
    images: [{
      url: String,
      public_id: String,
    }],
    badges: [String],
    fuelType: {
      type: String,
      enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
      required: true,
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      required: true,
    },
    condition: {
      type: String,
      enum: ['New', 'Used', 'Certified Pre-Owned'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Reserved'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
carSchema.index({
  title: 'text',
  brand: 'text',
  model: 'text',
  description: 'text',
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car; 