import React, { useState } from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function InputText({ name, label, required = false }) {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const handleClear = (e) => {
        setValue('');
    };

    const clearIcon = (
        <CloseOutlined
            onClick={handleClear}
            style={{ cursor: 'pointer' }}
        />
    );

    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <Input
                value={value}
                onChange={handleChange}
                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
            />
        </Form.Item>
    )
}