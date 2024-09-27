import React, { useState, useEffect } from 'react';
import TableCustom from "../../TableCustom.js";
import { salesAnalColumns } from '../../assets/json/tableColumn';
import { Card } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as psqStyles from "../../assets/css/psq.css"
import * as XLSX from 'xlsx';

import { saData, avgUnitPerDivData } from "../../assets/json/saDataEx.js"

export default function Eqf() { //Emission Quantity Forecast
    const [formData, setFormData] = useState(); // 검색 데이터
    const [caData, setCaData] = useState(saData); // response, 표 데이터
    const [chartData, setChartData] = useState(avgUnitPerDivData); // 차트 데이터

    const onDownloadExcelClick = (csvData) => {
        const fileName = `배출량 예측`;

        // 워크북 및 워크시트 생성
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // 헤더 생성 (columns 순서대로)
        const headers = salesAnalColumns.map(salesAnalColumns => salesAnalColumns.label);
        wsData.push(headers);

        // 데이터 생성
        for (const row of csvData) {
            const values = salesAnalColumns.map(salesAnalColumns => row[salesAnalColumns.key]);
            wsData.push(values);
        }

        // 워크시트에 데이터 추가
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // 파일 다운로드
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"분석및예측 > 배출량 예측"}
            </div>

            <div className={saStyles.main_grid}>
                <Card className={saStyles.card_box} sx={{ width: "100%", height: "auto", borderRadius: "15px" }}>
                    <div className={chartStyles.chart_title}>{"예측 차트"}</div>
                    <BarChart
                        dataset={chartData}
                        xAxis={[{ 
                            scaleType: 'band',
                            data: chartData.map(item => item.divCode),
                            colorMap: {
                                type: 'ordinal',
                                colors: ['#37114e', '#511b75', '#6f2597', '#a73b8f', '#e05286', '#ed8495', '#f7bba6'],
                            }
                        }]}
                        yAxis={[{
                            position: 'left',
                            tickLabelStyle: {
                                whiteSpace: 'nowrap',  // 라벨이 잘리지 않도록 설정
                                overflow: 'visible',  // 오버플로우 방지
                                textOverflow: 'ellipsis',
                            },
                        }]}
                        series={[{ dataKey: 'avgEmissionQtyPerSales' }]} //valueFormatter
                        height={300}
                        borderRadius={10}
                        margin={{ left: 80 }} // 왼쪽 여백 추가
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
                </Card>
            </div>

            <div className={saStyles.main_grid}>
                <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                    <TableCustom columns={salesAnalColumns} title="목록" data={caData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(caData)]} />
                </Card>
            </div>
        </div>
    );
}