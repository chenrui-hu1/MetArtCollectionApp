CREATE DATABASE MetDatabase;
USE MetDatabase;

## create database
CREATE TABLE Artist(
    constituentID int,
    artistRole varchar(25),
    artistPrefix varchar(64),
    artistDisplayName varchar(86),
    artistDisplayBio varchar(128),
    artistSuffix varchar(64),
    artistBeginDate int,
    artistEndDate int,
    artistGender varchar(8),
    artistWikidata_URL varchar(50),
    artistULAN_URL varchar(45),
    primary key (constituentID)
);

CREATE TABLE Location(
    locationID int,
    geographyType varchar(30),
    city varchar(50),
    state varchar(50),
    county varchar(30),
    country varchar(64),
    region varchar(70),
    subregion varchar(64),
    locale varchar(64),
    locus varchar(64),
    excavation varchar(64),
    river varchar(40),

    PRIMARY KEY (locationID)
);

DROP TABLE Metadata;
DROP TABLE Artwork;


CREATE TABLE Artwork(
    objectID int,
    isHighlight boolean,
    accessionNumber varchar(64),
    accessionYear varchar(16)                                                                                                                       ,
    isPublicDomain bool,
    primaryImage varchar(128),
    primaryImageSmall varchar(128),
    additionalImages json,
    objectName varchar(128),
    title varchar(1024),
    culture varchar(128),
    `period` varchar(128),
    dynasty varchar(64),
    region varchar(64),
    portfolio varchar(512),
    objectDate varchar(256),
    objectBeginDate int,
    objectEndDate int,
    `medium` varchar(256),
    dimensions varchar(2500),
    measurements json,
    creditLine varchar(560),
    classification varchar(60),
    isTimelineWork boolean,
    galleryNumber varchar(20),
    department varchar(40),
    constituentID int,
    locationID int,
    PRIMARY KEY (objectID),
    FOREIGN KEY (constituentID) REFERENCES Artist(constituentID),
    FOREIGN KEY (locationID) REFERENCES Location(locationID)
);

CREATE TABLE Metadata(
    objectID int,
    metadataDate datetime,
    repository varchar(45),
    objectURL varchar(64),
    tags json,
    objectWikidata_URL varchar(45),
    PRIMARY KEY (objectID),
    FOREIGN KEY (objectID) REFERENCES Artwork(objectID)
);



## DROP TABLE Metadata;
## DROP TABLE Artwork;

ALTER TABLE Artwork MODIFY COLUMN isHighlight boolean;



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
LIMIT 10;



SELECT * FROM Artwork WHERE isHighlight = 'True';


Select * From Artwork WHERE Artwork.isHighlight = 'True'AND Artwork.isPublicDomain = 'False'AND Artwork.objectBeginDate Between '1700' And '1800'AND Artwork.objectEndDate Between '1700' And '1800'AND Artwork.department = 'The American Wing'AND Artwork.classification Like '%Missing%';


Select * From Artwork WHERE Artwork.isHighlight = 'True' AND Artwork.constituentID IN (SELECT Artist.constituentID FROM Artist)AND Artwork.locationID IN (SELECT Location.locationID FROM Location)Order By Artwork.objectID Limit 10 Offset 10;

WITH ArtworkArtistLocation AS (
    SELECT
        A.constituentID,
        A.artistDisplayName,
        L.locationID,
        L.city,
        L.country,
        COUNT(W.objectID) AS ArtworkCount,
        AVG(W.objectEndDate - W.objectBeginDate) AS AvgArtworkDuration
    FROM
        Artist A
            JOIN Artwork W ON A.constituentID = W.constituentID
            JOIN Location L ON W.locationID = L.locationID
    GROUP BY
        A.constituentID,
        A.artistDisplayName,
        L.locationID,
        L.city,
        L.country
),
     ArtistRankings AS (
         SELECT
             locationID,
             city,
             country,
             constituentID,
             artistDisplayName,
             RANK() OVER (PARTITION BY locationID ORDER BY SUM(ArtworkCount) DESC) AS ArtistRank
         FROM
             ArtworkArtistLocation
         GROUP BY
             locationID,
             city,
             country,
             constituentID,
             artistDisplayName
     ),
     ArtistComparison AS (
         SELECT
             AR1.artistDisplayName AS Artist1,
             AR1.locationID AS LocationID1,
             AR1.city AS City1,
             AR1.country AS Country1,
             AR1.ArtistRank AS ArtistRank1,
             AAL1.ArtworkCount AS ArtworkCount1,
             AAL1.AvgArtworkDuration AS AvgArtworkDuration1,
             AR2.artistDisplayName AS Artist2,
             AR2.locationID AS LocationID2,
             AR2.city AS City2,
             AR2.country AS Country2,
             AR2.ArtistRank AS ArtistRank2,
             AAL2.ArtworkCount AS ArtworkCount2,
             AAL2.AvgArtworkDuration AS AvgArtworkDuration2
         FROM
             ArtistRankings AR1
                 JOIN ArtworkArtistLocation AAL1 ON AR1.constituentID = AAL1.constituentID AND AR1.locationID = AAL1.locationID
                 JOIN ArtistRankings AR2 ON AR1.locationID = AR2.locationID AND AR1.ArtistRank < AR2.ArtistRank
                 JOIN ArtworkArtistLocation AAL2 ON AR2.constituentID = AAL2.constituentID AND AR2.locationID = AAL2.locationID
     )
