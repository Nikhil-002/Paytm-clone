const express = require('express')
const zod = require('zod')

const router = express.Router();
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')
const {User, Account} = require('../db');
const {authMiddleware} = require("../middleware")

const signupSchema = zod.object({
    username : zod.string().email(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})

router.post("/signup", async(req,res)=>{
    // console.log('Hit /signup route');
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message : "Incorrect Input"
        })
    }

    const user = await User.findOne({
        username : body.username
    })

    if(user){
        return res.status(411).json({
            message : "Email already taken/exist."
        })
    }

    const dbUser = await User.create({
        username: body.username,
        password: body.password,
        firstName : body.firstName,
        lastName : body.lastName,
    });

    const userId = dbUser._id

    /// ---------CREATE NEW ACCOUNT-----------

    await Account.create({
        userId,
        balance : 1 + Math.random()*10000
    })

    /// ---------------------------------------

    const token = jwt.sign({
        userId : dbUser._id
    }, JWT_SECRET)

    res.status(200).json({
        message : "User created Successfully", 
        token : token
    })
})



const signinSchema = zod.object({
    username : zod.string().email(),
    password : zod.string(),
})

router.post('/signin', async(req,res)=>{
    const body = req.body;
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
       return res.status(411).json({
            message : "Incorrect Input"
        })
    }

    const user = await User.findOne({
        username : body.username,
        password : body.password
    })
    
    if(user){
        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET);
        
        res.json({
            token : token
        })
        return ;
    }
    res.status(411).json({
        message : "Error while logging in..."
    })
})

const updateBody = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

router.put('/',authMiddleware, async (req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message : "Invalid Input"
        })
    }

    const updateResult = await User.updateOne({ _id: req.userId }, req.body);

    res.status(200).json({
        message : "Updated Successfully"
    })
})

router.get("/bulk", async (req, res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [{
            firstName :{
                "$regex" : filter
            }
        },{
            lastName : {
                "$regex" : filter
            }
        }]
    })
    
    res.json({
        user : users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
})

module.exports = router