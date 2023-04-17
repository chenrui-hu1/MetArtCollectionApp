const mysql = require('mysql')
const {addCondition} = require("./queryUtils");

require('dotenv').config()

// create a connection to the database
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});
con.connect((err) => err && console.log(err));

// Here are all routes.


/**
 * Artworks
 * */
// Get all artworks
// GET: /artworks
const getAllArtworks = async function (req, res) {
    con.query(`SELECT * FROM Artwork`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
        }
    });
};

// Get artwork by id
// GET: /complete_artwork/:artwork_id
const getCompleteArtworkById = async function (req, res) {
    const artworkId = con.escape(req.params.artwork_id);
    con.query(`
            SELECT * 
            FROM Artwork JOIN Artist ON Artwork.constituentID = Artist.constituentID 
                JOIN Location ON Artwork.locationID = Location.locationID
                JOIN Metadata ON Artwork.objectID = Metadata.objectID
            WHERE artwork_id = ${artworkId}
            `
        , (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data[0]);
            }
        });
};

// Get artwork without join.
// GET: /artwork/:artwork_id
const getArtworkById = async function (req, res) {
    const artworkId = con.escape(req.params.artwork_id);
    con.query(`SELECT * FROM Artwork WHERE artwork_id = ${artworkId}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
};


// Get random artwork
// GET: /artwork/random
const getRandomArtwork = async function (req, res) {
    const randomArtworks = req.query.num_artworks === undefined ? 1 : con.escape(req.query.num_artworks);

    con.query(`
            SELECT * 
            FROM Artwork 
            ORDER BY RAND() 
            LIMIT ${randomArtworks}`
        , (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data[0]);
        }
    });
}

/**
 * Special query for Artworks
 * */
// Artwork search
// GET: /search_artwork
const getArtworkByFilter = async function (req, res) {
    const page = req.query.page === undefined ? 1 : con.escape(req.query.page);
    const pageSize = req.query.page_size === undefined ? 10 : con.escape(req.query.page_size);

    // Selector
    const isHightlight = req.query.is_highlight === undefined ? "" : con.escape(req.query.is_highlight);
    // const accessionYear = req.query.accession_year === undefined ? "" : con.escape(req.query.accession_year);
    const isPublicDomain = req.query.is_public_domain === undefined ? "" : con.escape(req.query.is_public_domain);
    const objectBeginDate = req.query.object_begin_date === undefined ? "" : con.escape(req.query.object_begin_date);
    const objectEndDate = req.query.object_end_date === undefined ? "" : con.escape(req.query.object_end_date);
    const department = req.query.department === undefined ? "" : con.escape(req.query.department);

    // dropdown box
    const classification = req.query.classification === undefined ? "" : con.escape(req.query.classification);
    const portfolio = req.query.portfolio === undefined ? "" : con.escape(req.query.profolio);

    // Contains
    const objectName = req.query.object_name === undefined ? "" : con.escape(req.query.object_name);
    const titleInitial = req.query.title === undefined ? "" : con.escape(req.query.title);
    const culture = req.query.culture === undefined ? "" : con.escape(req.query.culture);
    const dynasty = req.query.dynasty === undefined ? "" : con.escape(req.query.dynasty);
    const medium = req.query.medium === undefined ? "" : con.escape(req.query.medium);

    // artist and location info. Contains.
    const artist = req.query.artist === undefined ? "" : con.escape(req.query.artist);
    const country = req.query.location === undefined ? "" : con.escape(req.query.country);

    let artistSubquery = "";
    let countrySubquery = "";
    if(artist !== "") {
        artistSubquery = `SELECT Artist.constituentID FROM Artist WHERE displayName LIKE '%${artist}%'`;
    }
    if(country !== "") {
        countrySubquery = `SELECT Location.locationID FROM Location WHERE country LIKE '%${country}%'`;
    }

    let query = `Select * From Artwork `;

    let whereFlag = true;
    if(isHightlight !== ""){
        query = addCondition(query, `Artwork.isHighlight = '${isHightlight}'`, whereFlag);
        whereFlag = false;
    }
    if(isPublicDomain !== ""){
        query = addCondition(query, `Artwork.isPublicDomain = '${isPublicDomain}'`, whereFlag);
        whereFlag = false;
    }
    if(objectBeginDate !== ""){
        query = addCondition(query, `Artwork.objectBeginDate Between '${objectBeginDate}' And '${objectEndDate}'`, whereFlag);
        whereFlag = false;
    }
    if(objectEndDate !== ""){
        query = addCondition(query, `Artwork.objectEndDate Between '${objectBeginDate}' And '${objectEndDate}'`, whereFlag);
        whereFlag = false;
    }
    if(department !== ""){
        query = addCondition(query, `Artwork.department = '${department}'`, whereFlag);
        whereFlag = false;
    }
    if(classification !== ""){
        query = addCondition(query, `Artwork.classification Like '%${classification}%'`, whereFlag);
        whereFlag = false;
    }
    if(portfolio !== ""){
        query = addCondition(query, `Artwork.portfolio Like '%${portfolio}%'`, whereFlag);
        whereFlag = false;
    }
    if(objectName !== ""){
        query = addCondition(query, `Artwork.objectName Like '%${objectName}%'`, whereFlag);
        whereFlag = false;
    }
    if(titleInitial !== ""){
        query = addCondition(query, `Artwork.title Like '%${titleInitial}%'`, whereFlag);
        whereFlag = false;
    }
    if(culture !== ""){
        query = addCondition(query, `Artwork.culture Like '%${culture}%'`, whereFlag);
        whereFlag = false;
    }
    if(dynasty !== ""){
        query = addCondition(query, `Artwork.dynasty Like '%${dynasty}%'`, whereFlag);
        whereFlag = false;
    }
    if(medium !== ""){
        query = addCondition(query, `Artwork.medium Like '%${medium}%'`, whereFlag);
        whereFlag = false;
    }
    if(artistSubquery !== ""){
        query = addCondition(query, `Artwork.constituentID IN (${artistSubquery})`, whereFlag);
        whereFlag = false;
    }
    if(countrySubquery !== ""){
        query = addCondition(query, `Artwork.locationID IN (${countrySubquery})`, whereFlag);
        whereFlag = false;
    }

    query += `Order By Artwork.objectID Limit ${pageSize} Offset ${(page - 1) * pageSize}`;

    con.query(query
        , (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json([]);
            } else {
                res.json(data);
            }
        });
}


// Get Artworks in a Top culture
// GET: /artworks/topculture
const getArtworkInTopCulture = async function (req, res) {
    
}


// Get Artworks for Top artist


// Get Artworks for Top profolio


// Get


/**
 *  Artists
 * */
// Get all artists
// GET: /artists
const getAllArtists = async function (req, res) {
    con.query(`SELECT * FROM Artist`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
        }
    });
};

// Get artist by id
// GET: /artist/:artist_id
const getArtistById = async function (req, res) {
    const artistId = con.escape(req.params.artist_id);
    con.query(`SELECT * FROM Artist WHERE constituentID = ${artistId}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
};

// Get random artist
// GET: /artist/random
const getRandomArtist = async function (req, res) {
    const randomArtists = req.query.num_artists === undefined ? 1 : con.escape(req.query.num_artists);
    con.query(`
        SELECT * 
        FROM Artist 
        ORDER BY RAND() 
        LIMIT ${randomArtists}`
        , (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data[0]);
        }
    });
};


