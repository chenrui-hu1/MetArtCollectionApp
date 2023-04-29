import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';



import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';

require('dotenv').config()

const axios = require('axios');
const config = require('../config.json');

export default function HomePage() {
    // We use the setState hook to persist information across renders (such as the result of our API calls)
    const [collectionOfTheDay, setCollectionOfTheDay] = useState({});
    // (TASK 13): add a state variable to store the app author (default to '')
    const [appAuthor, setAppAuthor] = useState('');

    const [selectedCollectionId, setSelectedCollectionId] = useState(null);

    // The useEffect hook by default runs the provided callback after every render
    // The second (optional) argument, [], is the dependency array which signals
    // to the hook to only run the provided callback if the value of the dependency array
    // changes from the previous render. In this case, an empty array means the callback
    // will only run on the very first render.
    useEffect(() => {
        // Fetch request to get the song of the day. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        axios.get(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/artwork/random`)
            .then(res => res.json())
            .then(resJson => setCollectionOfTheDay(resJson));

        // (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
        // try{
        //     fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/author/name`)
        //         .then(res => res.text())
        //         .then(resText => {
        //             setAppAuthor(resText);
        //         })
        // } catch (e) {
        //     console.log(e);
        // }
    }, []);

    // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
    // of objects with each object representing a column. Each object has a "field" property representing
    // what data field to display from the raw data, "headerName" property representing the column label,
    // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
    const collectionColumn = [
        {
            field: 'title',
            headerName: 'Collection Title',
            renderCell: (row) => <Link onClick={() => setSelectedCollectionId(row.objectID)}>{row.title}</Link> // A Link component is used just for formatting purposes
        },
        {
            field: 'objectName',
            headerName: 'Object Name',
        },
        {
            field: 'artistDisplayName',
            headerName: 'Artist Name',
            renderCell: (row) => <NavLink to={`/artists/${row.constituentID}`}>{row.artistDisplayName}</NavLink>
        },
        {
            field: 'culture',
            headerName: 'Culture'
        },
    ];

    // (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
    // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
    const artistColumn = [
        {
            field:'artistDisplayName',
            headerName:'Artist Name',
            renderCell: (row) => <NavLink to={`/artists/${row.constituentID}`}>{row.artistDisplayName}</NavLink>
        },
        {
            field:'num_artworks',
            headerName:'Number of Collections'
        },
        {
            field:'artist_begin_date',
            headerName:'Artist Begin Date'
        },
        {
            field:'artist_end_date',
            headerName:'Artist End Date'
        }
    ]

    return (
        <Container>
            {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
            {selectedCollectionId && <SongCard songId={selectedCollectionId} handleClose={() => setSelectedCollectionId(null)} />}
            <h2>Check out your song of the day:&nbsp;
                <Link onClick={() => setSelectedCollectionId(collectionOfTheDay.objectID)}>{collectionOfTheDay.title}</Link>
            </h2>
            <Divider />
            <h2>Top Collections</h2>
            <LazyTable route={`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/top_songs`} columns={collectionColumn} />
            <Divider />
            {/* (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
            <h2>Top Artists</h2>
            <LazyTable route={`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/top_albums`}
                       columns={artistColumn}
                       defaultPageSize={5}
                       rowsPerPageOptions={[5, 10]} />
            <Divider />
        </Container>
    );
};
