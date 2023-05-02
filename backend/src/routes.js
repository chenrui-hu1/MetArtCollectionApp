const mysql = require('mysql')

const mongoose = require('mongoose');
const {addCondition} = require("./queryUtils");
const cache = require("memory-cache");

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


// Here is the cache
function queryDatabase(query, cacheKey, callback) {
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        callback(null, cachedResult);
    } else {
        con.query(query, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                cache.put(cacheKey, result, 60000);
                callback(null, result);
            }
        });
    }
}

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
                FROM Artwork
                         JOIN Artist ON Artwork.constituentID = Artist.constituentID
                         JOIN Location ON Artwork.locationID = Location.locationID
                         JOIN Metadata ON Artwork.objectID = Metadata.objectID
                WHERE Artwork.objectID = ${artworkId}
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
    con.query(`SELECT * FROM Artwork WHERE objectID = ${artworkId}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
};


// Get random artwork
// GET: /random_artworks/:num_artworks
const getRandomArtwork = async function (req, res) {
    const numArtworks = req.params.num_artworks || 1;
    const page = req.query.page === undefined ? 1 : con.escape(req.query.page);
    const page_size = req.query.page_size === undefined ? 10 : con.escape(req.query.page_size);

    con.query(`SELECT * FROM Artwork ORDER BY RAND() LIMIT ${numArtworks}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
        }
    });
}

/**
 * Special query for Artworks
 * */
// Artwork search
// GET: /search_artwork
const getArtworksByFilter = async function (req, res) {
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const pageSize = req.query.page_size === undefined ? 10 : parseInt(req.query.page_size);

    // Selector
    const isHightlight = req.query.is_highlight === undefined ? "" : con.escape(req.query.is_highlight);
    // const accessionYear = req.query.accession_year === undefined ? "" : con.escape(req.query.accession_year);
    const isPublicDomain = req.query.is_public_domain === undefined ? '' : con.escape(req.query.is_public_domain).replaceAll(" ", "");
    const objectBeginDate = req.query.object_begin_date === undefined ? '' : parseInt(req.query.object_begin_date);
    const objectEndDate = req.query.object_end_date === undefined ? '' : parseInt(req.query.object_end_date);
    const department = req.query.department === undefined ? '' : con.escape(req.query.department);


    // dropdown box
    const classification = req.query.classification === undefined ? '' : con.escape(req.query.classification);
    const portfolio = req.query.portfolio === undefined ? '' : con.escape(req.query.portfolio).replaceAll(" ", "");

    // Contains
    const objectName = req.query.object_name === undefined ? '' : con.escape(req.query.object_name).replaceAll(" ", "");
    const titleInitial = req.query.title === undefined ? '' : con.escape(req.query.title).replaceAll(" ", "");
    const culture = req.query.culture === undefined ? '' : con.escape(req.query.culture).replaceAll(" ", "");
    const dynasty = req.query.dynasty === undefined ? '' : con.escape(req.query.dynasty).replaceAll(" ", "");
    const medium = req.query.medium === undefined ? '' : con.escape(req.query.medium);

    // artist and location info. Contains.
    const artist = req.query.artist === undefined ? '' : con.escape(req.query.artist);
    const country = req.query.location === undefined ? '' : con.escape(req.query.location);
    const artistId = req.query.constituentID === undefined ? '' : parseInt(req.query.constituentID);

    let artistSubquery = "SELECT Artist.constituentID FROM Artist";
    let countrySubquery = "SELECT Location.locationID FROM Location";
    if(artist !== "") {
        artistSubquery = `SELECT Artist.constituentID FROM Artist WHERE artistDisplayName LIKE '%${artist.replaceAll("'","")}%'`;
    }
    if(artistId !== '') {
        artistSubquery = `SELECT Artist.constituentID FROM Artist WHERE Artist.constituentID = ${artistId}`;
    }
    if(country !== "") {
        countrySubquery = `SELECT Location.locationID FROM Location WHERE country LIKE '%${country.replaceAll("'","")}%'`;
    }

    let query = `Select * From Artwork `;

    let whereFlag = true;
    if(isHightlight !== ""){
        query = addCondition(query, `Artwork.isHighlight = ${isHightlight}`, whereFlag);
        whereFlag = false;
    }
    if(isPublicDomain !== ""){
        query = addCondition(query, `Artwork.isPublicDomain = ${isPublicDomain}`, whereFlag);
        whereFlag = false;
    }
    if(objectBeginDate !== ""){
        query = addCondition(query, `Artwork.objectBeginDate Between ${objectBeginDate} And ${objectEndDate}`, whereFlag);
        whereFlag = false;
    }
    if(objectEndDate !== ""){
        query = addCondition(query, `Artwork.objectEndDate Between ${objectBeginDate} And ${objectEndDate}`, whereFlag);
        whereFlag = false;
    }
    if(department !== ""){
        query = addCondition(query, `Artwork.department = ${department} `, whereFlag);
        whereFlag = false;
    }
    if(classification !== ""){
        query = addCondition(query, `Artwork.classification Like '%${classification.replaceAll("'","")}%'`, whereFlag);
        whereFlag = false;
    }
    if(portfolio !== ""){
        query = addCondition(query, `Artwork.portfolio Like '%${portfolio.replaceAll("'","")}%'`, whereFlag);
        whereFlag = false;
    }
    if(objectName !== ""){
        query = addCondition(query, `Artwork.objectName Like '%${objectName.replaceAll("'","")}%'`, whereFlag);
        whereFlag = false;
    }
    if(titleInitial !== ""){
        query = addCondition(query, `Artwork.title Like '%${titleInitial.replaceAll("'","")}%'`, whereFlag);
        whereFlag = false;
    }
    if(culture !== ""){
        query = addCondition(query, `Artwork.culture Like '%${culture.replaceAll("'","")}%'`, whereFlag);
        whereFlag = false;
    }
    if(dynasty !== ""){
        query = addCondition(query, `Artwork.dynasty Like '%${dynasty.replaceAll("'","")}%'`, whereFlag);
        whereFlag = false;
    }
    if(medium !== ""){
        query = addCondition(query, `(Artwork.medium Like '%${medium.replaceAll("'","")}%'OR TRIM(Artwork.medium) Like '%${medium.replaceAll("'","")}%')`, whereFlag);
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

    const cacheKey = `getArtworks${query}`;
    queryDatabase(query, cacheKey, (err, data) => {
        if (err) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
        }
    })

    // con.query(query
    //     , (err, data) => {
    //         if (err || data.length === 0) {
    //             console.log(err);
    //             res.json([]);
    //         } else {
    //             res.json(data);
    //         }
    //     });
}


