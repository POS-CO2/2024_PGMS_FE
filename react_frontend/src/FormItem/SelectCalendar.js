import React from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function SelectCalendar({ name, label, required=false }) {
    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <RangePicker />
        </Form.Item>
    )
}