const express = require('express');
const joi = require('joi');
const cors = require('cors');
const app = express();



app.use(express.json());
app.use(cors());


const db = require('./db_conn');
const { default: mongoose, Schema } = require('mongoose');

const PORT = 8081;


// collection for user

const user = mongoose.model("users", new Schema({
    "email" : String,
    "password" : String 
}, {
    timestamps : true
}));

// models for valiation

const data_model = joi.object({
    "email" : joi.string().required(),
    "password" : joi.string().required()
})



app.listen(PORT, "0.0.0.0",() =>{
    console.log(`App listening on port : ${PORT}`);
});

app.get("/", (req, res) =>{
    res.json({"message" : "Welcome to LOGIN/SIGNUP API"});
});


app.post("/user/signup", async (req, res) =>{
    const apiData = req.body;
    const valid = data_model.validate(apiData);
    if(valid.error){
        return res.json({
            "error" : true,
            "message" : valid.error.message
        })
    } else{
        const checkIfExist = await user.findOne({"email" : valid.value.email});
        
        if(checkIfExist != null){
            return res.status(409).json({
                "error" : true,
                "message" : "User already signed in, please login"
            })
        } else{
            await user.create({
                "email" : valid.value.email,
                "password" : valid.value.password
            })
            return res.json({
                "error" : false,
                "message" : "User saved successfully !"
            })
        }
        
    }
});

app.post("/user/login", async (req, res) =>{
    const apiData = req.body;
    const valid = data_model.validate(apiData);
    if(valid.error){
        return res.json({
            "error" : true,
            "message" : valid.error.message
        })
    } else{
        const checkIfExist = await user.findOne({"email" : valid.value.email});
        
        if(checkIfExist == null){
            return res.status(404).json({
                "error" : true,
                "message" : "User not signed in, please signup"
            })
        } else{
            const savedPassword = checkIfExist.password;
            const enteredPassword = valid.value.password;
            if(savedPassword === enteredPassword){
                return res.json({
                    "error" : false,
                    "message" : "Login Success, passwords match"
                })
            } else{
                return res.status(401).json({
                    "error" : true,
                    "message" : "Password dont match, login failed"
                })
            }
        }
    }
});