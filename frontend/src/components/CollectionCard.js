import { useEffect, useState } from 'react';
import {Grid, Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { NavLink } from 'react-router-dom';

import axios from 'axios';

const config = require('../config.json');

export default function CollectionCard({ songId, handleClose }) {
  const [collectionData, setCollectionData] = useState({});
  const [artistData, setArtistData] = useState({});

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/artwork/${songId}`)
        .then(res => res.data)
        .then(resJson => {
          setCollectionData(resJson);
          axios.get(`http://${config.server_host}:${config.server_port}/artist/${resJson.constituentID}`)
              .then(res => res.data)
              .then(resJson => setArtistData(resJson));
        });
    }, []);


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
            <p>Collection Culture: {collectionData.culture}</p>
            <p>Department: {collectionData.department}</p>
            {collectionData.profolio && <p> Profolio: {collectionData.profolio}</p>}
          </Box>
        </Grid>
      </Grid>
    </Modal>
    );
}
