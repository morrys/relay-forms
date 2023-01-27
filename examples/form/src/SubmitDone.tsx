import * as React from 'react';
import { useFormSetValue } from './index';
import { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import { SubmitValue } from './Form';
import { FileLists } from './InputFiles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ManIcon from '@material-ui/icons/Mood';
import FemaleIcon from '@material-ui/icons/Face';

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
