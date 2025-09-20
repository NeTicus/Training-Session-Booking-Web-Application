// Import necessary modules
var createError = require('http-errors'); // For handling errors and generating error pages
var express = require('express'); // Express framework for routing and handling HTTP requests
var path = require('path'); // For handling file paths
var cookieParser = require('cookie-parser'); // For parsing cookies
var logger = require('morgan'); // For logging requests to the console
var mongoose = require('mongoose'); // MongoDB ODM for interacting with MongoDB

// Import the Booking model
const Booking = require('./models/bookingSchema'); // Ensure this path is correct

// Import the routers for different routes
var indexRouter = require('./routes/index'); // Route for the homepage
var usersRouter = require('./routes/users'); // Route for users management
var bookingsRouter = require('./routes/bookings'); // Route for bookings management

// Create an Express application
var app = express();

// Set up the view engine (EJS) and the views directory
app.set('views', path.join(__dirname, 'views')); // Set the views folder for the templates
app.set('view engine', 'ejs'); // Use EJS as the template engine

// Middlewares for request handling
app.use(logger('dev')); // Log all incoming requests in 'dev' format
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies from the requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

// Connect to MongoDB
const url = 'mongodb://localhost:27017/bookings'; // Database URL
const connect = mongoose.connect(url); // Establish a connection to the MongoDB server

connect.then((db) => {
    console.log("Connected correctly to server"); // Log if connected successfully
}, (err) => { 
    console.log(err); // Log any connection errors
});

// Use the routers for specific routes
app.use('/', indexRouter); // Use the 'index' router for the homepage
app.use('/users', usersRouter); // Use the 'users' router for managing users
app.use('/bookings', bookingsRouter); // Use the 'bookings' router for managing bookings

// Route for the 'Contact Us' page
app.get('/contact', (req, res) => {
  res.render('contact'); // Render the 'contact.ejs' view
});

// Route for the 'About Us' page
app.get('/about', (req, res) => {
  res.render('about'); // Render the 'about.ejs' view 
});

// Route for the 'Help' page
app.get('/help', (req, res) => {
  res.render('help'); // Render the 'help.ejs' view 
});

// Add the report page route to show the form where the user enters name and date range
app.get('/report', (req, res) => {
    res.render('reportForm'); // Render the 'reportForm.ejs' view with the form
});

// Route to generate and display the report based on user input
app.post('/generateReport', (req, res) => {
  const { name, startDate, endDate } = req.body;

  // Validate inputs (make sure they are not empty)
  if (!name || !startDate || !endDate) {
      return res.status(400).send('All fields are required.');
  }

  // Fetch the user's training sessions from the database
  Booking.find({
      user: name, 
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
  })
  .then(sessions => {
      console.log(sessions);  // Log the sessions array to check the data 
      if (sessions.length > 0) {
          res.render('reportView', { sessions, name, startDate, endDate }); // Render the 'reportView' template with sessions data
      } else {
          res.render('reportView', { sessions: [], name, startDate, endDate }); // Render an empty sessions array if no data is found
      }
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching sessions');
  });
});

// Catch 404 errors and forward them to the error handler
app.use(function(req, res, next) {
  next(createError(404)); // If no route matches, create a 404 error
});

// Error handler middleware
app.use(function(err, req, res, next) {
  // Set locals for error message and stack trace in development mode
  res.locals.message = err.message; // The error message
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // Show error details in development mode

  // Render the error page
  res.status(err.status || 500); // Set the status code (default to 500 if not set)
  res.render('error'); // Render the error template
});

// Export the app to use in server.js (or other modules)
module.exports = app;
