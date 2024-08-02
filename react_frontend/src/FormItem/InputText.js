import React, { useState } from 'react';
import * as styles from '../assets/css/formitem.css'; // 네이밍 확인
import { Form, Input } from 'antd';

export default function InputText() {
    return (
        <Form.Item
            className={styles.form_item}
            name="email"
            label="E-mail"
        >
            <Input />
        </Form.Item>
    )
}