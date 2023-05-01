import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import department_list from '../data/departments.js';

import { Grid, Box, Paper } from '@mui/material';
const styles = {


    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '10px',
        '&:hover img': {
            transform: 'scale(1.2)',
            transition: 'transform 0.3s ease',
        },
    },
    item: {
        padding: '10px',
        width: 'calc(33.33% - 20px)',
        minWidth: '200px',
        margin: '10px',
    },
    paper: {
        background: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '10px'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    title: {
        margin: '10px 0',
    },
    description: {
        margin: '10px 0',
    }
};

export default function DepartmentPage() {
    return (
        <div style={styles.container}>
            {department_list.map((department) => (
                <div style={styles.item} key={department.Department}>
                    <Paper style={styles.paper} elevation={3}>
                        <Box style={styles.image}>
                            <img
                                src={`${process.env.PUBLIC_URL}/${department.image}`}
                                alt={`${department.Department}`}
                            />
                            <h3 style={styles.title}>{department.Department}</h3>
                            <p style={styles.description}>{department.Description}</p>
                        </Box>
                    </Paper>
                </div>
            ))}
        </div>
    );
}
