import {Stack, Box} from "@mui/material";

export default function ArtistCard({groupData}){
    return (
        <Box style={{justifyContent:'center'}}>
            <h1 style={{ fontSize: 64 }}>{groupData.artistDisplayName}</h1>
            <h2>Bio: {groupData.artistDisplayBio}</h2>
            {groupData.artistWikidata_URL && <h3>Extra resources: {groupData.artistWikidata_URL}</h3>}
        </Box>
    )

}
