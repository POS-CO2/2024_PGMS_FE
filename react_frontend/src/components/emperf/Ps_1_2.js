import React, { useState } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData"
import InnerTabs from "../../InnerTabs";

import Table from "../../Table.js";
import project from "../../assets/json/selectedPjt";

export default function Ps_1_2() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    const tabItems = [
        {
            label: '사용량',
            key: '1',
            children: <Usage formData={formData} />,
        },
        {
            label: '사용금액',
            key: '2',
            children: <AmountUsed formData={formData} />,
        },
    ];

    return (
        <div>
            <h2>실적스코프1,2</h2>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12} />
            <InnerTabs items={tabItems} />
        </div>
    );
}


function Usage({ formData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>;
    }

    return (
        <div>
            <Table data={project}/>
        </div>
    )
}

function AmountUsed({ formData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>;
    }

    const formDataForTable = Object.entries(formData).map(([key, value]) => {
        return { key: key, value: value != null ? value.toString() : '' };
    })
    return (
        <div>
            <Table data={formDataForTable}/>
        </div>
    )
}