/**
 * Special queries for artists
 * */

// Artist search
// GET: /search_artist
const getArtistsByFilter = async function (req, res) {
    const numArtists = req.params.num_artists === undefined ? '' : con.escape(req.params.num_artists);
    const artistRole = req.query.artist_role === undefined ? '' : con.escape(req.query.artist_role);
    const beginDate = req.query.begin_date === undefined ? 0 : con.escape(req.query.begin_date);
    const endDate = req.query.end_date === undefined ? 2024 : con.escape(req.query.end_date);
    const artistNationality = req.query.nation === undefined ? '' : con.escape(req.query.nation);

    const initial = req.query.initial_name === undefined ? '' : con.escape(req.query.initial_name);

    let query = `SELECT * FROM Artist `
    if(artistRole !== ''){
        query += `WHERE Artist.artistRole = ${artistRole} `
    }
    query += `AND Artist.beginDate >= ${beginDate} AND Artist.endDate <= ${endDate} `
    if(artistNationality !== ''){
        query += `AND (Artist.artistNationality = ${artistNationality} OR Artist.artistNationality Like '${artistNationality}%') `
    }
    if(initial !== ''){
        query += `AND Artist.artistDisplayName Like '${initial}%' `
    }
    query += `ORDER BY Artist.artistDisplayName ASC`
    if(numArtists !== ''){
        query += `LIMIT ${numArtists}`
    }

    con.query(query, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
        }
    });

};

