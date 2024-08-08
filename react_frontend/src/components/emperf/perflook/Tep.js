import React from 'react';
import SearchForms from "../../../SearchForms";
import { formField_tep } from "../../../assets/json/searchFormData"
import InnerTabs from "../../../InnerTabs";
import TableCustom from "../../../TableCustom.js";
import ChartCustom from "../../../ChartCustom.js";

import project from "../../../assets/json/selectedPjt";

const chartData = [
    { name: 'Page A', Scope1: 2400, Scope2: 2400 },
    { name: 'Page B', Scope1: 1398, Scope2: 2210 },
    { name: 'Page C', Scope1: 9800, Scope2: 2290 },
    { name: 'Page D', Scope1: 3908, Scope2: 2000 },
    { name: 'Page E', Scope1: 4800, Scope2: 2181 },
    { name: 'Page F', Scope1: 3800, Scope2: 2500 },
    { name: 'Page G', Scope1: 4300, Scope2: 2100 },
];

export default function Tep() {

    const handleFormSubmit = (data) => {

    };

    return (
        <div>
            <p>배출실적 &gt; 실적조회 &gt; 총량실적 조회</p>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_tep} />
            <InnerTabs items={[
                { label: '차트', key: '1', children: <ChartCustom title="총량실적차트" data={chartData} />, },
                { label: '표', key: '2', children: <TableCustom title="총량실적표" data={project} buttons={['DownloadExcel']} />, },
            ]} />
        </div>
    );
}
