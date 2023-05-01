import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import CollectionCard from '../components/CollectionCard';
import axios from "axios";
import department_list from "../data/departments";
import ArtistCard from "../components/ArtistCard";
import DepartmentCard from "../components/DepartmentCard";

const config = require('../config.json');

export default function DepAndArtistInfoPage({isArtist}) {
    const { groupId } = useParams();

    const [collectionData, setCollectionData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
    const [groupData, setGroupData] = useState([]);

    const [selectedCollectionId, setSelectedCollectionId] = useState(null);

    useEffect(() => {

        async function fetchGroupData(){
            if(isArtist === true){
                const response = await axios.get(`http://${config.server_host}:${config.server_port}/artist/${groupId}`)
                setGroupData(response.data);
            }else{
                const item = department_list.filter((dep) => dep.Department === groupId);
                setGroupData(item[0]);
            }
        }

        async function fetchCollectionData(){
            if(isArtist === true){
                console.log("artist");
                console.log(`groupId: ${groupId}`);
                console.log(`groupData: ${groupData}`);
                console.log(`http://${config.server_host}:${config.server_port}/search_artworks?constituentID=${groupId}`);
                const response = await axios.get(`http://${config.server_host}:${config.server_port}/search_artworks?constituentID=${groupId}`);
                setCollectionData(response.data);
            }else{
                const response = await axios.get(`http://${config.server_host}:${config.server_port}/search_artworks?department=${groupId}`);
                console.log(`groupData: ${groupData}`);
                setCollectionData(response.data);
            }
        }
        fetchGroupData();
        fetchCollectionData();
    }, [groupId]);

    return (
        <Container>
            {selectedCollectionId && <CollectionCard collectionId={selectedCollectionId} handleClose={() => setSelectedCollectionId(null)} />}
            {
                isArtist === true ?
                    <ArtistCard groupData={groupData}/> :
                    <DepartmentCard groupData={groupData}/>
            }
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell key='id'>#</TableCell>
                            <TableCell key='title'>Title</TableCell>
                            <TableCell key='is_hightlight'>isHightlight</TableCell>
                            <TableCell key='is_public_domain'>isPublicDomain</TableCell>
                            <TableCell key='department'>Department</TableCell>
                            <TableCell key='object_name'>Object Name</TableCell>
                            <TableCell key='object_date'>Object Date</TableCell>
                            <TableCell key='medium'>Medium</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            collectionData.map( row =>
                                <TableRow key={row.objectID}>
                                    <TableCell key='id'>{row.objectID}</TableCell>
                                    <TableCell key='Title'>
                                        <Link onClick={() => setSelectedCollectionId(row.objectID)}>
                                            {row.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell key='is_hightlight'>{row.isHightlight}</TableCell>
                                    <TableCell key='is_public_domain'>{row.isPublicDomain}</TableCell>
                                    <TableCell key='department'>{row.department}</TableCell>
                                    <TableCell key='object_name'>{row.objectName}</TableCell>
                                    <TableCell key='object_date'>{row.objectDate}</TableCell>
                                    <TableCell key='medium'>{row.medium}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
