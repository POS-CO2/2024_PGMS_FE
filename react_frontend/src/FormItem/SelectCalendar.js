import React, { useState } from 'react';
import * as styles from '../assets/css/formitem.css'; // 네이밍 확인
import { Form, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function SelectCalendar() {
    return (
        <Form.Item
            className={styles.form_item}
            label="RangePicker"
        >
            <RangePicker />
        </Form.Item>
    )
}