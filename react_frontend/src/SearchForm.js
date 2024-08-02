import React, { useState } from 'react';
import * as styles from './assets/css/searchform.css'; // 네이밍 확인
import { Button, Form, Input, Modal, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function SearchBox() {
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
        <Form layout="vertical" className={styles.form_container}>
            <Form.Item
                name="input"
                label="Input"
                rules={[{ required: true }]}
                className={styles.form_item}
            >
                <div className={styles.input_button_container}>
                    <Input disabled={true} className={styles.input_field} />
                    <Button type="primary" onClick={showModal} className={styles.modal_button}>
                        Open Modal
                    </Button>
                </div>
                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p>Some contents...</p>
                </Modal>
            </Form.Item>

            <Form.Item
                name="email"
                label="E-mail"
                rules={[{ required: true, message: 'Please input your E-mail!' }]}
                className={styles.form_item}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Select" className={styles.form_item}>
                <Select>
                    <Select.Option value="1">드</Select.Option>
                    <Select.Option value="2">롭</Select.Option>
                    <Select.Option value="3">다</Select.Option>
                    <Select.Option value="4">운</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="RangePicker" className={styles.form_item}>
                <RangePicker />
            </Form.Item>

            <Form.Item className={styles.full_width}>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>

            {/*
            <dropDown title="" list={pjtCodeList} />
            <searchAtModal/>
            <inputText/>
            <selectCalendar/>
        */}
        </Form>
    );
};
