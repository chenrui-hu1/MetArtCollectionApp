const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

const querystring = require('querystring');
const mysql = require("mysql");
const bcrypt = require("bcrypt");

app.use(cors({
    origin: '*',
}));

app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// parse query string parameters
app.use((req, res, next) => {
    req.query = querystring.parse(req.url.split('?')[1]);
    next();
});

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});
con.connect((err) => err && console.log(err));


mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    password: { type: String, required: true, trim: true, minlength: 6 }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // 判断用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // 创建新用户
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Check if the password is correct
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Create a new JWT token for the user
       res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Here are all routes.

app.get('/', function(req, res) {
    res.send('Hello World!');
});
app.get('/artworks', routes.getAllArtworks);
app.get('/search_artworks', routes.getArtworkByFilter);
app.get('/complete_artwork/:artwork_id', routes.getCompleteArtworkById);
app.get('/random_artworks/:num_artworks', routes.getRandomArtwork);
app.get('/top_culture_artworks', routes.getArtworkInTopCulture);
app.get('/artworks/:artwork_id', routes.getArtworkById);
app.get('/top_artists/:num_artists', routes.getTopArtistsByFilter);
app.get('/artists', routes.getAllArtists);
app.get('/artists/:artist_id', routes.getArtistById);
app.get('/department_with_most_culture/:num_department', routes.getDepartmentWithMostCulture);
app.get('/location/:location_id', routes.getLocationById);
app.get('/metadata/:metadata_id', routes.getMetadataById);
app.get('/top_artists', routes.getTopArtists);


const server = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/`)
});

server.on('error', (err) => {
    console.error(`Server error: ${err.message}`);
});
