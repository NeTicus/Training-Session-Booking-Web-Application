// Import the required modules
const express = require('express'); // Express framework for handling HTTP requests and responses
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling and schema management

// Define a Mongoose schema for booking details
const bookingLayout = new mongoose.Schema({
  // Name of the person making the booking
  name: {
      type: String, // Data type is a string
      required: true // Name is a required field
  },
  // Unique ID of the person (e.g., a membership ID or user ID)
  personId: {
      type: String, // Data type is a string
      required: true, // personId is a required field
      minlength: 10, // Must be exactly 10 characters long
      maxlength: 10
  },
  // Date and time of the booking
  dateTime: {
      type: Date, // Data type is a date
      required: true // dateTime is a required field
  },
  // Card number for payment (assuming it's used for validation)
  cardNumber: {
      type: String, // Data type is a string
      required: true, // cardNumber is a required field
      match: /^[0-9]{16}$/
  },
  // Expiry date of the card
  expiry: {
      type: String, // Data type is a string, storing in MM/YY or similar format
      required: true // expiry is a required field
  },
  // Security code of the card
  securityCode: {
      type: String, // Data type is a string (for storage purposes)
      required: true, // securityCode is a required field
      match: /^[0-9]{3,4}$/
  },
  // Timestamp of when the booking was created
  createdAt: {
      type: Date, // Data type is a date
      default: Date.now // Automatically set to the current date and time
  }
});

// Create a Mongoose model based on the schema
var bookingSchema = mongoose.model('bookingSchema', bookingLayout); // 'bookingSchema' is the collection name

// Export the model for use in other parts of the application
module.exports = bookingSchema;
