const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());   

const dbConfig = require('./config/dbConfig');  // To able to connect to db

const port = process.env.PORT || 5000;   //Opening Port

const userRoute = require('./routes/userRoute')   //Where to route

const productRoute = require('./routes/productsRoute'); // Products where to route

app.use('/api/products',productRoute);

app.use('/api/users', userRoute);    //Routing

app.listen(port, ()=>console.log(`NodeJs/Express server started on port ${port}`));