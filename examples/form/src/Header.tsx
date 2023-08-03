import React from 'react';

import Typography from '@mui/material/Typography/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';

export const Header = ({ text }: any) => {
    return (
        <Card style={{ padding: '20px' }}>
            <Typography component="h1" variant="h5">
                {text}
            </Typography>
            <CardActionArea
                href={'https://www.npmjs.com/package/' + text}
                //sx={{ width: 80, height: 20 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        columnGap: 1,
                        padding: 2,
                    }}
                >
                    <CardMedia
                        sx={{ width: 80, height: 20 }}
                        component="img"
                        alt="npm"
                        src={'https://img.shields.io/npm/v/' + text + '.svg'}
                    />
                    <CardMedia
                        sx={{ width: 140, height: 20 }}
                        component="img"
                        alt="npm download"
                        src={'https://img.shields.io/npm/dm/' + text + '.svg'}
                    />
                    <CardMedia
                        sx={{ width: 144, height: 20 }}
                        component="img"
                        alt="npm bundle size"
                        src={'https://shields.api-test.nl/bundlephobia/minzip/' + text}
                    />
                </Box>
            </CardActionArea>
        </Card>
    );
};
