import React, { useState } from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function InputText({ name, label, required = false }) {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required, message: '${label} 입력은 필수입니다.' }]}
        >
            <Input
                value={value}
                onChange={handleChange}
                allowClear={{ clearIcon: <CloseOutlined style={{ color: "red" }} /> }}
            />
        </Form.Item>
    )
}