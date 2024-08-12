import React, { useState } from 'react';
import SearchForms from "../../../SearchForms";
import { formField_tep } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import { tepData, chartData } from "../../../assets/json/tep";

export default function Tep() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <p>배출실적 &gt; 실적조회 &gt; 총량실적 조회</p>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_tep} autoSubmitOnInit={true} />
            <InnerTabs items={[
                { label: '차트', key: '1', children: <ChartCustom title="총량실적차트" data={chartData} />, },
                { label: '표', key: '2', children: <TableTab formData={formData} tepData={tepData} />, },
            ]} />
        </div>
    );
}

function TableTab({ formData, tepData }) {
    const tableData = tepData.filter(data => data.actvYear === Number(formData.actvYear));

    return (
        <div>
            <TableCustom title="총량실적표" data={tableData} buttons={['DownloadExcel']} />
        </div>
    )
}