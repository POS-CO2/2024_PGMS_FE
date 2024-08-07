import React, { useState } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData"
import InnerTabs from "../../InnerTabs";
import TableCustom from "../../TableCustom.js";

import project from "../../assets/json/selectedPjt";

export default function Ps_1_2() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <p>배출실적 &gt; 실적스코프1,2</p>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12} />
            <InnerTabs items={[
                { label: '사용량', key: '1', children: <Usage formData={formData} />, },
                { label: '사용금액', key: '2', children: <AmountUsed formData={formData} />, },
            ]} />
        </div>
    );
}


function Usage({ formData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    return (
        <div>
            <TableCustom title="실적목록" data={project} buttons={['UploadExcel', 'DownloadExcelForm']} />
        </div>
    )
}

function AmountUsed({ formData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    const formDataForTable = Object.entries(formData).map(([key, value]) => {
        return { key: key, value: value != null ? value.toString() : '' };
    })
    return (
        <div>
            <TableCustom title="실적목록" data={formDataForTable} buttons={['UploadExcel', 'DownloadExcelForm']} />
        </div>
    )
}