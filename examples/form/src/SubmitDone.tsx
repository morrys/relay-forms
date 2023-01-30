import * as React from 'react';
import { SubmitValue } from './Form';
import { FileLists } from './InputFiles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ManIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

export const SubmitDone: React.FC<SubmitValue> = (props) => {
    const { uploadables, firstName, lastName, gender, state, birthday } = props;

    return (
        <>
            <Card
                variant="outlined"
                style={{
                    minWidth: '700px',
                    minHeight: '400px',
                    paddingTop: '15px',
                    marginTop: '8px',
                }}
            >
                <CardContent>
                    {gender === 'M' ? <ManIcon /> : <FemaleIcon />}
                    <Typography variant="h5" component="h2">
                        {firstName} {lastName}
                    </Typography>
                    <Typography color="textSecondary">was born on</Typography>
                    <Typography variant="h5" component="h2">
                        {birthday.toLocaleString('en-GB').split(',')[0]}
                    </Typography>
                    <Typography color="textSecondary">in</Typography>
                    <Typography variant="h5" component="h2">
                        {state}
                    </Typography>
                    <Typography color="textSecondary">Attached files:</Typography>
                    <FileLists files={uploadables} />
                </CardContent>
            </Card>
        </>
    );
};
