import { LinearProgress } from '@mui/material';
import React from 'react';

function CustomProgress(progress) {
    return (
        <div style={{width:"5%"}}>
            <LinearProgress variant="determinate" value={progress} />
        </div>
    );
}

export default CustomProgress;