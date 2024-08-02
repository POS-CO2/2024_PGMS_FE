import React, { useState } from 'react';
import * as styles from '../assets/css/formitem.css'; // 네이밍 확인
import { Form, Select } from 'antd';

export default function DropDown() {
    return (
        <Form.Item 
            className={styles.form_item}
            label="Select"
        >
            <Select>
                <Select.Option value="1">드</Select.Option>
                <Select.Option value="2">롭</Select.Option>
                <Select.Option value="3">다</Select.Option>
                <Select.Option value="4">운</Select.Option>
            </Select>
        </Form.Item>
    )
}