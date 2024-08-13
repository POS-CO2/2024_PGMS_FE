import * as React from 'react';
import { BarChart, LineChart, ChartContainer, LinePlot, MarkPlot, lineElementClasses, markElementClasses } from '@mui/x-charts';
import { colors } from '@mui/material';

export function CustomBarChart({ data }){

    return(
        <div style={{width:"100%", height:"100%"}}>
            <BarChart
                borderRadius={10}
                series={data}
                barLabel={(item, context) => {
                    return context.bar.height < 60 ? null : item.value?.toString();
                }}
                xAxis={[
                    {
                        scaleType: 'band',
                        data: ['Jan', 'Feb', 'Mar', "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        id: 'months',
                    }, 
                ]}
                leftAxis={null}
                colors={['#45Bb89', '#91d4c1']}
                sx={{
                    //change left yAxis label styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                        strokeWidth:"0.4",
                        fill:"white",
                        fontWeight:"bold",
                    },
                // change all labels fontFamily shown on both xAxis and yAxis
                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel":{
                        fill:"white",
                    },
                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":{
                        stroke:"white",
                    },
                    // change bottom label styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                        strokeWidth:"0.5",
                        fill:"white",
                        fontWeight:"bold",
                    },
                    // bottomAxis Line Styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line ":{
                        stroke:"white",
                        strokeWidth:0.4,
                    },
                    // leftAxis Line Styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                        stroke:"white",
                        strokeWidth:0.4
                    },
                }}
                slotProps={{
                    legend: {
                        labelStyle: {
                            fill: 'white',
                        },
                    },
                }}
            />
        </div>
    );
}


export function CustomLineChart(){
    const xLabels = ['Jan', 'Feb', 'Mar', "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return (
        <div style={{width:"100%", height:"100%"}}>
            <LineChart
                series={
                    [{label: 'line', data: [21, 18, 17, 23, 19, 24, 31, 11, 9, 0,0,0]},
                , {label: 'square', data: [40, 24, 52, 41, 17, 34, 23, 42, 23, 0,0,0]}
            ]}
                xAxis={[{ scaleType: "point", data: xLabels }]}
                sx={{
                    [`& .${lineElementClasses.root}`]: {
                        stroke: '#8884d8',
                        strokeWidth: 2,
                    },
                    [`& .${markElementClasses.root}`]: {
                        stroke: '#8884d8',
                        scale: '0.6',
                        fill: '#fff',
                        strokeWidth: 2,
                    },
                    
                    //change left yAxis label styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                        strokeWidth:"0.4",
                        fill:"white",
                        fontWeight:"bold",
                    },
                // change all labels fontFamily shown on both xAxis and yAxis
                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel":{
                        fill:"white",
                    },
                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":{
                        stroke:"white",
                    },
                    // change bottom label styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                        strokeWidth:"0.5",
                        fill:"white",
                        fontWeight:"bold",
                    },
                    // bottomAxis Line Styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line ":{
                        stroke:"white",
                        strokeWidth:0.4,
                    },
                    // leftAxis Line Styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                        stroke:"white",
                        strokeWidth:0.4
                    },
                    
                }}
                disableAxisListener
            >
                <LinePlot />
                <MarkPlot />

            </LineChart>
        </div>
    )
}