import React from 'react';
import * as styles from '../assets/css/formItem.css';
import { Form, Input } from 'antd';

export default function InputText({ name, label, required=false }) {
    return (
        <Form.Item
            className={styles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <Input />
        </Form.Item>
    )
}