// Get Artworks in a Top culture
// GET: /top_culture_artworks
const getArtworkInTopCulture = async function (req, res) {
    const culture = req.query.culture === undefined ? "'American'" : con.escape(req.query.culture);
    const page = req.query.page === undefined ? 1 : con.escape(req.query.page);
    const pageSize = req.query.page_size === undefined ? 10 : con.escape(req.query.page_size);
    con.query(`SELECT * FROM Artwork WHERE culture = ${culture} Order By objectID Limit ${pageSize} Offset ${(page - 1) * pageSize}`, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
        }
    });

}




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
// GET: /random_artworks
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

    let whereFlag = true;
    let query = `SELECT * FROM Artist `
    if(artistRole !== ''){
        query = addCondition(query, `Artist.artistRole = ${artistRole}`, whereFlag);
        whereFlag = false;
    }
    if(beginDate !== ''){
        query = addCondition(query, `Artist.beginDate >= ${beginDate}`, whereFlag);
        whereFlag = false;
    }
    if(endDate !== ''){
        query = addCondition(query, `Artist.endDate <= ${endDate}`, whereFlag);
        whereFlag = false;
    }

    if(artistNationality !== ''){
        query = addCondition(query, `Artist.artistNationality Like '%${artistNationality}%'`, whereFlag);
        whereFlag = false;
    }
    if(initial !== ''){
        query = addCondition(query, `Artist.artistDisplayName Like '${initial}%'`, whereFlag);
        whereFlag = false;
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
// GET: /top_artists_filter/:num_artists
const getTopArtistsByFilter = async function (req, res) {
    const numArtists = req.params.num_artists === undefined ? 10 : parseInt(req.params.num_artists);
    const artistRole = req.query.artist_role === undefined ? '' : con.escape(req.query.artist_role);
    const beginDate = req.query.begin_date === undefined ? '' : con.escape(req.query.begin_date);
    const endDate = req.query.end_date === undefined ? '' : con.escape(req.query.end_date);
    const artistNationality = req.query.nation === undefined ? '' : con.escape(req.query.nation);

    const initial = req.query.initial_name === undefined ? '' : con.escape(req.query.initial_name);

    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const pageSize = req.query.page_size === undefined ? 5 : parseInt(req.query.page_size);


    let subquery1 = `SELECT Artist.constituentID
                     FROM Artist `;

    if (artistRole !== '') {
        subquery1 += `WHERE Artist.artistRole = ${artistRole} `;
    }
    if(beginDate !== '' && endDate !== ''){
        subquery1 += `AND Artist.beginDate >= ${beginDate} AND Artist.endDate <= ${endDate} `;
    }
    if(artistNationality !== ''){
        subquery1 += `AND (Artist.artistNationality = ${artistNationality} OR Artist.artistNationality Like '${artistNationality}%') `;
    }
    if(initial !== ''){
        subquery1 += `AND Artist.artistDisplayName Like '${initial}%' `;
    }

    let subquery2 = `
        SELECT Artist.constituentID, COUNT(Artwork.objectID) AS num_artworks
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
        WHERE Artist.constituentID <> 0 And Artist.artistDisplayName <> 'Unknown' And Artist.artistDisplayName IS NOT NULL 
        ORDER BY SelectedArtistWithCount.num_artworks DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;

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

//  GET: /top_artists/:num_artists
const getTopArtists = async function (req, res) {
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const pageSize = req.query.page_size === undefined ? 5 : parseInt(req.query.page_size);


    let query = `
        SELECT Artist.*, COUNT(Artwork.objectID) AS num_artworks
        FROM Artwork JOIN Artist ON Artwork.constituentID = Artist.constituentID
        WHERE Artist.constituentID <> 0 And Artist.artistDisplayName <> 'Unknown' And Artist.artistDisplayName IS NOT NULL
        GROUP BY Artwork.constituentID
        HAVING num_artworks > 0
        ORDER BY num_artworks DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
        `;

    const cacheKey = `top_artists_${page}_${pageSize}`;
    queryDatabase(query, cacheKey, (err, result) => {
        if (err) {
            console.log(err);
            res.json([]);
        } else {
            res.json(result);
        }
    });
}



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
// Get the department that contains most of the culture numbers;
// GET: /department_with_most_culture/:num_department
const getDepartmentWithMostCulture = async function (req, res) {
    const department = req.query.num_department === undefined ? 10 : parseInt(req.query.num_department);
    // Define the SQL query as a multi-line string
    const query = `
    WITH departmentCulture AS (
      SELECT Artwork.objectID, Artwork.department, Artwork.culture
      FROM Artwork
      WHERE Artwork.department IS NOT NULL
        AND Artwork.culture IS NOT NULL
    ),
    departmentCultureNum AS (
      SELECT departmentCulture.department, COUNT(DISTINCT departmentCulture.culture) AS num_artwork
      FROM departmentCulture
      GROUP BY departmentCulture.department
      HAVING num_artwork > 0
    )
    SELECT departmentCultureNum.department
    FROM departmentCultureNum
    ORDER BY departmentCultureNum.num_artwork DESC, RAND(departmentCultureNum.department)
    LIMIT ${department};
  `;

    // Send the query to the database
    con.query(query, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json([]);
        } else {
            res.json(data);
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



module.exports = {
    getAllArtworks,
    getCompleteArtworkById,
    getRandomArtwork,
    getArtworkById,
    getArtistsByFilter,
    getTopArtistsByFilter,
    getLocationById,
    getMetadataById,
    getArtworkInTopCulture,
    getAllArtists,
    getArtistById,
    getDepartmentWithMostCulture,
    getTopArtists,
    getArtworksByFilter,

}





