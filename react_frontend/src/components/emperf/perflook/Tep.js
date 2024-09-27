import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { totalPerfScpForm } from '../../../atoms/searchFormAtoms';
import { tepSelectedBtnState } from '../../../atoms/buttonAtoms';
import SearchForms from "../../../SearchForms";
import { formField_tep } from "../../../assets/json/searchFormData"
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import { CustomButton } from '../Ps_1_2';
import * as mainStyle from '../../../assets/css/main.css';
import * as ps12Style from '../../../assets/css/ps12.css';
import * as sysStyles from '../../../assets/css/sysmng.css';
import { Card } from '@mui/material';
import axiosInstance from '../../../utils/AxiosInstance';
import { perfTotalColumns } from '../../../assets/json/tableColumn';

export default function Tep() {
    const [formData, setFormData] = useRecoilState(totalPerfScpForm);
    const [perfsData, setPerfsData] = useState([]);
    const [chartPerfs, setChartPerfs] = useState([]);
    const [content, setContent] = useRecoilState(tepSelectedBtnState);

    useEffect(() => {
        if(Object.keys(formData).length !== 0) {
            handleFormSubmit(formData);
        }
        else {
            handleFormSubmit({year: new Date().getFullYear()})
        }
        handleButtonClick(content);
    }, []);

    const handleButtonClick = (value) => {
        setContent(value);
    };

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setFormData(data);

        let url = `/perf/total?year=${data.year}`;
        const response = await axiosInstance.get(url);
        setPerfsData(response.data);

        // data가 빈 배열인지 확인
        if (response.data.length === 0) {
            // 빈 데이터인 경우, 배열의 필드를 유지하면서 빈 값으로 채운 배열 생성
            setChartPerfs([
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 1' },
                { data: Array(12).fill(null), stack: 'A', label: 'Scope 2' }
            ]);

        } else {
            //차트
            const scope1Data = response.data.map(perf => perf.scope1 || null);
            const scope2Data = response.data.map(perf => perf.scope2 || null);
            const formattedChartPerfs = [
                { data: scope1Data, stack: 'A', label: 'Scope 1' },
                { data: scope2Data, stack: 'A', label: 'Scope 2' }
            ];
            setChartPerfs(formattedChartPerfs);
        }
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"배출실적 > 실적조회 > 총량실적 조회"}
            </div>
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formField_tep} 
            />

            {(!formData || Object.keys(formData).length === 0) ? (
                <></>
            ) : (
                <>
                    <div className={ps12Style.button_container}>
                        <CustomButton 
                            selected={content === 'chart'} 
                            onClick={() => handleButtonClick('chart')}
                        >
                            차트
                        </CustomButton>
                        <CustomButton 
                            selected={content === 'table'} 
                            onClick={() => handleButtonClick('table')}
                        >
                            표
                        </CustomButton>
                    </div>
                    <div className={sysStyles.main_grid}>
                        {content === 'chart' && <ChartTab data={chartPerfs} />}
                        {content === 'table' && <TableTab data={perfsData} />}
                    </div>
                </>
            )}
        </div>
    );
}

function ChartTab({ data }) {
    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <ChartCustom title={"총량실적차트"} data={data} />
        </Card>
    )
}

function TableTab({ data }) {
    const onDownloadExcelClick = (csvData) => {
        const year = csvData[0].actvYear;
        const fileName = `총량실적_${year}`;

        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성
        const headers = Object.keys(csvData[0]);
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        // CSV 파일 생성
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <TableCustom columns={perfTotalColumns} title="총량실적표" data={data} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(data)]} monthPagination={true} pagination={false} />
        </Card>
    )
}