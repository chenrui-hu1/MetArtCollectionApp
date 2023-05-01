import React from "react";
import { useEffect, useState } from 'react';
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Link,
    MenuItem,
    Select,
    Slider,
    TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import SongCard from '../components/SongCard';

const config = require('../config.json');

export default function CollectionsPage() {
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [selectedObjectID, setObjectID] = useState(null);

    const [formData, setFormData] = useState({
        page: 1,
        page_size: 100,
        is_highlight: 'True',
        is_public_domain: 'False',
        object_begin_date: '',
        object_end_date: '',
        department: '',
        classification: '',
        portfolio: '',
        object_name: '',
        title: '',
        culture: '',
        dynasty: '',
        medium: '',
        artist: '',
        location: '',
    });

    const [title, setTitle] = useState('');
    const [highlight, setHighlight] = useState( false);
    const [beginDate, setBeginDate] = useState(1700);
    const [endDate,setEndDate] = useState(1900);
    const [department, SetDepartment] = useState('');
    const [culture, setCulture] = useState('');
    const [medium,setMedium] = useState('');
    const[isPublicDomain, setIsPublicDomain] = useState(false);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };


    useEffect(() => {
        const queryParams = new URLSearchParams(formData).toString();
        fetch(`http://${config.server_host}:${config.server_port}/search_artworks?${queryParams}`)
            .then(res => res.json())
            .then(resJson => {
                const objectId = resJson.map((collecion) => ({ id: collecion.objectID, ...collecion }));
                setData(objectId);
                console.log(objectId);
            });
    }, []);

    const search = () => {
        setFormData({
            ...formData,
            title: title,
            is_highlight: highlight,
            object_begin_date: beginDate,
            object_end_date: endDate,
            department: department,
            culture: culture,
            medium: medium,
        });

        const queryParams = new URLSearchParams(formData).toString();
        console.log(queryParams);
        fetch(`http://${config.server_host}:${config.server_port}/search_artworks?${queryParams}`)
            .then((res) => res.json())
            .then(resJson => {
                console.log(resJson);
                const objectId = resJson.map((collecion) => ({ id: collecion.objectID, ...collecion }));
                setData(objectId);
            });
    }

    // This defines the columns of the table of songs used by the DataGrid component.
    // The format of the columns array and the DataGrid component itself is very similar to our
    // LazyTable component. The big difference is we provide all data to the DataGrid component
    // instead of loading only the data we need (which is necessary in order to be able to sort by column)
    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            width: 350, // or 600 or larger if needed
            renderCell: (params) => (
                <Link onClick={() => setObjectID(params.row.objectID)}>{params.value}</Link>
            )
        },
        { field: 'isHighlight', headerName: 'Highlight' },
        { field: 'isPublicDomain', headerName: 'PublicDomains',width: 200  },
        { field: 'objectBeginDate', headerName: 'BeginDate' },
        { field: 'objectEndDate', headerName: 'EndDate' },
        { field: 'department', headerName: 'Department',width: 200 },
        { field: 'objectName', headerName: 'Name' },
        { field: 'culture', headerName: 'Culture',width: 200 },
        { field: 'medium', headerName: 'Medium',width: 200}
    ];


    // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
    // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
    // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
    // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
    // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
    // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
    // will automatically lay out all the grid items into rows based on their xs values.
    return (
        <Container>
            {selectedObjectID && <SongCard collectionId={selectedObjectID} handleClose={() => setObjectID(null)} />}
            <h2>Search Collections</h2>
            <Grid container spacing={6}>
                <Grid item xs={4}>
                    <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={4}>
                    <FormControlLabel
                        label='Highlight'
                        control={<Checkbox checked={highlight} onChange={(e) => {
                            setFormData({
                                ...formData,
                                is_highlight: e.target.checked,
                            });
                            setHighlight(e.target.checked);
                        }
                        } />}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControlLabel
                        label='Public Domain'
                        control={<Checkbox checked={isPublicDomain} onChange={(e) => {
                            setFormData(
                                {
                                    ...formData,
                                    is_public_domain: e.target.checked,

                                }
                            );
                            setIsPublicDomain(e.target.checked);
                        }
                        }/>}
                    />
                </Grid>
                <Grid item xs={6}>
                    <p>Begin Date</p>
                    <Slider
                        value={beginDate}
                        min={1700}
                        max={2021}
                        step={1}
                        onChange={(e, newValue) => setBeginDate(newValue)}
                        valueLabelDisplay='auto'
                        // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
                    />
                </Grid>
                <Grid item xs={6}>
                    <p>End Date</p>
                    <Slider
                        value={endDate}
                        min={1700}
                        max={2021}
                        step={1}
                        onChange={(e, newValue) => setEndDate(newValue)}
                        valueLabelDisplay='auto'
                        valueLabelFormat={value => <div>{value / 1000000}</div>}
                    />
                </Grid>

                <Grid item xs={4}>
                    <p>Department</p>

                <Select name="department" value={formData.department} onChange={handleInputChange}>
                    <MenuItem value="">Select Department</MenuItem>
                    <MenuItem value="The American Wing">The American Wing</MenuItem>
                    <MenuItem value="Ancient Near Eastern Art">Ancient Near Eastern Art</MenuItem>
                    <MenuItem value="Arms and Armor">Arms and Armor</MenuItem>
                    <MenuItem value="Asian Art">Asian Art</MenuItem>
                    <MenuItem value="Costume Institute">Costume Institute</MenuItem>
                    <MenuItem value="Drawings and Prints">Drawings and Prints</MenuItem>
                    <MenuItem value="Egyptian Art">Egyptian Art</MenuItem>
                    <MenuItem value="European Paintings">European Paintings</MenuItem>
                    <MenuItem value="European Sculpture and Decorative Arts">European Sculpture and Decorative Arts</MenuItem>
                    <MenuItem value="Greek and Roman Art">Greek and Roman Art</MenuItem>
                    <MenuItem value="Islamic Art">Islamic Art</MenuItem>
                    <MenuItem value="The Robert Lehman Collection">The Robert Lehman Collection</MenuItem>
                    <MenuItem value="Medieval Art">Medieval Art</MenuItem>
                    <MenuItem value="Modern and Contemporary Art">Modern and Contemporary Art</MenuItem>
                    <MenuItem value="Musical Instruments">Musical Instruments</MenuItem>
                    <MenuItem value="Photographs">Photographs</MenuItem>
                    <MenuItem value="Robert Lehman Collection">Robert Lehman Collection</MenuItem>
                </Select>

                </Grid>
                <Grid item xs={4}>
                    <p>Medium</p>
                    <Select name="medium" value={formData.medium} onChange={handleInputChange}>
                        <MenuItem value="">Select Medium</MenuItem>
                        <MenuItem value="Albumen silver print">Albumen silver print</MenuItem>
                        <MenuItem value="Albumen silver prints from glass negatives">Albumen silver prints from glass negatives</MenuItem>
                        <MenuItem value="Albumen silver prints from paper negatives">Albumen silver prints from paper negatives</MenuItem>
                        <MenuItem value="Albumen silver prints from paper negatives with applied color">Albumen silver prints from paper negatives with applied color</MenuItem>
                        <MenuItem value="Albumen silver prints from paper negatives with applied color and applied gold">Albumen silver prints from paper negatives with applied color and applied gold</MenuItem>
                        <MenuItem value="Albumen silver prints from paper negatives with applied color and applied gold, and albumen silver prints from paper negatives">Albumen silver prints from paper negatives with applied color and applied gold, and albumen silver prints from paper negatives</MenuItem>
                        <MenuItem value="Albumen silver prints from paper negatives with applied color and applied gold, and albumen silver prints from paper negatives, and albumen silver prints from glass negatives">Albumen silver prints from paper negatives with applied color and applied gold, and albumen silver prints from paper negatives, and albumen silver prints from glass negatives</MenuItem>
                        <MenuItem value="Albumen silver prints from paper negatives with applied color and applied gold, and albumen silver prints from paper negatives, and albumen silver prints from glass negatives, and albumen silver prints from paper negatives with applied color">Albumen silver prints from paper negatives with applied color and applied gold, and albumen silver prints from paper negatives, and albumen silver prints from glass negatives, and albumen silver prints from paper negatives with applied color</MenuItem>

                    </Select>
                </Grid>
                <Grid item xs={4}>
                    <p>Artist</p>
                    <Select name="Artist" value={formData.artist} onChange={handleInputChange}>
                        <MenuItem value="">Select Artist</MenuItem>
                        <MenuItem value="Christian Gobrecht">Christian Gobrecht</MenuItem>
                        <MenuItem value="A. N. Cook & Company">A. N. Cook & Company</MenuItem>
                        <MenuItem value="Aaron Martinet">Aaron Martinet</MenuItem>
                        <MenuItem value="Aaron Willard">Aaron Willard</MenuItem>
                        <MenuItem value="萩谷勝平 Hagiya Katsuhiras">萩谷勝平 Hagiya Katsuhira</MenuItem>
                        <MenuItem value="Zacharias Täschler">Zacharias Täschler</MenuItem>
                        <MenuItem value="Workshop of Botticelli">Workshop of Botticelli</MenuItem>
                    </Select>
                </Grid>



                {/* (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
                {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
                {/*<Grid item xs={4}>*/}
                {/*    <p>Department</p>*/}
                {/*    <Slider*/}
                {/*        value={department}*/}
                {/*        min={0}*/}
                {/*        max={1}*/}
                {/*        step={0.1}*/}
                {/*        onChange={(e, newValue) => setDanceability(newValue)}*/}
                {/*        valueLabelDisplay='auto'*/}
                {/*        valueLabelFormat={value => <div>{value}</div>}*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid item xs={4}>*/}
                {/*    <p>Energy</p>*/}
                {/*    <Slider*/}
                {/*        value={energy}*/}
                {/*        min={0}*/}
                {/*        max={1}*/}
                {/*        step={0.1}*/}
                {/*        onChange={(e, newValue) => setEnergy(newValue)}*/}
                {/*        valueLabelDisplay='auto'*/}
                {/*        valueLabelFormat={value => <div>{value}</div>}*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid item xs={4}>*/}
                {/*    <p>Valence</p>*/}
                {/*    <Slider*/}
                {/*        value={valence}*/}
                {/*        min={0}*/}
                {/*        max={1}*/}
                {/*        step={0.1}*/}
                {/*        onChange={(e, newValue) => setValence(newValue)}*/}
                {/*        valueLabelDisplay='auto'*/}
                {/*        valueLabelFormat={value => <div>{value}</div>}*/}
                {/*    />*/}
                {/*</Grid>*/}
            </Grid>
            <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
                Search
            </Button>
            <h2>Results</h2>
            {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
            />
        </Container>
    );
}