SELECT
    AC.Artist1,
    AC.LocationID1,
    AC.ArtistRank1,
    AC.ArtworkCount1,
    AC.AvgArtworkDuration1,
    AC.Artist2,
    AC.LocationID2,
    AC.ArtistRank2,
    AC.ArtworkCount2,
    AC.AvgArtworkDuration2,
    AC.ArtworkCount1 - AC.ArtworkCount2 AS ArtworkCountDifference,
    AC.AvgArtworkDuration1 - AC.AvgArtworkDuration2 AS AvgArtworkDurationDifference
FROM
    ArtistComparison AC
ORDER BY
    AC.Country1 ASC,
    AC.City1 ASC,
    AC.ArtistRank1 ASC,
    AC.ArtistRank2 ASC,
    (AC.ArtworkCount1 - AC.ArtworkCount2) DESC
LIMIT 1000;


CREATE VIEW artwork_artist_location AS (
                                       SELECT
                                           A.constituentID,
                                           A.artistDisplayName,
                                           L.locationID,
                                           L.city,
                                           L.country,
                                           COUNT(W.objectID) AS ArtworkCount,
                                           AVG(W.objectEndDate - W.objectBeginDate) AS AvgArtworkDuration
                                       FROM
                                           Artist A
                                               JOIN Artwork W ON A.constituentID = W.constituentID
                                               JOIN Location L ON W.locationID = L.locationID
                                       GROUP BY
                                           A.constituentID,
                                           A.artistDisplayName,
                                           L.locationID,
                                           L.city,
                                           L.country
                                           );

CREATE TEMPORARY TABLE temp_artwork_artist_location AS (
    SELECT
        A.constituentID,
        A.artistDisplayName,
        L.locationID,
        L.city,
        L.country,
        COUNT(W.objectID) AS ArtworkCount,
        AVG(W.objectEndDate - W.objectBeginDate) AS AvgArtworkDuration
    FROM
        Artist A
            JOIN Artwork W ON A.constituentID = W.constituentID
            JOIN Location L ON W.locationID = L.locationID
    GROUP BY
        A.constituentID,
        A.artistDisplayName,
        L.locationID,
        L.city,
        L.country
);
CREATE INDEX idx_temp_artwork_artist_location_constituent_id ON temp_artwork_artist_location (constituentID);
CREATE INDEX idx_temp_artwork_artist_location_location_id ON temp_artwork_artist_location (locationID);



CREATE TEMPORARY TABLE temp_artist_rankings AS (
    SELECT
        locationID,
        city,
        country,
        constituentID,
        artistDisplayName,
        RANK() OVER (PARTITION BY locationID ORDER BY SUM(ArtworkCount) DESC) AS ArtistRank
    FROM
        temp_artwork_artist_location
    GROUP BY
        locationID,
        city,
        country,
        constituentID,
        artistDisplayName
);
CREATE INDEX idx_temp_artist_rankings_location_id ON temp_artist_rankings (locationID);

CREATE VIEW artist_rankings AS (
                               SELECT
                                   locationID,
                                   city,
                                   country,
                                   constituentID,
                                   artistDisplayName,
                                   RANK() OVER (PARTITION BY locationID ORDER BY SUM(ArtworkCount) DESC) AS ArtistRank
                               FROM
                                   artwork_artist_location
                               GROUP BY
                                   locationID,
                                   city,
                                   country,
                                   constituentID,
                                   artistDisplayName
                                   );

CREATE VIEW artist_rankings2 AS(
                SELECT *
        FROM artist_rankings
    );

## temp_artist_rankings2
CREATE TEMPORARY TABLE temp_artist_rankings2 AS
SELECT *
FROM temp_artist_rankings;
CREATE INDEX idx_temp_artist_rankings_location_id ON temp_artist_rankings2 (locationID);

CREATE VIEW artwork_artist_location2 AS(
                               SELECT *
                               FROM artwork_artist_location
                                   );

CREATE TEMPORARY TABLE temp_artwork_artist_location2 AS
SELECT *
FROM temp_artwork_artist_location;
CREATE INDEX idx_temp_artwork_artist_location_constituent_id ON temp_artwork_artist_location2 (constituentID);
CREATE INDEX idx_temp_artwork_artist_location_location_id ON temp_artwork_artist_location2 (locationID);

