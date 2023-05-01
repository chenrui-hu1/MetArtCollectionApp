import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, Button } from '@mui/material';
const config = require('../config.json');
export default function CollectionsPage(){
    const [formData, setFormData] = useState({
        page: 1,
        page_size: 10,
        is_highlight: '',
        is_public_domain: '',
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

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleCheckboxChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.checked ? 'true' : '',
        });
    };

    const handleSubmit = (event) => {
        console.log(formData);
        console.log(123);
        event.preventDefault();
        const queryParams = new URLSearchParams(formData).toString();
        console.log(queryParams);
        fetch(`http://${config.server_host}:${config.server_port}/search_artworks?${queryParams}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // Do something with the response data
            })
            .catch((err) => console.error(err));

    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField name="object_name" label="Object Name" value={formData.object_name} onChange={handleInputChange} />
            <TextField name="artist" label="Artist" value={formData.artist} onChange={handleInputChange} />
            <TextField name="culture" label="Culture" value={formData.culture} onChange={handleInputChange} />
            <TextField name="dynasty" label="Dynasty" value={formData.dynasty} onChange={handleInputChange} />
            <TextField name="medium" label="Medium" value={formData.medium} onChange={handleInputChange} />

            <FormControlLabel
                control={
                    <Checkbox
                        name="is_highlight"
                        checked={formData.is_highlight === 'true'}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                }
                label="Highlight"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        name="is_public_domain"
                        checked={formData.is_public_domain === 'true'}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                }
                label="Public Domain"
            />

            <TextField
                type="number"
                name="object_begin_date"
                label="Object Begin Date"
                value={formData.object_begin_date}
                onChange={handleInputChange}
            />

            <TextField
                type="number"
                name="object_end_date"
                label="Object End Date"
                value={formData.object_end_date}
                onChange={handleInputChange}
            />

            <Select name="department" value={formData.department} onChange={handleInputChange}>
                <MenuItem value="">Select Department</MenuItem>
                <MenuItem value="American Decorative Arts">American Decorative Arts</MenuItem>
                <MenuItem value="Arms and Armor">Arms and Armor</MenuItem>
                <MenuItem value="Asian Art">Asian Art</MenuItem>
                <MenuItem value="The Cloisters">The Cloisters</MenuItem>
                <MenuItem value="Costume Institute">Costume Institute</MenuItem>
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
            <Select name="classification" value={formData.classification} onChange={handleInputChange}>
                <MenuItem value="">Select Classification</MenuItem>
                <MenuItem value="Architectural element">Architectural element</MenuItem>
                <MenuItem value="Armor">Armor</MenuItem>
                <MenuItem value="Book">Book</MenuItem>
                <MenuItem value="Calligraphy">Calligraphy</MenuItem>
                <MenuItem value="Ceramics">Ceramics</MenuItem>
                <MenuItem value="Costume">Costume</MenuItem>
                <MenuItem value="Drawing">Drawing</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Glass">Glass</MenuItem>
                <MenuItem value="Jewelry">Jewelry</MenuItem>
                <MenuItem value="Manuscript">Manuscript</MenuItem>
                <MenuItem value="Metalwork">Metalwork</MenuItem>
                <MenuItem value="Miniature">Miniature</MenuItem>
                <MenuItem value="Painting">Painting</MenuItem>
                <MenuItem value="Photograph">Photograph</MenuItem>
                <MenuItem value="Print">Print</MenuItem>
                <MenuItem value="Sculpture">Sculpture</MenuItem>
                <MenuItem value="Textile">Textile</MenuItem>
                <MenuItem value="Tools and equipment">Tools and equipment</MenuItem>
                <MenuItem value="Weapon">Weapon</MenuItem>
            </Select>

            <TextField name="portfolio" label="Portfolio" value={formData.portfolio} onChange={handleInputChange} />
            <TextField name="location" label="Location" value={formData.location} onChange={handleInputChange} />
            <TextField name="title" label="Title" value={formData.title} onChange={handleInputChange} />

            <Button type="submit" variant="contained" color="primary">
                Search
            </Button>
        </form>
    );
}





// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
//
// const useStyles = makeStyles({
//     table: {
//         minWidth: 650,
//     },
// });
//
// export default function CollectionsPage() {
//     const classes = useStyles();
//
//     const data = {
//         constituentID: 161586,
//         artistRole: 'Publisher',
//         artistPrefix: 'Issued by',
//         artistDisplayName: 'Allen & Ginter',
//         artistDisplayBio: 'American, Richmond, Virginia',
//         artistSuffix: null,
//         artistBeginDate: null,
//         artistEndDate: null,
//         artistGender: null,
//         artistWikidata_URL: 'https://www.wikidata.org/wiki/Q4731490',
//         artistULAN_URL: '(not assigned)',
//     };
//
//     return (
//         <div>
//             <h1>Collection Page</h1>
//             <Table className={classes.table}>
//                 <TableHead>
//                     <TableRow>
//                         {Object.keys(data).map((key) => (
//                             <TableCell key={key}>{key}</TableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     <TableRow>
//                         {Object.values(data).map((value, index) => (
//                             <TableCell key={index}>{value}</TableCell>
//                         ))}
//                     </TableRow>
//                 </TableBody>
//             </Table>
//         </div>
//     );
// }
