import React from 'react';
import { useEffect, useState } from 'react';
import {Box, Container, Divider, Grid, Link} from '@mui/material';
import { NavLink } from 'react-router-dom';
import RefreshIcon  from '@mui/icons-material/Refresh';
import LazyTable from '../components/LazyTable';
import CollectionCard from '../components/CollectionCard';
import axios from 'axios';
import CollectionGrid from "../components/CollectionGrid";
const config = require('../config.json');

export default function HomePage() {
    const [collectionOfTheDay, setCollectionOfTheDay] = useState({});

    const [selectedCollectionId, setSelectedCollectionId] = useState(null);

    const [seed, setSeed] = useState(0);


    useEffect( () => {
        async function getRandomArtwork() {
            try{
                const res = await axios.get(`${config.server_protocol}${config.server_host}:${config.server_port}/random_artworks/1`);
                return res.data;
            }catch (err){
                console.log(err);
            }
        }
        getRandomArtwork().then(data => setCollectionOfTheDay(data[0]));
    }, []);

    const handleSeed = () => {
        console.log("seed");
        setSeed(Math.random());
    }

    const artistColumn = [
        {
            field:'artistDisplayName',
            headerName:'Artist Name',
            renderCell: (row) => <NavLink to={`/artist/${row.constituentID}`}>{row.artistDisplayName}</NavLink>
        },
        {
            field:'num_artworks',
            headerName:'Number of Collections'
        },
        {
            field:'artistBeginDate',
            headerName:'Artist Begin Date'
        },
        {
            field:'artistEndDate',
            headerName:'Artist End Date'
        }
    ]

    return (
        <Container>
            {selectedCollectionId && <CollectionCard collectionId={selectedCollectionId} handleClose={() => setSelectedCollectionId(null)} />}
            <h2>Your Random Collection Today:&nbsp;
                <Link onClick={() => setSelectedCollectionId(collectionOfTheDay.objectID)}>{collectionOfTheDay.title}</Link>
            </h2>
            <Divider />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <h2>Top Collections</h2>
                </Grid>
                <Grid item xs={6} style={{marginTop:'20px'}}>
                    <RefreshIcon fontSize='large' onClick={() => handleSeed()}/>
                </Grid>
            </Grid>
            <Box>
                <CollectionGrid
                    route={`${config.server_protocol}${config.server_host}:${config.server_port}/random_artworks/12`}
                    seed={seed}
                />
            </Box>
            <Divider />
            <h2>Top Artists</h2>
            <LazyTable route={`${config.server_protocol}${config.server_host}:${config.server_port}/top_artists`}
                       columns={artistColumn}
                       defaultPageSize={5}
                       rowsPerPageOptions={[5, 10]} />
            <Divider />
        </Container>
    );
};
