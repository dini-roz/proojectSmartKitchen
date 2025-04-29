const User = require("../models/User")
const bcrypt = require('bcrypt')



const login = async (req, res) => { }
const register = async (req, res) => {
    const { username, name, password, paymentDetails, email, phone} = req.body//kitchenItems, shoppingList, food
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ username: username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject= {name,email,username,paymentDetails,phone,password:hashedPwd}
    const user = await User.create(userObject)
    if (user) { // Created
    return res.status(201).json({message:`New user ${user.username}
    created` })
    } else {
    return res.status(400).json({message:'Invalid user received'})
    }
}
module.exports = { login, register }