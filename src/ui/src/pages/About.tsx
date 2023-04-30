import React, {ReactElement, FC} from "react";
import {Box, Container, Paper, Typography} from "@mui/material";
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

const About: FC<any> = (): ReactElement => {
    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>            
           <Container maxWidth="xl">
                <Typography variant="h3">About</Typography>
                <Typography variant="subtitle1">About this app!</Typography>
               
                <Typography variant="body1">
                    Body 1.
                </Typography>
                <Typography variant="body2">                    
                    Body 2.
                </Typography>
                <Typography variant="caption">Caption!</Typography>
                <Typography variant="overline">Overline!</Typography>                
                <Typography variant="button">Button!</Typography>
                <Item>Something!</Item>
            </Container>
        </Box>
    );
};

export default About;