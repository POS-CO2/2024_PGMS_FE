import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { clAnaSearchForm } from '../../atoms/searchFormAtoms';
import SearchForms from "../../SearchForms";
import { formField_ca } from "../../assets/json/searchFormData";
import TableCustom from "../../TableCustom.js";
import { climateAnalColumns } from '../../assets/json/tableColumn';
import { Card } from '@mui/material';
import ApexChart from "react-apexcharts";
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as psqStyles from "../../assets/css/psq.css"
import * as XLSX from 'xlsx';

export default function Ca() {
    const [formFields, setFormFields] = useState(formField_ca);
    const [formData, setFormData] = useRecoilState(clAnaSearchForm); // 검색 데이터
    const [caData, setCaData] = useState([]); // response, 표 데이터
    const [chartData, setChartData] = useState({ xAxis: [], series: [], yaxis: [] }); // 차트 데이터
    const [columns, setColumns] = useState(climateAnalColumns);
    const [selectKey, setSelectKey] = useState({});

    useEffect(() => {
        // formData값이 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        if(Object.keys(formData).length !== 0) {
            handleFormSubmit(formData);
        }
    }, []);

    // 지역 드롭다운 옵션 설정
    useEffect(() => {
        const fetchRegCode = async () => {
            try {
                const res = await axiosInstance.get(`/sys/unit?unitType=지역코드`);
                const options = res.data.map(reg => ({
                    value: reg.code,
                    label: reg.name,
                }));
                const updateFormFields = formFields.map(field =>
                    field.name === 'regCode' ? { ...field, options } : field
                );

                setFormFields(updateFormFields);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRegCode();
    }, []);

    // 영향인자 값에 따른 key 설정
    const getSelectDataKey = (selected) => {
        switch (selected) {
            case '평균기온':
                return { key: 'avgTm', unit: '°C' };
            case '평균강수량':
                return { key: 'avgRn', unit: 'mm' };
            case '평균습도':
                return { key: 'avgRhm', unit: '%' };
            default:
                console.log("영향인자가 선택되지 않았습니다.");
                return null;
        }
    };

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        const startDate = `${data.calendar[0].$y}-${(data.calendar[0].$M + 1).toString().padStart(2, '0')}`;
        const endDate = `${data.calendar[1].$y}-${(data.calendar[1].$M + 1).toString().padStart(2, '0')}`;

        let url = `/anal/climate?startDate=${startDate}&endDate=${endDate}&regCode=${data.regCode}&selected=${data.selected}`;
        const response = await axiosInstance.get(url);
        setCaData(response.data);

        // 영향인자 값에 따른 key 가져오기
        const selectKey = getSelectDataKey(data.selected);
        setSelectKey(getSelectDataKey(data.selected));

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
                        data: response.data.map(item => item[selectKey.key]), // 영향인자 데이터
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
                            text: `${data.selected}(${selectKey.unit})`,
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
                    label: `${data.selected}(${selectKey.unit})`, // selected 값으로 label 변경
                    key: col.key.includes('formatted') ? `formatted${selectKey.key.charAt(0).toUpperCase()}${selectKey.key.slice(1)}` : selectKey.key, // key 변경
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
                {"분석및예측 > 기후별 분석"}
            </div>

            <SearchForms initialValues={formData} onFormSubmit={handleFormSubmit} formFields={formFields} />

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
                                    },
                                    tooltip: {
                                        shared: true,  // 여러 시리즈의 값을 함께 표시
                                        intersect: false, // hover 시 모든 데이터 포인트를 보여줌
                                        y: {
                                            formatter: (value, { seriesIndex }) => {
                                                if (value === null) {
                                                    return null;
                                                }
                                                const unit = seriesIndex === 0 ? 'kgGHG' : selectKey.unit; // 첫 번째 시리즈에 대한 단위 설정
                                                return `${value} ${unit}`; // 각 시리즈의 값에 맞는 단위 추가
                                            },
                                        },
                                    },
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