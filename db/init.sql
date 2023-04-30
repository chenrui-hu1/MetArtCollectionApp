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


Select * From Artwork WHERE Artwork.isHighlight = 'True'AND Artwork.isPublicDomain = 'False'AND Artwork.objectBeginDate Between '1700' And '1800'AND Artwork.objectEndDate Between '1700' And '1800'AND Artwork.department = 'The American Wing'AND Artwork.classification Like '%Missing%'


Select * From Artwork WHERE Artwork.isHighlight = 'True' AND Artwork.constituentID IN (SELECT Artist.constituentID FROM Artist)AND Artwork.locationID IN (SELECT Location.locationID FROM Location)Order By Artwork.objectID Limit 10 Offset 10