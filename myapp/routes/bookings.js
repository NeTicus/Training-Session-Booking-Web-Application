var express = require('express'); // Express framework for routing
var router = express.Router(); // Create a router object to define routes for bookings
const Booking = require('../models/bookingSchema.js'); // Import the Booking model

// GET: View all bookings
router.get('/', (req, res, next) => {
  Booking.find() // Fetch all booking records from the database
    .then((bookingsFound) => {
      res.render('viewbooking', { booking: bookingsFound }); // Render 'viewbooking' template with bookings
    })
    .catch(err => {
      console.error('Error fetching bookings:', err); // Log the error for debugging
      res.status(500).send('Error fetching bookings');
    });
});

// GET: Display booking creation form
router.get('/create', (req, res, next) => {
  res.render('createBooking'); // Render 'createBooking' template to display the booking form
});

// POST: Create a new booking
router.post('/create', (req, res, next) => {
  // Perform basic validation (you can add more validation logic here as needed)
  const { name, personId, dateTime, cardNumber, expiry, securityCode } = req.body;
  if (!name || !personId || !dateTime || !cardNumber || !expiry || !securityCode) {
    return res.status(400).send('All fields are required.');
  }

  Booking.create(req.body) // Create a new booking record from the form data
    .then(() => {
      res.redirect('/bookings'); // Redirect to bookings page after creation
    })
    .catch(err => {
      console.error('Error creating booking:', err); // Log the error for debugging
      res.status(500).send('Error creating booking');
    });
});

// GET: Render the form for editing a booking
router.get('/:id/edit', (req, res, next) => {
  const bookingId = req.params.id;
  Booking.findById(bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).send('Booking not found'); // Handle missing booking
      }
      res.render('editBooking', { booking }); // Render 'editBooking' with the booking data
    })
    .catch(err => {
      console.error('Error fetching booking for editing:', err); // Log the error for debugging
      res.status(500).send('Error fetching booking');
    });
});

// POST: Handle booking updates
router.post('/:id/edit', (req, res, next) => {
  const bookingId = req.params.id;
  const { name, personId, dateTime, cardNumber, expiry, securityCode } = req.body;

  if (!name || !personId || !dateTime || !cardNumber || !expiry || !securityCode) {
    return res.status(400).send('All fields are required.');
  }

  Booking.findByIdAndUpdate(
    bookingId,
    { name, personId, dateTime, cardNumber, expiry, securityCode },
    { new: true } // Return the updated booking
  )
    .then(() => {
      res.redirect('/bookings'); // Redirect to bookings page after update
    })
    .catch(err => {
      console.error('Error updating booking:', err); // Log the error for debugging
      res.status(500).send('Error updating booking');
    });
});

// POST: Handle booking deletion
router.post('/:id/delete', (req, res, next) => {
  const bookingId = req.params.id;
  Booking.findByIdAndDelete(bookingId)
    .then(() => {
      res.redirect('/bookings'); // Redirect to bookings page after deletion
    })
    .catch(err => {
      console.error('Error deleting booking:', err); // Log the error for debugging
      res.status(500).send('Error deleting booking');
    });
});

router.post('generateReport', (req, res, next) => {
  const {name, startDate, endDate} = req.body
  // find the records that match the filter
  training.find(trainingData)
  .then(records => {
      // display the records found using traininglist
      res.render("reportView", { "session": records }, {name:name}, {startDate: startDate}, {endDate: endDate});
  })
  .catch(err => {
      console.error("Error fetching training records:", err);
      res.status(500).send("An error occurred while fetching training records.");
  });
})

// POST: Generate report based on user input
router.post('/generateReport', (req, res, next) => {
  const { name, startDate, endDate } = req.body;

  // Validate input fields
  if (!name || !startDate || !endDate) {
    return res.status(400).send('All fields are required.');
  }

  // Fetch the training records that match the filter
  Booking.find({
    user: name, 
    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
  })
  .then(records => {
    if (records.length > 0) {
      res.render("reportView", { sessions: records, name, startDate, endDate });
    } else {
      res.render("reportView", { sessions: [], name, startDate, endDate });
    }
  })
  .catch(err => {
    console.error("Error fetching training records:", err);
    res.status(500).send("An error occurred while fetching training records.");
  });
});

// Export the router to make the routes available in the main app
module.exports = router;
