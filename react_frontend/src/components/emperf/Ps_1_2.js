import React, { useState } from 'react';
import { SearchForm_Ps_1_2 } from "../../SearchForms.js";
import InnerTabs from "../../InnerTabs.js";
import { Tabs, Table } from 'antd';

export default function Ps_1_2() {
    {/*
    const columns = [
        { title: 'Month', dataIndex: 'month', key: 'month', }, { title: 'Amount', dataIndex: 'amount', key: 'amount', },
    ];
    const data = [
        { key: '1', month: 'Jan', amount: 400, }, { key: '2', month: 'Feb', amount: 300, }, { key: '3', month: 'Mar', amount: 200, }, { key: '4', month: 'Apr', amount: 278, }, { key: '5', month: 'May', amount: 189, }, { key: '6', month: 'Jun', amount: 425, }, { key: '7', month: 'Jul', amount: 453, }, { key: '8', month: 'Aug', amount: 538, },
    ];

    const columns2 = [
        { title: 'Month', dataIndex: 'month', key: 'month', }, { title: 'Amount', dataIndex: 'amount', key: 'amount', },
    ];
    const data2 = [
        { key: '6', month: 'Jun', amount: 425, }, { key: '7', month: 'Jul', amount: 453, }, { key: '8', month: 'Aug', amount: 538, }, { key: '9', month: 'Sep', amount: 127, }, { key: '10', month: 'Oct', amount: 543, },
    ];

    const tabItems = [
        {
            label: '사용량',
            key: '1',
            children: <Table columns={columns} dataSource={data} />,
        },
        {
            label: '사용금액',
            key: '2',
            children: <Table columns={columns2} dataSource={data2} />,
        },
    ];
    */}
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <h2>실적스코프1,2</h2>
            <SearchForm_Ps_1_2 onFormSubmit={handleFormSubmit} />

            <InnerTabs items={tabItems} />;

            <div>
                <h3>Form Data:</h3>
                <ul>
                    {Object.entries(formData).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value ? value.toString() : ''}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}