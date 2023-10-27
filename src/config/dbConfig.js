const mongoose = require('mongoose');

mongoose.connect(process.env.mongoUrl)

const db = mongoose.connection;

db.on(`connected`, () => {
    console.log(`Connect to DB`)
})
db.on(`error`, () => {
    console.log(`Mongoose connection error`)
})