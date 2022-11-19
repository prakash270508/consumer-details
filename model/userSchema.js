const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSechema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            altEmail: {
                type: String,
            },
            altPhone: {
                type: Number,
            },
            message: {
                type: String,
                required: true
            },
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

//Hasing Password
userSechema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
        this.cpassword = await bcrypt.hash(this.cpassword, 10)
    }
    next();
})

//Generating tokens for play casino
userSechema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

//Storing the message 

userSechema.methods.addMessage = async function(altEmail, altPhone, message){
    try {
        this.messages= this.messages.concat({altEmail, altPhone, message});
        await this.save();
        return message;
    } catch (error) {
        console.log(error);
    }
}

//Collection BAnana h
const User = mongoose.model("USER", userSechema)

module.exports = User;