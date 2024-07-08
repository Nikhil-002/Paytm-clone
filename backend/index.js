const express = require("express");
const cors = require("cors")
const mainRouter = require('./routes/index')

const app = express();

app.use(cors());
app.use(express.json());

// app.get('/yo',(res,req)=>{
//     console.log('working backend index.js');
// })
app.use('/api/v1', mainRouter);

app.listen(3000,(res,req)=>{
    console.log("Listening on PORT : 3000");
});