CREATE TEMPORARY TABLE temp_artist_comparison AS (
    SELECT
        AR1.artistDisplayName AS Artist1,
        AR1.locationID AS LocationID1,
        AR1.city AS City1,
        AR1.country AS Country1,
        AR1.ArtistRank AS ArtistRank1,
        AAL1.ArtworkCount AS ArtworkCount1,
        AAL1.AvgArtworkDuration AS AvgArtworkDuration1,
        AR2.artistDisplayName AS Artist2,
        AR2.locationID AS LocationID2,
        AR2.city AS City2,
        AR2.country AS Country2,
        AR2.ArtistRank AS ArtistRank2,
        AAL2.ArtworkCount AS ArtworkCount2,
        AAL2.AvgArtworkDuration AS AvgArtworkDuration2
    FROM
        temp_artist_rankings AR1
            JOIN temp_artwork_artist_location AAL1 ON AR1.constituentID = AAL1.constituentID AND AR1.locationID = AAL1.locationID
            JOIN temp_artist_rankings2 AR2 ON AR1.locationID = AR2.locationID AND AR1.ArtistRank < AR2.ArtistRank
            JOIN temp_artwork_artist_location2 AAL2 ON AR2.constituentID = AAL2.constituentID AND AR2.locationID = AAL2.locationID
);

CREATE VIEW artist_comparison AS (
                                 SELECT
                                     AR1.artistDisplayName AS Artist1,
                                     AR1.locationID AS LocationID1,
                                     AR1.city AS City1,
                                     AR1.country AS Country1,
                                     AR1.ArtistRank AS ArtistRank1,
                                     AAL1.ArtworkCount AS ArtworkCount1,
                                     AAL1.AvgArtworkDuration AS AvgArtworkDuration1,
                                     AR2.artistDisplayName AS Artist2,
                                     AR2.locationID AS LocationID2,
                                     AR2.city AS City2,
                                     AR2.country AS Country2,
                                     AR2.ArtistRank AS ArtistRank2,
                                     AAL2.ArtworkCount AS ArtworkCount2,
                                     AAL2.AvgArtworkDuration AS AvgArtworkDuration2
                                 FROM
                                     artist_rankings AR1
                                         JOIN artwork_artist_location AAL1 ON AR1.constituentID = AAL1.constituentID AND AR1.locationID = AAL1.locationID
                                         JOIN artist_rankings AR2 ON AR1.locationID = AR2.locationID AND AR1.ArtistRank < AR2.ArtistRank
                                         JOIN artwork_artist_location AAL2 ON AR2.constituentID = AAL2.constituentID AND AR2.locationID = AAL2.locationID
                                     );



CREATE INDEX idx_temp_artist_comparison_location_id ON temp_artist_comparison (LocationID1);
CREATE INDEX idx_temp_artist_comparison_constituent_id ON temp_artist_comparison (Artist1, Artist2);


# 32 seconds
SELECT
    AC.Artist1,
    AC.LocationID1,
    AC.ArtistRank1,
    AC.ArtworkCount1,
    AC.AvgArtworkDuration1,
    AC.Artist2,
    AC.LocationID2,
    AC.ArtistRank2,
    AC.ArtworkCount2,
    AC.AvgArtworkDuration2,
    AC.ArtworkCount1 - AC.ArtworkCount2 AS ArtworkCountDifference,
    AC.AvgArtworkDuration1 - AC.AvgArtworkDuration2 AS AvgArtworkDurationDifference
FROM
    temp_artist_comparison AC
ORDER BY
    AC.Country1 ASC,
    AC.City1 ASC,
    AC.ArtistRank1 ASC,
    AC.ArtistRank2 ASC,
    (AC.ArtworkCount1 - AC.ArtworkCount2) DESC
LIMIT 1000;

SELECT
    AC.Artist1,
    AC.LocationID1,
    AC.ArtistRank1,
    AC.ArtworkCount1,
    AC.AvgArtworkDuration1,
    AC.Artist2,
    AC.LocationID2,
    AC.ArtistRank2,
    AC.ArtworkCount2,
    AC.AvgArtworkDuration2,
    AC.ArtworkCount1 - AC.ArtworkCount2 AS ArtworkCountDifference,
    AC.AvgArtworkDuration1 - AC.AvgArtworkDuration2 AS AvgArtworkDurationDifference
FROM
    artist_comparison AC
ORDER BY
    AC.Country1 ASC,
    AC.City1 ASC,
    AC.ArtistRank1 ASC,
    AC.ArtistRank2 ASC,
    (AC.ArtworkCount1 - AC.ArtworkCount2) DESC
LIMIT 1000;

SELECT/*+ NO_INDEX(Artwork) NO_INDEX(Artist) NO_INDEX(Location) NO_INDEX(Metadat */
    Artwork.title,
    Artist.artistDisplayName,
    Location.city,
    Metadata.metadataDate,
    Artwork.objectBeginDate,
    Artwork.objectEndDate,
    Artwork.title,
    Artist.artistRole,
    Artist.artistGender,
    Artist.artistWikidata_URL,
    Artist.artistULAN_URL,
    Location.country,
    (
        SELECT COUNT(*)
        FROM Artwork AS A
        WHERE A.constituentID = Artist.constituentID And A.constituentID != 0
    ) AS num_artworks
FROM
    Artwork
        INNER JOIN Artist ON Artwork.constituentID = Artist.constituentID
        INNER JOIN Location ON Artwork.locationID = Location.locationID
        LEFT JOIN Metadata ON Artwork.objectID = Metadata.objectID
ORDER BY
    num_artworks DESC
LIMIT 100;