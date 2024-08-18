import React, { useState } from 'react';
import SearchForms from "../../../SearchForms";
import { formField_tep } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";
import { tepData } from "../../../assets/json/tep";
import { temp_data } from '../../../assets/json/chartData';
import { Card } from '@mui/material';
import * as mainStyle from '../../../assets/css/main.css';

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
                {
                    label: '차트', key: '1', children: <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
                                                            <ChartCustom title={"총량실적차트"} data={temp_data} />
                                                        </Card>,
                },
                { label: '표', key: '2', children: <TableTab formData={formData} tepData={tepData} />, },
            ]} />
        </div>
    );
}

function TableTab({ formData, tepData }) {
    const tableData = tepData.filter(data => data.actvYear === Number(formData.actvYear));

    const onDownloadExcelClick = () => {
        console.log("onDownloadExcelClick");
    };

    return (
        <Card sx={{ width: "100%", height: "100%", borderRadius: "15px" }}>
            <TableCustom title="총량실적표" data={tableData} buttons={['DownloadExcel']} onClicks={[onDownloadExcelClick]} />
        </Card>
    )
}