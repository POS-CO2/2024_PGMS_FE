import React from 'react';
import { BarChart } from '@mui/x-charts';
import * as chartStyles from "./assets/css/chart.css"

export default function ChartCustom({ title, data }) {
    return (
        <>
            <div className={chartStyles.chart_title}>{title}</div>

            <div style={{ width: "100%", height: "30rem" }}>
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
                        //change left yAxis label styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.4",
                            fill: "white",
                            fontWeight: "bold",
                        },
                        // change all labels fontFamily shown on both xAxis and yAxis
                        "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
                            fill: "white",
                        },
                        "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick": {
                            stroke: "white",
                        },
                        // change bottom label styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.5",
                            fill: "white",
                            fontWeight: "bold",
                        },
                        // bottomAxis Line Styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line ": {
                            stroke: "white",
                            strokeWidth: 0.4,
                        },
                        // leftAxis Line Styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                            stroke: "white",
                            strokeWidth: 0.4
                        },
                    }}
                    slotProps={{
                        legend: {
                            labelStyle: {
                                fill: 'black',
                            },
                        },
                    }}
                />
            </div>
        </>
    );
}