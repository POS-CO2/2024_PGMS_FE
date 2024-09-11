import * as React from 'react';
import { BarChart, LineChart, ChartContainer, LinePlot, MarkPlot, lineElementClasses, markElementClasses } from '@mui/x-charts';
import { colors } from '@mui/material';
import { HideImage } from '@mui/icons-material';

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
                colors={['rgb(53, 98, 227)', 'rgb(196, 218, 250)']}
                sx={{
                    fontFamily:"SUITE-Regular",
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
                        fontFamily:"SUITE-Regular"
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
    const xLabels = ['1월', '2월', '3월', "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

    return (
        <div style={{width:"100%", height:"90%"}}>
            <LineChart
                series={
                    [{label: 'scope2', color:"white", data: [21, 18, 17, 23, 19, 24, 31, 11, 9, 9,9,9]},
                , {label: 'scope1', color:"rgb(111, 182, 242)", data: [40, 24, 52, 41, 17, 34, 23, 42, 23, 23,23,23]}
            ]}
                xAxis={[{ scaleType: "point", data: xLabels, }]}
                sx={{
                    // [`& .${lineElementClasses.root}`]: {
                    //     stroke: '#8884d8',
                    //     strokeWidth: 2,
                    // },
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
                        display: 'none',
                    },
                // change all labels fontFamily shown on both xAxis and yAxis
                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel":{
                        fill:"white",
                        display: 'none',
                    },
                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":{
                        stroke:"white",
                        display: 'none',
                    },
                    // change bottom label styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                        strokeWidth:"0.5",
                        fill:"white",
                        fontWeight:"bold",
                        display: 'none',
                    },
                    // bottomAxis Line Styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line ":{
                        stroke:"white",
                        strokeWidth:0.4,
                        display: 'none',
                    },
                    // leftAxis Line Styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                        stroke:"white",
                        strokeWidth:0.4,
                        display: 'none',
                    },
                    "& .MuiChartsLegend-series":{
                        display: 'none'
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