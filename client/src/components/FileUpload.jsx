import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, clearUploadMessage } from '../features/productsSlice';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { uploadLoading, uploadMessage, uploadError } = useSelector((state) => state.products);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = [
                'text/csv',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];
            const validExtensions = ['.csv', '.xlsx', '.xls'];
            const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

            if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(ext)) {
                dispatch(clearUploadMessage());
                return;
            }
            setFile(selectedFile);
            dispatch(clearUploadMessage());
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const result = await dispatch(uploadFile(file));
        if (uploadFile.fulfilled.match(result)) {
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('raised-button-file');
            if (fileInput) fileInput.value = '';
            if (onUploadSuccess) onUploadSuccess();
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Upload Product Data (CSV/Excel)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <input
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                        Select File
                    </Button>
                </label>
                {file && <Typography variant="body2">{file.name}</Typography>}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!file || uploadLoading}
                >
                    {uploadLoading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>

                {uploadMessage && <Alert severity="success">{uploadMessage}</Alert>}
                {uploadError && <Alert severity="error">{uploadError}</Alert>}
            </Box>
        </Paper>
    );
};

export default FileUpload;
