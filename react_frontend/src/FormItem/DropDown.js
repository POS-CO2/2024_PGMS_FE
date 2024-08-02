import React from 'react';
import * as styles from '../assets/css/formItem.css';
import { Form, Select } from 'antd';

export default function DropDown({ name, label, required=false, options, defaultSelected = false }) {
    return (
        <Form.Item
            className={styles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
            initialValue={defaultSelected ? options[0].value : undefined}
        >
            <Select>
                {options.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    )
}