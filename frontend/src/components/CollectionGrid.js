import { useEffect, useState } from 'react';
import {Grid, Modal, Backdrop, Fade, Container, Box} from '@mui/material';

import axios from 'axios';

const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', xs:'6', sm:'3', maxWidth: '30%' };
const imageFormat = { width: '100%', objectFit:'contain'};

const grid_style = {
    container: {
        // display: 'flex',
        // flexDirection: 'row',
        width: '3',
        height: '200px',
        justifyContent: 'space-evenly',
        position: "relative",
        background: 'white',
        borderRadius: '10px',
        padding: '10px',
        border: '2px solid gray',
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
            {/*<Container style={flexFormat}>*/}
            {/*    {collectionList.map((collection) =>*/}
            {/*        <Box*/}
            {/*            key={collection.collectionID}*/}
            {/*            p={3}*/}
            {/*            m={2}*/}
            {/*            style={{ background: 'white', borderRadius: '16px', border: '2px solid #000'}}*/}
            {/*        >*/}
            {/*            {*/}
            {/*                <img*/}
            {/*                    src={collection.primaryImage}*/}
            {/*                    alt={`${collection.title}`}*/}
            {/*                    style={imageFormat}*/}
            {/*                    onClick={() => handleOpenModal(collection)}*/}
            {/*                />*/}
            {/*            }*/}
            {/*        </Box>*/}
            {/*    )}*/}
            {/*</Container>*/}
            <Grid container spacing={2}>
                {collectionList.map((collection) => (
                    <Grid item xs={6} sm={3} key={collection.objectID}>
                        <Box style={grid_style.container}>
                            <img
                                style={grid_style.image}
                                src={collection.primaryImage}
                                alt={`${collection.title}`}
                                onClick={() => handleOpenModal(collection)}
                            />
                        </Box>
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
            >
                <Fade in={modalOpen}>
                    <div>
                        {selectedCollectionImage && (
                            <img
                                src={selectedCollectionImage.primaryImage}
                                alt={`Image ${selectedCollectionImage.title}`}
                                style={{ maxWidth: "100%" }}
                            />
                        )}
                    </div>
                </Fade>
            </Modal>
        </div>
    );

}
