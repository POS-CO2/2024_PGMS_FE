import React from 'react';
import { BarChart, LineChart } from '@mui/x-charts';
import * as chartStyles from "./assets/css/chart.css"
//search by pjt
export default function ChartCustom({ title, data }) {
    const validatedData = Array.isArray(data) ? data : [];
    const lineChartData = validatedData.filter(item => item.type === 'line'); // 필터링하여 꺾은선 그래프 데이터를 추출

    return (
        <>
            <div className={chartStyles.chart_title}>{title}</div>

            <div style={{ width: "100%", height: "30rem", position: "relative" }}>
                <BarChart
                    borderRadius={10}
                    series={validatedData}
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
                    margin={{ left: 120 }}
                    colors={['rgb(53, 98, 227)', 'rgb(196, 218, 250)', 'rgb(255, 99, 132)']}
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

                {/* Line Chart (있는 경우에만 렌더링) */}
                {lineChartData.length > 0 && (
                    <LineChart
                        series={validatedData.filter(item => item.type === 'line')}
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: ['1월', '2월', '3월', "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
                                id: 'months',
                            },
                        ]}
                        colors={['rgb(255, 99, 132)']} // Line color
                        margin={{ left: 120 }}
                        sx={{
                            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                strokeWidth: "0.4",
                                fontWeight: "bold",
                            },
                            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                strokeWidth: "0.5",
                                fontWeight: "bold",
                            },
                        }}
                        slotProps={{
                            legend: {
                                labelStyle: {
                                    fill: 'black',
                                },
                            },
                        }}
                        style={{ position: "absolute", top: 0, left: 0 }}
                    />
                )}
            </div>
        </>
    );
}