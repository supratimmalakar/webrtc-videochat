const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

router.post('/register', async (req, res) => {
    const usernameExists = await User.findOne({
        username: req.body.username
    });

    if (usernameExists) {
        res.status(409).send("username already exists");
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const user = new User({
            name: req.body.name.trim(),
            username: req.body.username.trim(),
            password: hashedPassword
        })
        await user.save();
        res.status(201).send("user created")
    }
    catch (err) {
        res.status(400).json(err)
    }
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    }).select('+password');

    if (!user) {
        res.status(404).send("user not found")
        return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(401).send("Incorrect password");
        return;
    }

    try {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        userObj = {
            name: user.name,
            username: user.username,
            id: user._id
        }
        const tokenObj = {
            token,
            user: {
                ...userObj
            }
        }
        res.status(200).json(tokenObj);

    }
    catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router