import React, { useState } from 'react';
import * as styles from '../assets/css/formItem.css';
import { Form, Button, Input } from 'antd';
import ModalComponent from "./ModalComponent";

/**
 * 프로젝트 찾기(searchProject), 설비LIB 찾기(searchLib)
 */
export default function SearchAtModal({ name, label, required = false, modalType = "검색" }) {
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
                    {modalType}
                </Button>
            </div>
            
            <ModalComponent
                title={modalType}
                contents="테스트"
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
        </Form.Item >
    )
}