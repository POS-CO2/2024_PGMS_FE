import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { revAnaSearchForm } from '../../atoms/searchFormAtoms';
import SearchForms from "../../SearchForms";
import { formField_sa } from "../../assets/json/searchFormData";
import TableCustom from "../../TableCustom.js";
import { salesAnalColumns } from '../../assets/json/tableColumn';
import { Card } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as XLSX from 'xlsx';

export default function Eqf() { //Emission Quantity Forecast
    const [formFields, setFormFields] = useState(formField_ca);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [caData, setCaData] = useState([]); // response, 표 데이터
    const [chartData, setChartData] = useState({ xAxis: [], series: [], yaxis: [] }); // 차트 데이터

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        const startDate = `${data.calendar[0].$y}-${(data.calendar[0].$M + 1).toString().padStart(2, '0')}`;
        const endDate = `${data.calendar[1].$y}-${(data.calendar[1].$M + 1).toString().padStart(2, '0')}`;

        let url = `/anal/climate?startDate=${startDate}&endDate=${endDate}&regCode=${data.regCode}&selected=${data.selected}`;
console.log(url);
        const response = await axiosInstance.get(url);
        setCaData(response.data);
console.log(response.data);
        // 영향인자 값에 따른 key 가져오기
        const selectKey = getSelectDataKey(data.selected);

        // 차트 데이터 설정
        if (response.data.length > 0) {
            setChartData({
                xAxis: response.data.map(item => `${item.year}-${String(item.mth).padStart(2, '0')}`), // 년-월 데이터
                series: [
                    {
                        name: "총배출량",
                        data: response.data.map(item => item.co2EmtnConvTotalQty), // 총배출량 데이터
                        //connectNulls: true,
                    },
                    {
                        name: data.selected,
                        data: response.data.map(item => item[selectKey]), // 영향인자 데이터
                        //connectNulls: true,
                    }
                    
                ],
                yaxis: [
                    {
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true,
                        },
                        labels: {
                            formatter: (value) => Math.round(value), // 정수로 변환
                            style: {
                                fontSize: '13px'
                            }
                        },
                        title: {
                            text: "총CO2배출량(kgGHG)",
                            style: {
                                fontSize: '13px',
                                fontWeight: 'normal'
                            },
                            offsetX: -10 // 제목을 왼쪽으로 이동하여 간격 조정
                        }
                    },
                    {
                        opposite: true,
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true,
                        },
                        labels: {
                            formatter: (value) => Math.round(value), // 정수로 변환
                            style: {
                                fontSize: '13px'
                            }
                        },
                        title: {
                            text: data.selected,
                            style: {
                                fontSize: '13px',
                                fontWeight: 'normal'
                            }
                        }
                    }
                ]
            });
        } else {
            setChartData({
                xAxis: [],
                series: [],
                yaxis: []
            });
        }

        // columns 설정
        const updatedColumns = climateAnalColumns.map((col) => {
            if (col.label === '영향인자값') {
                return {
                    ...col,
                    label: data.selected, // selected 값으로 label 변경
                    key: col.key.includes('formatted') ? `formatted${selectKey.charAt(0).toUpperCase()}${selectKey.slice(1)}` : selectKey, // key 변경
                };
            }
            return col;
        });
        setColumns(updatedColumns);
    };

    const onDownloadExcelClick = (csvData) => {
        const fileName = `기후영향인자분석_${formData.regCode}_${formData.selected}`;

        // 워크북 및 워크시트 생성
        const wb = XLSX.utils.book_new();
        const wsData = [];

        // 헤더 생성 (columns 순서대로)
        const headers = columns.map(column => column.label);
        wsData.push(headers);

        // 데이터 생성
        for (const row of csvData) {
            const values = columns.map(column => row[column.key]);
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

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />

            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
            ) : (
                <>
                    <div className={saStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "100%", height: "auto", borderRadius: "15px" }}>
                            <div className={chartStyles.chart_title}>{`${formData.selected}과(와) 배출량 추이`}</div>
                            <ApexChart
                                type="line"
                                series={chartData.series.length > 0 ? chartData.series : []}
                                options={{
                                    chart: {
                                        height: 300,
                                        type: "line",
                                        stacked: false,
                                        fontFamily: `SUITE-Regular`,
                                        fontSize: '0.75em'
                                    },
                                    dataLabels: {
                                        enabled: false
                                    },
                                    colors: ["#7c4dff", "#ef6c00"],
                                    stroke: {
                                        width: [4, 4]
                                    },
                                    xaxis: {
                                        categories: chartData.xAxis.length > 0 ? chartData.xAxis : [],
                                    },
                                    yaxis: chartData.yaxis,
                                    legend: {
                                        fontSize: '14px'
                                    }
                                }}
                                height={300}
                            />
                        </Card>
                    </div>

                    <div className={saStyles.main_grid}>
                        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                            <TableCustom columns={columns} title={`${formData.selected}과(와) 배출량 상세`} data={caData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(caData)]} monthPagination={true} />
                        </Card>
                    </div>
                </>
            )}

        </div>
    );
}