import React, { useState, useEffect } from 'react';
import TableCustom from "../../TableCustom.js";
import { eqfColumns } from '../../assets/json/tableColumn';
import { Card, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as psqStyles from "../../assets/css/psq.css"
import * as XLSX from 'xlsx';
import styled from 'styled-components';

import { eqfData } from "../../assets/json/saDataEx.js"

const Overlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정색
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10001, // 스피너가 위에 보이도록 설정
});

export default function Eqf() { //Emission Quantity Forecast
    const [caData, setCaData] = useState([]); // response
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // 로딩 시작

            let url = `/anal/prediction`;
            try {
                //const response = await axiosInstance.get(url);
                //setCaData(response.data);
                setCaData(eqfData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                await new Promise(resolve => setTimeout(resolve, 3000));//////////////////////////
                setIsLoading(false); // 로딩 완료
            }
        };

        fetchData();
    }, []);

    const onDownloadExcelClick = (csvData) => {
        const fileName = `배출량 예측`;

        // 워크북 및 워크시트 생성
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // 헤더 생성 (columns 순서대로)
        const headers = eqfColumns.map(eqfColumns => eqfColumns.label);
        wsData.push(headers);

        // 데이터 생성
        for (const row of csvData) {
            const values = eqfColumns.map(eqfColumns => row[eqfColumns.key]);
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
                        dataset={caData}
                        xAxis={[{ 
                            scaleType: 'band',
                            data: caData.map(item => `${item.year}-${item.mth}`),
                            colorMap: {
                                type: 'ordinal',
                                colors: ['#33104a', '#4b186c', '#63218f', '#8f3192', '#c0458a', '#e8608a', '#ef9198', '#f8c1a8'],
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
                        series={[{ dataKey: 'emission_qty' }]} //valueFormatter
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
                    <TableCustom columns={eqfColumns} title="목록" data={caData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(caData)]} />
                </Card>
            </div>

            {isLoading && 
                <Overlay >
                    <CircularProgress />
                </Overlay>
            }
        </div>
    );
}