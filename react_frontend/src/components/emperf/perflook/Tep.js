import React, { useState } from 'react';
import SearchForms from "../../../SearchForms";
import { formField_tep } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import { CustomBarChart } from "../../../Chart.js";
import { tepData, chartData } from "../../../assets/json/tep";
import { temp_data } from '../../../assets/json/chartData';
import { Card } from '@mui/material';
import * as mainStyle from '../../../assets/css/main.css';
import * as tepStyle from '../../../assets/css/tep.css';

export default function Tep() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <div className={mainStyle.breadcrumb}>
                {"배출실적 > 실적조회 > 총량실적 조회"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_tep} autoSubmitOnInit={true} />
            <InnerTabs items={[
                { label: '차트', key: '1', children: <ChartTab formData={formData} tepData={temp_data} />, },
                { label: '표', key: '2', children: <TableTab formData={formData} tepData={tepData} />, },
            ]} />
        </div>
    );
}

function ChartTab({ formData, tepData }) {
    return (
        <div>
            <div /*className={tepStyle.chart_title}*/>{"총량실적차트"}</div>
            <Card className={tepStyle.box} sx={{ borderRadius: "10px", backgroundColor: "rgb(23, 27, 38)" }}>
                <CustomBarChart data={tepData} />
            </Card>
        </div>
    )
}

function TableTab({ formData, tepData }) {
    const tableData = tepData.filter(data => data.actvYear === Number(formData.actvYear));

    const onDownloadExcelClick = () => {
        console.log("onDownloadExcelClick");
    };

    return (
        <div>
            <TableCustom title="총량실적표" data={tableData} buttons={['DownloadExcel']} onClicks={[onDownloadExcelClick]} />
        </div>
    )
}