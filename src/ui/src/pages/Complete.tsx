import React, {ReactElement, FC, useState, useEffect} from "react";
import {Alert, Box, Button, Container, Drawer, Grid, Input, Paper, Typography, colors} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import ClearIcon from '@mui/icons-material/Clear';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PageHeader  from "../components/PageHeader";
import { SharedState } from "../state/SharedState";
import {oaiService, CompletionMessage, CompletionResponse } from "../services/oaiService";


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

interface CompleteProps {
    sharedState: SharedState;
}

interface Interation {
    response: CompletionResponse;
    query: string;
}


const Complete: FC<CompleteProps> = ({sharedState}): ReactElement => {
    const [openAiInfo, setOpenAiInfo] = useState<any>({});
    const [processing, setProcessing] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [interactions, setInteractions] = useState<Interation[]>([]);
    const [selectedCompletion, setSelectedCompletion] = useState<CompletionResponse | null>(null);

    const beingCompletions = async () => {
        setProcessing(true);
        var complete = await oaiService.getCompletionAsync(content);
        setSelectedCompletion(complete);
        setInteractions((prev) => [...prev, {
            response: complete,
            query: content,
        }]);
        setProcessing(false);
    };

    const resetCompletions = async () => {
        setProcessing(false);
        setContent("");
        setInteractions([]);
        setSelectedCompletion(null);
    };

    const openSettings = async () => {
        // Toggle the drawer
        setIsSettingsOpen(!isSettingsOpen);
    };

    useEffect(() => {
        (async ()=>{
            setOpenAiInfo(await oaiService.getInfoAsync());
        })()
    }, []);

    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: 'block',            
            padding: '2rem',
        }}>
           <Container maxWidth="xl">
                <PageHeader title="Complete" subtitle={`Generate completions using Open AI (via ${openAiInfo.type}).`} />
                <Box hidden={sharedState.errors.length < 1}>
                    {sharedState.errors.map((e: any, i: number) => {
                        return <Alert key={i} severity="error" onClose={() => sharedState.binErrors(i)}>
                            {e}
                        </Alert>
                    })}
                </Box>
                <Grid container spacing={2} style={{marginTop:"1rem"}}>
                    <Grid item>
                        <Button onClick={beingCompletions}
                            disabled={content === "" || processing}
                            variant="contained"
                            startIcon={<SendIcon />}>
                            Process
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            onClick={resetCompletions}
                            disabled={content === ""}
                            variant="outlined"
                            color="primary"
                            startIcon={<ClearIcon />}>
                            Clear
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={openSettings}                                                       
                            variant="outlined"
                            color="secondary"
                            startIcon={<SettingsIcon />}>
                            Settings
                        </Button>
                    </Grid>
                </Grid>                
                <Grid container spacing={1} style={{marginTop:"1rem"}}>                    
                    <Grid item xs={12}>
                        <Input
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type something here.."
                            value={content} 
                            fullWidth={true}             
                            multiline={true}                     
                            minRows={6}  
                            maxRows={12} 
                            style={{                                
                                fontSize:"1rem",
                                //fontFamily: "monospace",
                                color: colors.grey[600],
                            }}
                        />
                    </Grid>                                        
                </Grid>
                <Grid container spacing={1} style={{marginTop:"1rem" }} 
                    sx={{
                        visibility: interactions == null || interactions.length <1 ? "hidden" : "visible",
                    }}
                    >
                    <Grid item xs={12} md={6} style={{borderRight: "0.1rem solid lightgrey", padding: "1rem"}}>
                        <Typography variant="h6">
                            Generated completions:
                        </Typography>
                        <List sx={{ width: '100%', cursor: "pointer" }}>
                            {interactions.reverse().map((i: Interation, index: number) => {
                                return (<React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar variant="rounded">
                                            <QuestionAnswerIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            onClick={() => setSelectedCompletion(i.response)}
                                            primary={i.query}
                                            secondary={
                                            <React.Fragment>
                                                <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                noWrap={true}
                                                >                                                
                                                </Typography>                
                                                {" — " + i.response.data.choices[0].text}
                                        </React.Fragment>}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                                )})}
                            
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6} style={{padding:"1rem"}}>
                        <Typography variant="h6">
                            {selectedCompletion == null ? "": selectedCompletion.data.choices[0].text}
                        </Typography>
                        <pre>{selectedCompletion == null ? "": JSON.stringify(selectedCompletion, null, 2)}</pre>
                    </Grid>
                </Grid>
                <Grid container spacing={1} style={{padding: "1rem"}}
                    sx={{
                        visibility: interactions == null || interactions.length <1 ? "visible" : "hidden",
                    }}
                >
                    <Typography variant="subtitle1">
                        No completions generated yet.                         
                        Type something and click "Process" to get started.
                    </Typography>
                </Grid>
                <Drawer    
                    anchor="right"
                    open={isSettingsOpen}
                    onClose={() => {
                        setIsSettingsOpen(false);
                    }}
                    sx={{
                        flexShrink: 0,
                    }}
                    PaperProps={{
                        sx: {
                            width:{
                                xs: "100%",
                                sm: "100%",
                                md: "100%",
                                lg: "50%",
                                xl: "50%",
                            },
                        }
                    }}
                    >
                    <Box sx={{ width: '100%', padding: "1rem" }}>
                        <Button 
                            onClick={() => {
                                setIsSettingsOpen(!isSettingsOpen);
                            }}                            
                            variant="outlined"
                            color="secondary"
                            startIcon={<ClearIcon />}                            
                            >
                            Close Settings
                        </Button>
                        <Typography variant="h6">
                            Open AI Settings to go here ...
                        </Typography>
                        <pre>{JSON.stringify(openAiInfo, null, 2)}</pre>
                    </Box>                    
                </Drawer>
            </Container>
        </Box>
    );
};

export default Complete;

