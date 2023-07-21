const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const facilities = {
  'Clubhouse': {
    'slots': {
      '10:00-16:00': 100,
      '16:00-22:00': 500
    },
    'bookings': {}
  },
  'Tennis Court': {
    'slots': {
      '00:00-23:59': 50
    },
    'bookings': {}
  }
};

app.post('/bookFacility', (req, res) => {
  const { facility, date, startTime, endTime } = req.body;
  console.log(date);
  const bookingDate = new Date(date);
  const startDateTime = new Date(`${date} ${startTime}`);
  const endDateTime = new Date(`${date} ${endTime}`);
  if (!facilities[facility]) {
    return res.json({ success: false, message:'Facility not found' });   //that facility is not there in listed i have taken only 2
  }
  const facilityBookings = facilities[facility].bookings[bookingDate];
  console.log(facilityBookings);
  if (facilityBookings) {
    
    for (const bookedSlot of facilityBookings) {
      
      const [bookedStartTime, bookedEndTime] = bookedSlot;
      const bStartTime = new Date(`${date} ${bookedStartTime}`);
      const bEndTime = new Date(`${date} ${bookedEndTime}`);

      if (startDateTime >= bStartTime && startDateTime < bEndTime ||
          endDateTime > bStartTime && endDateTime <= bEndTime) {
        return res.json({ success: false, message: 'Booking Failed,Already Booked' });
      }
    }
  } else {
    facilities[facility].bookings[bookingDate] = []; //to create an array
  }

  facilities[facility].bookings[bookingDate].push([startTime, endTime]);
  let bookingAmount = 0;
  for (const slot in facilities[facility].slots) {
    console.log(slot);
    const [start, end] = slot.split('-');
    const slotStart = new Date(`${date} ${start}`);
    const slotEnd = new Date(`${date} ${end}`);
    if (startDateTime >= slotStart && endDateTime <= slotEnd) {
      bookingAmount += (endDateTime - startDateTime) / (1000 * 60 * 60) * facilities[facility].slots[slot];
      break;
    }
  }
  console.log(date);

  console.log('Booking Amount:', bookingAmount);
  return res.json({ success: true, amount: bookingAmount });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});