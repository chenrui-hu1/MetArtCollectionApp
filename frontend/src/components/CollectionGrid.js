import React from 'react';
import { useEffect, useState } from 'react';
import {Grid, Modal, Backdrop, Fade, Container, Box, Paper} from '@mui/material';

import axios from 'axios';


const grid_style = {
    container: {
        width: '3',
        height: '200px',
        justifyContent: 'space-evenly',
        position: "relative",
        background: 'white',
        borderRadius: '10px',
        padding: '10px',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
}


export default function CollectionGrid({route, seed}){
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCollectionImage, setSelectedCollectionImage] = useState(null);

    const [collectionList, setCollectionList] = useState([]);

    useEffect(() => {
        async function fetchCollection(){
            const response = await axios.get(route);
            return response.data;
        }

        fetchCollection().then(data => {
            setCollectionList(data);
        });
    }, [seed]);

    const handleOpenModal = (image) => {
        setSelectedCollectionImage(image);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCollectionImage(null);
        setModalOpen(false);
    };

    return (
        <div>
            <Grid container spacing={2}>
                {collectionList.map((collection) => (
                    <Grid item xs={6} sm={3} key={collection.objectID}>
                        <Paper style={grid_style.container}>
                            <img
                                style={grid_style.image}
                                src={collection.primaryImage}
                                alt={`${collection.title}`}
                                onClick={() => handleOpenModal(collection)}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                style={{ alignItems: "center", justifyContent: "center", maxWidth:"500px", maxHeight:"500px", position:"absolute", top:"25%", left:"25%"}}
            >
                <Box in={modalOpen}>
                    <div>
                        {selectedCollectionImage && (
                            <img
                                src={selectedCollectionImage.primaryImage}
                                alt={`Image ${selectedCollectionImage.title}`}
                                style={{ maxWidth: "100%", overflow: "hidden"}}
                            />
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );

}
