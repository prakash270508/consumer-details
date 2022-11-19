const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken')
const authenticate = require("../middleware/authenticate")
const cookieParser = require('cookie-parser')

require('../DB/conn')
const User = require('../model/userSchema')

router.use(cookieParser());

router.get("/", (req, res) => {
    res.send("Hello World from router")
})

//Using promises
// router.post("/register", (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Please fill all the data" })
//     }

//     User.findOne({ email: email }).then((userExist) => {
//         if (userExist) {
//             return res.status(422).json({ error: "Email already Exist" })
//         }

//         const user = new User({ name, email, phone, work, password, cpassword });
//         user.save().then(() => {
//             res.status(201).json({ message: "Resestration Successfully" })
//         }).catch((err) => {
//             res.status(500).json({ message: "Resestration Failed" })
//         })
//     }).catch(err => { console.log(err); })

// })

//Using async await
router.post("/register", async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all the data" })
    }

    try {
        let userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" })
        }

        if (cpassword !== cpassword) {
            return res.status(422).json({ error: "Password not matched" })
        }

        const user = new User({ name, email, phone, work, password, cpassword });

        await user.save();

        res.status(201).json({ message: "User  Resestration Successfully" })

    } catch (error) {
        console.log(error);
    }

})

//Login route

router.post("/signin", async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all details" })
        }

        const userLogin = await User.findOne({ email: email })

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)

            const token = await userLogin.generateAuthToken()
            console.log(token);

            res.cookie("jwtoken", token, {
                expires : new Date (Date.now() + 2589200000),
                httpOnly : true
            })
            if (!isMatch) {
                return res.status(400).json({ message: "Invlaid credentials" })
            } else {
                return res.status(200).json({ message: "Login successful" })
            }
        } else {
            return res.status(400).json({ message: "Invlaid credentials" })
        }

    } catch (error) {
        console.log(error);
    }

})

//About page route

router.get('/about', authenticate, (req, res)=>{
    res.send(req.rootUser)
})

//Get user data for contact and home page
router.get('/getdata', authenticate, (req, res)=>{
    res.send(req.rootUser)
})
//Contact us page
router.post("/contact",authenticate , async(req, res)=>{
    try {

        const {altEmail, altPhone, message } = req.body;

        if(!message){
            console.log("Err while writing message");
            return res.json({eror :"Please form the Message section"})
        }

        const userContact = await User.findOne({_id : req.userId});

        if(userContact){

            const userMessage = await userContact.addMessage(altEmail, altPhone, message);

            userContact.save();

            res.status(201).json({message : "Contact form succesfully"})
        }
        
    } catch (error) {
        console.log("Error");
    }
})

// Logout page
router.get('/logout', (req, res)=>{
    res.clearCookie('jwtoken', {path:"/"})
    res.status(200).send("User Logout")
})

module.exports = router;    