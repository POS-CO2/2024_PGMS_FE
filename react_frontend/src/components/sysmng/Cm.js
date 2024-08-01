import React from 'react';
import * as navBarStyles from '../../assets/css/navbar.css';
import * as tableStyles from '../../assets/css/table.css';
import * as layerStyles from '../../assets/css/layer.css';
import {ConfigProvider, Table} from 'antd';

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
        // {
        //     title: 'Action 1',
        //     fixed: 'right',
        //     width: 90,
        //     render: () => <a>action</a>,
        //     },
        // {
        //     title: 'Action 2',
        //     width: 90,
        //     render: () => <a>action</a>,
        // },
        
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
            <div>
                <div className={navBarStyles.navbar}>
                    {"시스템 관리 > 코드 관리"}
                </div>
                <div className={layerStyles.layername}>코드그룹ID</div>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerColor: "white",
                                headerBg: "#000046",
                                borderColor: "gray",
                            }
                        }
                    }}
                >
                    <div className={tableStyles.cm_table}>
                    <Table 
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: 100,
                        }}
                        pagination={false}
                        bordered
                    />
                    </div>
                    <div className={layerStyles.midline}></div>
                </ConfigProvider>
            </div>
    );
}