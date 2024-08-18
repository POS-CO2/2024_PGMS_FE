import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { ConfigProvider, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const theme = {
    token: {
        colorPrimary: '#3875f7',
        colorPrimaryHover: '#5592f8',
        colorPrimaryActive: '#3459a8',
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