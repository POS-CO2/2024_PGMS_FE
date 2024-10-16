import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { ConfigProvider, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const theme = {
    token: {
        colorPrimary: '#0EAA00',
        colorPrimaryHover: '#8AC784',
        fontSize: '1rem',
    },
}

export default function SearchBtn({ label = "조회", onClick }) {
    return (
        <Form.Item className={formItemStyles.search_btn}>
            <ConfigProvider theme={theme}>
                <Button 
                    type="primary" 
                    htmlType="submit"
                    onClick={onClick} 
                    style={{
                        padding: '6px 12px',
                        fontWeight: 'bold',
                    }}
                >
                    <SearchOutlined /> 
                    {label}
                </Button>
            </ConfigProvider>
        </Form.Item>
    )
}