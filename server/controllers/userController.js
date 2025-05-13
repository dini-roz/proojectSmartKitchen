
const User = require("../models/User");
const bcrypt = require('bcrypt'); 
exports.createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            name: req.body.name,
            password: hashedPassword, // שמור את הסיסמה המגובבת
            paymentDetails: req.body.paymentDetails,
            email: req.body.email,
            phone: req.body.phone,
            kitchenItems: [],
            shoppingList: [], 
            food: []   
        });

    await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

exports.getUser = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ username: userName }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error });
    }
};