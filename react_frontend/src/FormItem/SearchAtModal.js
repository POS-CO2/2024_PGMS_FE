import React, { useState } from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Button, Input } from 'antd';
import ModalComponent from "./ModalComponent";
import SearchProjectModal from "./SearchProjectModal";
import SearchLibModal from "./SearchLibModal";

/**
 * 프로젝트 찾기(searchProject), 설비LIB 찾기(searchLib)
 */
export default function SearchAtModal({ name, label, required = false, modalType = "검색", form, onProjectSelect }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOkForDropDown = (option) => {
        setIsModalOpen(false);
        const selectedOption = option.value; // 값 가져오기
        const selectedLabel = option.label; // 라벨 가져오기
        form.setFieldsValue({ [name]: selectedOption  }); // 선택된 label을 폼 필드에 설정
        setInputValue(selectedLabel);
    };
    const searchProject = (data) => {
        setIsModalOpen(false);
        form.setFieldsValue({ [name]: data  });
        setInputValue(data.프로젝트코드 + '/' + data.프로젝트명); // SearchProjectModal.js 에서 [pjt.pjtCode, pjt.pjtName]을 pjt로 넘겨주어 변경

        if (onProjectSelect) {  // onProjectSelect 콜백이 존재하는 경우 호출
            onProjectSelect(data);
        }
    };
    const searchEqLib = (data) => {
        setIsModalOpen(false);
        form.setFieldsValue({ [name]: data  });
        setInputValue(data.설비라이브러리명); // SearchProjectModal.js 에서 [pjt.pjtCode, pjt.pjtName]을 pjt로 넘겨주어 변경

        if (onProjectSelect) {  // onProjectSelect 콜백이 존재하는 경우 호출
            onProjectSelect(data);
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const renderModal = () => {
        switch (modalType) {
            case "프로젝트 찾기":
                return <SearchProjectModal isModalOpen={isModalOpen} handleOk={searchProject} handleCancel={handleCancel} />;
            case "설비LIB 찾기":
                return <SearchLibModal isModalOpen={isModalOpen} handleOk={searchEqLib} handleCancel={handleCancel} />;
            default:
                return <ModalComponent title={modalType} contents="테스트" isModalOpen={isModalOpen} handleOk={searchProject} handleCancel={handleCancel} />;
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
                {renderModal()}
            </div>
        </Form.Item>
    )
}