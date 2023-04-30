import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function DepartmentPage() {
    const department_list = [
        "The American Wing",
        "European Sculpture and Decorative Arts",
        "Modern and Contemporary Art",
        "Arms and Armor",
        "Medieval Art",
        "Asian Art",
        "Costume Institute",
        "Islamic Art",
        "The Michael C. Rockefeller Wing",
        "Greek and Roman Art",
        "Photographs",
        "Ancient Near Eastern Art",
        "Egyptian Art",
        "Drawings and Prints",
        "Robert Lehman Collection",
        "The Cloisters",
        "European Paintings",
        "Musical Instruments",
        "The Libraries"
    ]

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/albums`)
            .then(res => res.json())
            .then(resJson => setAlbums(resJson));
    }, []);

    const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

    return (
        // (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
        // (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
        <Container style={flexFormat}>
            {albums.map((album) =>
                <Box
                    key={album.album_id}
                    p={3}
                    m={2}
                    style={{ background: 'white'}}
                >
                    {
                        <img
                            src={album.thumbnail_url}
                            alt={`${album.title} album art`}
                        />
                    }
                    <h4><NavLink to={`/albums/${album.album_id}`}>{album.title}</NavLink></h4>
                </Box>
            )}
        </Container>
    );
}
