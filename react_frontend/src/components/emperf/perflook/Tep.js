import React, { useState } from 'react';
import SearchForms from "../../../SearchForms";
import { formField_tep } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import { Card } from '@mui/material';
import * as mainStyle from '../../../assets/css/main.css';
import axiosInstance from '../../../utils/AxiosInstance';
import { perfTotalColumns } from '../../../assets/json/tableColumn';

export default function Tep() {
    const [formData, setFormData] = useState(); // 검색 데이터
    const [perfsData, setPerfsData] = useState([]);
    const [chartPerfs, setChartPerfs] = useState([]);

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
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_tep} autoSubmitOnInit={true} />

            {(!formData || Object.keys(formData).length === 0) ?
                <></> : (
                    <InnerTabs items={[
                        { label: '차트', key: '1', children: <ChartTab data={chartPerfs} />, },
                        { label: '표', key: '2', children: <TableTab data={perfsData} />, },
                    ]} />
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
            <TableCustom columns={perfTotalColumns} title="총량실적표" data={data} buttons={['DownloadExcel']} onClicks={[() => onDownloadExcelClick(data)]} />
        </Card>
    )
}