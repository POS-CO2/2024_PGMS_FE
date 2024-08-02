import React from 'react';
import * as styles from '../assets/css/formItem.css';
import { Form, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function SelectCalendar({ name, label, required=false }) {
    return (
        <Form.Item
            className={styles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <RangePicker />
        </Form.Item>
    )
}