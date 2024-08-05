import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Input } from 'antd';

export default function InputText({ name, label, required=false }) {
    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <Input />
        </Form.Item>
    )
}