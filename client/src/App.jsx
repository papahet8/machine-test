import React from 'react';
import { Container, Typography, Box, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Product Analytics Dashboard
                    </Typography>
                    <Dashboard />
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default App;
