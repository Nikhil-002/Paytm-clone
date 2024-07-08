const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get('/balance', authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userId : req.userId
    })
    res.status(200).json({
        userId : req.userId ,
        balance : account.balance
    })
})

router.post('/transfer', authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount,to} = req.body;

    const balance = await Account.findOne({
        userId : req.userId
    }).session(session)

    if(!balance || balance.account < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message : "Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({
        userId : to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Invalid Account"
        });
    }

    await Account.updateOne({
        userId : req.userId,

    } , {
        $inc : {
            balance : -amount
        }
    }).session(session);

    await Account.updateOne({
        userId : to
    } , {
        $inc : {
            balance : amount
        }
    }).session(session)

    await session.commitTransaction();
    res.json({
        message : "Transfer Successfull"
    })

})

module.exports = router;