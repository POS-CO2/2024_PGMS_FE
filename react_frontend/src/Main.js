import React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { CustomBarChart } from './Chart';
import { temp_data } from './assets/json/chartData';
import * as gridStyles from './assets/css/grid.css'
// Generate Sales Data
function createData(time, amount) {
    return { time, amount: amount ?? null };
}
    
const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00'),
];

export default function Main() {
    const theme = useTheme();

    return (
            <div className={gridStyles.grid_container}>
                <div className={gridStyles.box1}>box1</div>
                <div className={gridStyles.box2}>box2</div>
                <div className={gridStyles.box3}>box3</div>
                <div className={gridStyles.box4}>box4</div>
                <div className={gridStyles.box5}>box5</div>
                <div className={gridStyles.box6}>box6</div>
            </div>
    );
}