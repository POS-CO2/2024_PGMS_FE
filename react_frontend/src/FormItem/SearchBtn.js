import React, { useState } from 'react';
import * as styles from '../assets/css/formitem.css'; // 네이밍 확인
import { Form, Button } from 'antd';

export default function SearchBtn() {
    return (
        <Form.Item className={styles.search_btn}>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    )
}