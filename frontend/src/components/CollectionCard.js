import React from 'react';
import { useEffect, useState } from 'react';
import {Grid, Box, Modal } from '@mui/material';
import { NavLink } from 'react-router-dom';

import axios from 'axios';

const config = require('../config.json');

export default function CollectionCard({ collectionId, handleClose }) {
  const [collectionData, setCollectionData] = useState({});
  const [artistData, setArtistData] = useState({});

  useEffect(() => {
    axios.get(`${config.server_protocol}${config.server_host}:${config.server_port}/artwork/${collectionId}`)
        .then(res => res.data)
        .then(resJson => {
          setCollectionData(resJson);
          axios.get(`${config.server_protocol}${config.server_host}:${config.server_port}/artist/${resJson.constituentID}`)
              .then(res => res.data)
              .then(data => setArtistData(data));
        });
    }, []);


  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', Top:"25%", Left:"25%", marginLeft:"25%"}}
    >
      <Grid container spacing={2}>

        <Grid item xs={6} style={{position:"center"}}>
          <Box
              p={3}
              style={{ background: 'white', borderRadius: '16px', border: '2px solid gray', width: 600 }}
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
