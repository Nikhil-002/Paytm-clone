const express = require("express")
const userRouter = require('./user')
const accountRouter = require('./account')

const router = express.Router();
// console.log("in router/index");

// router.get('/yo',(res,req)=>{
//     console.log('working router index.js');
// })

router.use('/user', userRouter);
router.use('/account', accountRouter);

module.exports = router;

//  /api/v1/user
//  /api/v1/transaction..