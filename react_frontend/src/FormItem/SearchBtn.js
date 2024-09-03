import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { ConfigProvider, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const theme = {
    token: {
        colorPrimary: '#0A7800',
        colorPrimaryHover: '#8AC784',
        //colorPrimaryActive: '#E5F1E4',
    },
}

export default function SearchBtn({ label = "조회", onClick }) {
    return (
        <Form.Item className={formItemStyles.search_btn}>
            <ConfigProvider theme={theme}>
                <Button type="primary" htmlType="submit" onClick={onClick}>{label}<SearchOutlined /></Button>
            </ConfigProvider>
        </Form.Item>
    )
}