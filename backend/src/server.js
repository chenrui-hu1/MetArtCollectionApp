const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config()

const app = express();

const querystring = require('querystring');
const mysql = require("mysql");

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


// Here are all routes.

app.get('/', function(req, res) {
    res.send('Hello World!');
});
app.get('/artworks', routes.getAllArtworks);
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
