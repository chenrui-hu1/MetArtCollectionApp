const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config()

const app = express();

app.use(cors({
    origin: '*',
}));

// Here are all routes.


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running at http://${process.env.SERVER_PORT}:${process.env.SERVER_HOST}/`)
});
