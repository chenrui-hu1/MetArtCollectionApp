import { useEffect, useState } from 'react';
import {Grid, Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
require('dotenv').config();

const axios = require('axios');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function SongCard({ songId, handleClose }) {
  const [collectionData, setCollectionData] = useState({});
  const [artistData, setArtistData] = useState({});

  const [barRadar, setBarRadar] = useState(true);

  // (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => {
    // Hint: here is some pseudocode to guide you
    // fetch(song data, id determined by songId prop)
    //   .then(res => res.json())
    //   .then(resJson => {
    //     set state variable with song dta
    //     fetch(album data, id determined by result in resJson)
    //       .then(res => res.json())
    //       .then(resJson => set state variable with album data)
    //     })
    axios.get(`http://${process.env.SERVER_HOST}:${process.env.SERVER_HOST}/artwork/${songId}`)
        .then(res => res.data)
        .then(resJson => {
          setCollectionData(resJson);
          axios.get(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/artist/${resJson.constituentID}`)
              .then(res => res.data)
              .then(resJson => setArtistData(resJson));
        });
    }, []);

  // const chartData = [
  //   { name: 'Danceability', value: songData.danceability },
  //   { name: 'Energy', value: songData.energy },
  //   { name: 'Valence', value: songData.valence },
  // ];
  //
  // const handleGraphChange = () => {
  //   setBarRadar(!barRadar);
  // };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box>
            <img src={collectionData.primaryImage} alt={collectionData.title} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
              p={3}
              style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
          >
            <h1>{collectionData.title}</h1>
            <h2>Artist:&nbsp;
              <NavLink to={`/artist/${collectionData.constituentID}`}>{artistData.artistDisplayName}</NavLink>
            </h2>
            <p>Collection Date: {collectionData.objectDate}</p>
            <p>Tempo: {songData.tempo} bpm</p>
            <p>Department: {collectionData.department}</p>
            {collectionData.profolio && <p> Profolio: {collectionData.profolio}</p>}
          </Box>
        </Grid>
      </Grid>
    </Modal>
    );
}
