import {Stack} from "@mui/material";

export default function DepartmentCard({groupData}){
    return (
        <Stack direction='row' justify='center'>
            <img
                key={groupData.Department}
                src={`${process.env.PUBLIC_URL}/${groupData.image}`}
                alt={`${groupData.Department} department art`}
                style={{
                    marginTop: '40px',
                    marginRight: '40px',
                    marginBottom: '40px',
                    width: '300px',
                    height: '300px',
                }}
            />
            <Stack>
                <h1 style={{ fontSize: 64 }}>{groupData.Department}</h1>
                <div>
                    <h3>Description:</h3>
                </div>
                <p>{groupData.Description}</p>
            </Stack>
        </Stack>
    )

}
