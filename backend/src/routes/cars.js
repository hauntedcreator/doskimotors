const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/auth');
const Car = require('../models/car');

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// @route   GET /api/cars
// @desc    Get all cars with filters
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { brand, price, search, sort = '-createdAt' } = req.query;
    const filter = {};

    if (brand && brand !== 'all') {
      filter.brand = brand;
    }

    if (price) {
      const [min, max] = price.split('-');
      if (min && max) {
        filter.price = { $gte: parseInt(min), $lte: parseInt(max) };
      } else if (min === '80000-plus') {
        filter.price = { $gte: 80000 };
      }
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const cars = await Car.find(filter).sort(sort);
    res.json(cars);
  })
);

// @route   GET /api/cars/:id
// @desc    Get car by ID
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404);
      throw new Error('Car not found');
    }
  })
);

// @route   POST /api/cars
// @desc    Create a car
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    const imageUploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'car-sales',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );

        stream.end(file.buffer);
      });
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    const car = await Car.create({
      ...req.body,
      images: uploadedImages,
    });

    res.status(201).json(car);
  })
);

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);

    if (car) {
      Object.assign(car, req.body);
      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404);
      throw new Error('Car not found');
    }
  })
);

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);

    if (car) {
      // Delete images from Cloudinary
      const deletePromises = car.images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      );
      await Promise.all(deletePromises);

      await car.deleteOne();
      res.json({ message: 'Car removed' });
    } else {
      res.status(404);
      throw new Error('Car not found');
    }
  })
);

module.exports = router; 