import React from 'react';
import * as tableStyles from '../../assets/css/table.css'

export default function Cm() {

    const columns = [
        {
            title: 'Full Name',
            width: 10,
            dataIndex: 'name',
        },
        {
            title: 'Age',
            width: 10,
            dataIndex: 'age',
        },
        {
            title: 'Full Name',
            width: 10,
            dataIndex: 'name',
        },
        {
            title: 'Age',
            width: 10,
            dataIndex: 'age',
        },
    ];

    const data = [
        {
            key: '1',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '2',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '3',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '4',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '5',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '6',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '7',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '8',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '9',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '10',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },
        {
            key: '11',
            name: "BbingDdang",
            age: 20,
            address: 'poscodx'
        },

    ];

    return (
        <div className={tableStyles.cm_root}>
            <div className={tableStyles.name}>코드 그룹 ID</div>
            <div className={tableStyles.cm_table}>

            </div>
            <div className={tableStyles.cm_table}>

            </div>
        </div>
    );
}