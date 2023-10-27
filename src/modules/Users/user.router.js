const router = require("express").Router();
const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../../middleware/authMiddleware");
// register  

router.post('/register', async (req, res) => {
    try {

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.send({
                message: "User Already Registered",
                success: false,
                data: null
            })
        }

        const hashPassword = await bcrypt.hash(req.body.password, 12);
        req.body.password = hashPassword;
        const newUser = new User(req.body);
        await newUser.save();

        return res.send({
            message: "User Created Success",
            success: true,
            data: null
        })
    } catch (error) {
        return res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (!existingUser) {
            return res.send({
                message: "User does not exist ",
                success: false,
                data: null
            })
        }

        // password match

        const passwordMatch = await bcrypt.compare(req.body.password, existingUser.password)

        if (!passwordMatch) {
            return res.send({
                message: "Incorrect Password",
                success: false,
                data: null
            })
        }

        const token = jwt.sign({ userId: existingUser._id },
            "test", { expiresIn: '15d' }
        )
        res.send({
            message: "User Logged in successfully",
            success: true,
            data: token
        })


    } catch (error) {
        return res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
})

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: "User fetched successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});


// get all users
router.post("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.send({
            message: "Users fetched successfully",
            success: true,
            data: users,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// update user

router.post("/update-user-permissions", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body._id, req.body);
        res.send({
            message: "User permissions updated successfully",
            success: true,
            data: null,
        });
    } catch {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});


module.exports = router
