const router = require('express').Router();
const Bus = require('./bus.model');
const authMiddleware = require("../../middleware/authMiddleware");




router.post('/add-bus', async (req, res) => {
    try {
        const existingBus = await Bus.findOne({ number: req.body.number })
        if (existingBus) {
            return res.status(200).send({
                success: false,
                message: "Bus already exists",
            });
        }

        const newBus = new Bus(req.body);
        await newBus.save();
        return res.status(200).send({
            success: true,
            message: "Bus added successfully",
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
})

// get-all-buses

router.post("/get-all-bus", authMiddleware, async (req, res) => {
    try {

        const buses = await Bus.find({});
        return res.status(200).send({
            success: true,
            message: "Buses fetched successfully",
            data: buses,
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// update-bus

router.post("/update-bus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.body._id, req.body);
        return res.status(200).send({
            success: true,
            message: "Bus updated successfully",
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});
// delete-bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.body._id);
        return res.status(200).send({
            success: true,
            message: "Bus deleted successfully",
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// get-bus-by-id

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
    try {
        const bus = await Bus.findById(req.body._id);
        return res.status(200).send({
            success: true,
            message: "Bus fetched successfully",
            data: bus,
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});



router.post('/get-bus-filter', authMiddleware, async (req, res) => {
    try {
        const filter = req.body; // Assuming the filters are sent in the request body

        const { from, to, journeyDate } = filter.tempFilters;


        // Create a query object to build your filter conditions
        const query = {};

        if (from) {
            query.from = from;
        }

        if (to) {
            query.to = to;
        }

        if (journeyDate) {
            // You may need to customize this based on your data model
            // This example assumes you have a date field in your Bus model
            query.journeyDate = journeyDate;
        }

        // Use Mongoose to query the database based on the constructed query
        const buses = await Bus.find(query);


        res.status(200).send({
            success: true,
            message: 'Buses fetched successfully',
            data: buses,
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
})

module.exports = router