import React, { useState } from 'react';
import * as styles from '../assets/css/formitem.css'; // 네이밍 확인
import { Form, Modal, Button, Input } from 'antd';

export default function SearchAtModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Form.Item
            className={styles.form_item}
            name="input"
            label="Input"
            rules={[{ required: true }]}
        >
            <div className={styles.input_button_container}>
                <Input className={styles.input_field} disabled={true} />
                <Button className={styles.modal_button} type="primary" onClick={showModal}>
                    Open Modal
                </Button>
            </div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
            </Modal>
        </Form.Item>
    )
}