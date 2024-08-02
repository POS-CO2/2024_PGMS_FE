import React, { useState } from 'react';
import * as styles from '../assets/css/formItem.css';
import { Form, Modal, Button, Input } from 'antd';

export default function SearchAtModal({ name, label, required=false, modalBtnLabel="검색" }) {
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
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <div className={styles.input_button_container}>
                <Input className={styles.input_field} disabled={true} />
                <Button className={styles.modal_button} type="primary" onClick={showModal}>
                    {modalBtnLabel}
                </Button>
            </div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
            </Modal>
        </Form.Item>
    )
}