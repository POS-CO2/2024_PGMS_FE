import React, { useState } from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Button, Input } from 'antd';
import ModalComponent from "./ModalComponent";
import SearchProjectModal from "./SearchProjectModal";
import SearchLibModal from "./SearchLibModal";

/**
 * 프로젝트 찾기(searchProject), 설비LIB 찾기(searchLib)
 */
export default function SearchAtModal({ name, label, required = false, modalType = "검색", form }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (option) => {
        setIsModalOpen(false);
        const selectedOption = option.value; // 값 가져오기
        const selectedLabel = option.label; // 라벨 가져오기
        form.setFieldsValue({ [name]: selectedOption  }); // 선택된 label을 폼 필드에 설정
        setInputValue(selectedLabel);
    };
    const handleOk2 = (data) => {
        setIsModalOpen(false);
        const selectedData = data;
        setInputValue(selectedData);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const renderModal = () => {
        switch (modalType) {
            case "프로젝트 찾기":
                return <SearchProjectModal isModalOpen={isModalOpen} handleOk={handleOk2} handleCancel={handleCancel} />;
            case "설비LIB 찾기":
                return <SearchLibModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />;
            default:
                return <ModalComponent title={modalType} contents="테스트" isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />;
        }
    }; 

    return (
        <Form.Item
            className={formItemStyles.form_item}
            name={name}
            label={label}
            rules={[{ required: required }]}
        >
            <div className={formItemStyles.input_button_container}>
                <Input className={formItemStyles.input_field} disabled={true} value={inputValue} />
                <Button className={formItemStyles.modal_button} type="primary" onClick={showModal}>
                    {modalType}
                </Button>
            </div>

            {renderModal()}
        </Form.Item >
    )
}