import React, { useState, useEffect } from 'react';
import TableCustom from "../../TableCustom.js";
import { eqfColumns } from '../../assets/json/tableColumn';
import { Card, CircularProgress } from '@mui/material';
import ApexCharts from "react-apexcharts";
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

            {isLoading || !caData ? (
                <Overlay >
                    <CircularProgress />
                </Overlay>
            ) : (
                <>
                    <div className={saStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "100%", height: "auto", borderRadius: "15px" }}>
                            <div className={chartStyles.chart_title}>{"예측 차트"}</div>

                            <ApexCharts
                                height={300}
                                series={[
                                    {
                                        name: '배출량',
                                        data: caData.map(data => data.emission_qty),
                                    }
                                ]}
                                options={{
                                    chart: {
                                        type: "line",
                                        stacked: false,
                                        fontFamily: `SUITE-Regular`,
                                        fontSize: '0.75em'
                                    },
                                    dataLabels: {
                                        enabled: false
                                    },
                                    forecastDataPoints: { count: 4 },
                                    stroke: { width: [5, 5] },
                                    xaxis: { categories: caData.map(data => `${data.year}-${String(data.mth).padStart(2, '0')}`) },
                                    yaxis: [
                                        {
                                            labels: {
                                                formatter: (value) => Math.round(value), // 정수로 변환
                                                style: {
                                                    fontSize: '13px'
                                                }
                                            },
                                            title: {
                                                text: "배출량(kgGHG)",
                                                style: {
                                                    fontSize: '13px',
                                                    fontWeight: 'normal'
                                                },
                                            }
                                        }
                                    ],
                                    legend: { fontSize: '14px' },
                                    fill: {
                                        type: 'gradient',
                                        gradient: {
                                            shade: 'dark',
                                            gradientToColors: [ '#FDD835'],
                                            shadeIntensity: 1,
                                            type: 'horizontal',
                                            opacityFrom: 1,
                                            opacityTo: 1,
                                            stops: [0, 100, 100, 100]
                                        },
                                    },
                                    tooltip: {
                                        shared: true,  // 여러 시리즈의 값을 함께 표시
                                        intersect: false, // hover 시 모든 데이터 포인트를 보여줌
                                        y: {
                                            formatter: (value) => {
                                                if (value === null) {
                                                    return null;
                                                }
                                                return `${value} kgGHG`; // 각 시리즈의 값에 맞는 단위 추가
                                            },
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
                </>
            )}
        </div>
    );
}