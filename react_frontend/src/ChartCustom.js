import React from 'react';
import { BarChart } from '@mui/x-charts';
import * as chartStyles from "./assets/css/chart.css"
//search by pjt
export default function ChartCustom({ title, data }) {
    const validatedData = Array.isArray(data) ? data : [];

    return (
        <>
            <div className={chartStyles.chart_title}>{title}</div>

            <div style={{ width: "100%", height: "30rem" }}>
                <BarChart
                    borderRadius={10}
                    series={validatedData }
                    barLabel={(item, context) => {
                        return context.bar.height < 60 ? null : item.value?.toFixed(2).toString();
                    }}
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: ['1월', '2월', '3월', "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
                            id: 'months',
                        },
                    ]}
                    leftAxis={null}
                    colors={['rgb(53, 98, 227)', 'rgb(196, 218, 250)']}
                    sx={{
                        //change left yAxis label styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.4",
                            fontWeight: "bold",
                        },
                        // change bottom label styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                            strokeWidth: "0.5",
                            fontWeight: "bold",
                        },
                        // bottomAxis Line Styles
                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line ": {
                            strokeWidth: 0.4,
                        },
                        // leftAxis Line Styles
                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
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