const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path')
const bodyParser = require('body-parser');
// File Direction
const dbConfig = require('./src/config/dbConfig')

// All router Direction
const userRoute = require('./src/modules/Users/user.router')
const busRoute = require('./src/modules/Bus/bus.router');
const bookRoute = require("./src/modules/Booking/booking.router")

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));
app.use(bodyParser.raw({ type: 'application/json' }));


// Router path
app.use(`/api/users`, userRoute);
app.use(`/api/bus`, busRoute);
app.use(`/api/booking`, bookRoute);


const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Server Running"));

app.listen(PORT, console.log(`Port: ${PORT} server running successfully`));