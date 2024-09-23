import React, { useState, useEffect } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ca } from "../../assets/json/searchFormData";
import TableCustom from "../../TableCustom.js";
import { climateAnalColumns } from '../../assets/json/tableColumn';
import { Card } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import axiosInstance from '../../utils/AxiosInstance';
import * as mainStyle from '../../assets/css/main.css';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as chartStyles from "../../assets/css/chart.css"
import * as saStyles from "../../assets/css/sa.css"
import * as psqStyles from "../../assets/css/psq.css"
import * as XLSX from 'xlsx';

import { tempData } from '../../assets/json/saDataEx';

export default function Ca() {
    const [formFields, setFormFields] = useState(formField_ca);
    const [formData, setFormData] = useState(); // 검색 데이터
    const [caData, setCaData] = useState([]); // response, 표 데이터
    const [chartData, setChartData] = useState([]); // 차트 데이터
    const [columns, setColumns] = useState(climateAnalColumns);

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

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        const startDate = `${data.calendar[0].$y}-${(data.calendar[0].$M + 1).toString().padStart(2, '0')}`;
        const endDate = `${data.calendar[1].$y}-${(data.calendar[1].$M + 1).toString().padStart(2, '0')}`;

        /*let url = `/anal/climate?startDate=${startDate}&endDate=${endDate}&regCode=${data.regCode}&selected=${data.selected}`;
        const response = await axiosInstance.get(url);
console.log(response.data);
        setCaData(response.data);*/
        setCaData(tempData);

        // 차트 데이터 설정
        setChartData( {
            xAxis: tempData.map(item => item.mth), // 월 데이터,
            series: [
                {
                    yAxisIndex: 0,
                    data: tempData.map(item => item.co2EmtnConvTotalQty), // 총배출량 데이터
                    name: '총배출량',
                    connectNulls: true,
                },
                {
                    yAxisIndex: 1,
                    data: tempData.map(item => item.avgTm), // 평균 기온 데이터
                    name: '평균 기온',
                    connectNulls: true,
                }
                
            ]
        });

        // columns 설정
        const updatedColumns = climateAnalColumns.map((col) => {
            if (col.label === '영향인자값') {
                return {
                    ...col,
                    label: data.selected, // selected 값으로 label 변경
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

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formFields} />

            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
            ) : (
                <>
                    <div className={saStyles.main_grid}>
                        <Card className={saStyles.card_box} sx={{ width: "100%", height: "auto", borderRadius: "15px" }}>
                            <div className={chartStyles.chart_title}>{"총배출량"}</div>
                            <div className={chartStyles.chart_title}>{"평균기온"}</div>
                            <LineChart
                                xAxis={[{ data: chartData.xAxis }]}
                                yAxis={[
                                    { type: 'value', position: 'left', name: '총배출량 (톤)' },
                                    { type: 'value', position: 'right', name: '평균 기온 (℃)' }
                                ]}
                                series={chartData.series}
                                //width={500}
                                height={200}
                                margin={{ top: 10, bottom: 100 }}
                            />
                        </Card>
                    </div>

                    <div className={saStyles.main_grid}>
                        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                            <TableCustom columns={columns} title="목록" data={caData} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(caData)]} />
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}