// Get top artists.
// Top artists are based on the number of artworks they have created.
// GET: /top_artists/:num_artists
const getTopArtistsByFilter = async function (req, res) {
    const numArtists = req.params.num_artists === undefined ? 10 : con.escape(req.params.num_artists);
    const artistRole = req.query.artist_role === undefined ? '' : con.escape(req.query.artist_role);
    const beginDate = req.query.begin_date === undefined ? '' : con.escape(req.query.begin_date);
    const endDate = req.query.end_date === undefined ? '' : con.escape(req.query.end_date);
    const artistNationality = req.query.nation === undefined ? '' : con.escape(req.query.nation);

    const initial = req.query.initial_name === undefined ? '' : con.escape(req.query.initial_name);

    let subquery1 = `SELECT Artist.constituentID FROM Artist `;

    if(artistRole !== ''){
        subquery1 += `WHERE Artist.artistRole = ${artistRole} `;
    }
    subquery1 += `AND Artist.beginDate >= ${beginDate} AND Artist.endDate <= ${endDate} `;
    if(artistNationality !== ''){
        subquery1 += `AND (Artist.artistNationality = ${artistNationality} OR Artist.artistNationality Like '${artistNationality}%') `;
    }
    if(initial !== ''){
        subquery1 += `AND Artist.artistDisplayName Like '${initial}%' `;
    }

    let subquery2 = `
        SELECT Artist.constituentID, COUNT(Artwork.artwork_id) AS num_artworks
        FROM Artwork JOIN Artist ON Artwork.constituentID = Artist.constituentID
        WHERE Artwork.constituentID IN (SELECT SelectedArtistsID.constituentID FROM SelectedArtistsID)
        GROUP BY Artwork.constituentID
        HAVING num_artworks > 0
        ORDER BY num_artworks DESC
    `;

    let query = `WITH SelectedArtistsID AS (${subquery1}), SelectedArtistWithCount AS (${subquery2})`;

    query += `
        SELECT Artist.* 
        FROM SelectedArtistWithCount JOIN Artist ON SelectedArtistWithCount.constituentID = Artist.constituentID
        ORDER BY SelectedArtistWithCount.num_artworks DESC
        LIMIT ${numArtists}`;

    con.query(query
        , (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json([]);
            } else {
                res.json(data);
            }
        });
};



/**
 * Location
 * */

// Get location by id
// GET: /location/:location_id
const getLocationById = async function (req, res) {
    const locationId = con.escape(req.params.location_id);
    con.query(`SELECT * FROM Location WHERE locationID = ${locationId}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
};

/**
 * Metadata
 * */

// Get metadata by id
// GET: /metadata/:metadata_id
const getMetadataById = async function (req, res) {
    const metadataId = con.escape(req.params.metadata_id);
    con.query(`SELECT * FROM Metadata WHERE objectID = ${metadataId}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
};






