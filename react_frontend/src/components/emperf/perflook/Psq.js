import React, { useState } from 'react';
import SearchForms from "../../../SearchForms";
import { formField_psq } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import { tepData, chartData } from "../../../assets/json/tep";
import { func } from 'prop-types';

export default function Psq() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <p>배출실적 &gt; 실적조회 &gt; 프로젝트별 조회</p>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_psq} />
            <InnerTabs items={[
                { label: '차트', key: '1', children: <ChartTab formData={formData} chartData={chartData} />, },
                { label: '표', key: '2', children: <TableTab formData={formData} psqData={tepData} />, },
            ]} />
        </div>
    );
}

function ChartTab({ formData, chartData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    return (
        <div>
            <ChartCustom title="프로젝트 실적 차트" data={chartData} />
        </div>
    )
}

function TableTab({ formData, psqData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    const tableData = psqData.filter(data => data.actvYear === Number(formData.actvYear));

    const onDownloadExcelClick = () => {
        console.log("onDownloadExcelClick");
    };

    return (
        <div>
            <TableCustom title="프로젝트 실적 표" data={tableData} buttons={['DownloadExcel']} onClicks={[onDownloadExcelClick]} />
        </div>
    )
}