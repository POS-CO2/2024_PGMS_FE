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
                <React.Fragment>
                    <div style={{ width: '400px', height: '300px', flexGrow: 1, overflow: 'hidden'}}>
                        <LineChart
                        dataset={data}
                        margin={{
                            top: 16,
                            right: 20,
                            left: 70,
                            bottom: 30,
                        }}
                        xAxis={[
                            {
                            scaleType: 'point',
                            dataKey: 'time',
                            tickNumber: 2,
                            tickLabelStyle: theme.typography.body2,
                            },
                        ]}
                        yAxis={[
                            {
                            label: 'Sales ($)',
                            labelStyle: {
                                ...theme.typography.body1,
                                fill: theme.palette.text.primary,
                            },
                            tickLabelStyle: theme.typography.body2,
                            max: 2500,
                            tickNumber: 3,
                            },
                        ]}
                        series={[
                            {
                            dataKey: 'amount',
                            showMark: false,
                            color: theme.palette.primary.light,
                            },
                        ]}
                        sx={{
                            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                            [`& .${axisClasses.left} .${axisClasses.label}`]: {
                            transform: 'translateX(-25px)',
                            },
                        }}
                        />
                    </div>
                </React.Fragment>
                <CustomBarChart data={temp_data}/>
            </div>
    );
}