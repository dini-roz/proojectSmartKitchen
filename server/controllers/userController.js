
const User = require("../models/User");
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
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
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Attempting login for email:', email);
    try {
        const user = await User.findOne({ email });
          console.log('User found:', user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
       
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // res.status(200).json({user.password},message:'token from schema'});
        res.status(200).json({ password: user.password,   username: user.username, message: 'token from schema'  });
        console.log(user.password)
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};