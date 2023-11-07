import * as React from 'react';
import { useFormField } from './index';
import Chip from '@mui/material/Chip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/styles';

export const InputFiles: React.FC<any> = ({ fieldKey, initialValue }) => {
    const [{ value }, setValue] = useFormField({
        key: fieldKey,
        initialValue,
    });

    const { getRootProps, getInputProps, open } = useDropzone({
        onDropAccepted: setValue,
        noClick: true,
        noKeyboard: true,
    });
    return (
        <Box
            {...getRootProps()}
            sx={{
                borderLeft: '0px',
                borderRight: '0px',
                border: '1px solid',
                borderRadius: 1,
                borderColor: 'rgba(0, 0, 0, 0.23)',
                paddingTop: '24px',
                paddingBottom: '24px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <input {...getInputProps()} />
                <CloudUploadIcon fontSize="large" color={'primary'} />
                <Typography gutterBottom>
                    Drag and drop some files here, or click to select files
                </Typography>
                <Button variant="contained" onClick={open} color="primary">
                    Upload
                </Button>
            </Box>
            <FileLists files={value} setValue={setValue} />
        </Box>
    );
};

const ListItem = styled('li')(() => {
    return {
        margin: '5px',
        padding: '5px',
    };
});

const FileItem: React.FC<any> = ({ file, index, onDelete }) => {
    const onDeleteItem = React.useCallback(() => {
        onDelete(index);
    }, [onDelete, index]);
    return (
        <ListItem>
            <Chip
                component="div"
                label={file.name}
                icon={<PublishIcon />}
                variant="outlined"
                onDelete={onDelete ? onDeleteItem : undefined}
            />
        </ListItem>
    );
};

export const FileLists: React.FC<any> = ({ files = [], setValue }) => {
    const onDelete = React.useCallback(
        (index) => {
            const newValue = [...files];
            newValue.splice(index, 1);
            setValue(newValue);
        },
        [setValue, files],
    );

    const filesItem = (files as any[]).map((file, index) => (
        <FileItem
            key={index}
            file={file}
            index={index}
            onDelete={setValue ? onDelete : undefined}
        />
    ));
    return (
        <Box
            component="ul"
            sx={
                {
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                } as any
            }
        >
            {filesItem}
        </Box>
    );
};
/*

        
*/
