import { useEffect, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Paper, Grid } from "@mui/material";
import department_list from '../data/departments.js';

const styles = {
    container:{
        // justifyContent: 'space-evenly',
        // position: "relative",
        // background: 'white',
        // borderRadius: '10px',
        padding: '10px',
        xs:'4',
        sm:"3",

        width: '200px',
        height: '200px',
        position: 'relative',
        direction:"row",
        justify:"center"
    },
    image: {
        // width:'200px',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',

        // position:'absolute',
        // top: '30%',
        // left: '30%',
        // transform: 'translate(-50%, -50%)',

        // width:'100px',
        // height:'100px',
    },
}

export default function DepartmentPage() {

    return (
        <Grid container style={styles.container}>
            {department_list.map((department) =>
                <Grid item spacing={2} >
                    < Paper
                        key={department.Department}
                        style={{ background: 'white'}}
                        elevation={3}
                    >
                            {
                                <Box style={styles.image}>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/${department.image}`}
                                        alt={`${department.Department}`}
                                        // style={styles.image}
                                    />
                                    <h3>{department.Department}</h3>
                                    <p>{department.Description}</p>
                                </Box>
                            }
                    </Paper>
                </Grid>
            )}
        </Grid>
    );
}
