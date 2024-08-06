import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function SearchBtn({ label="조회", onClick }) {
    return (
        <Form.Item className={formItemStyles.search_btn}>
            <Button type="primary" htmlType="submit" onClick={onClick}>{label}<SearchOutlined /></Button>
        </Form.Item>
    )
}