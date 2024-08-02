import React from 'react';
import * as styles from '../assets/css/formItem.css';
import { Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function SearchBtn({ label="조회" }) {
    return (
        <Form.Item className={styles.search_btn}>
            <Button type="primary" htmlType="submit">{label}<SearchOutlined /></Button>
        </Form.Item>
    )
}