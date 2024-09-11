import React, { useState } from 'react';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Button, Input } from 'antd';
import ModalComponent from "./ModalComponent";
import SearchProjectModal from "./SearchProjectModal";
import SearchLibModal from "./SearchLibModal";
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #0A7800; /* 원하는 배경색으로 설정 */
  color: white; /* 텍스트 색상 */
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;

  &:hover {
    background-color: #8AC784; /* 마우스 오버 시 배경색 */
  }
`;

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
        const selectedData = data;
        form.setFieldsValue({ [name]: selectedData  });
        setInputValue(selectedData.pjtCode + '/' + selectedData.pjtName); // SearchProjectModal.js 에서 [pjt.pjtCode, pjt.pjtName]을 pjt로 넘겨주어 변경

        if (onProjectSelect) {  // onProjectSelect 콜백이 존재하는 경우 호출
            onProjectSelect(data);
        }
    };
    const searchEqLib = (data) => {
        setIsModalOpen(false);
        form.setFieldsValue({ [name]: data  });
        setInputValue(data.equipLibName); // SearchProjectModal.js 에서 [pjt.pjtCode, pjt.pjtName]을 pjt로 넘겨주어 변경

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
            className={formItemStyles.form_item_search_project}
            name={name}
            label={label}
            rules={[{ required: required, message: '${label} 선택은 필수입니다.' }]}
        >
            <div className={formItemStyles.input_button_container}>
                <Input className={formItemStyles.input_field} disabled={true} value={inputValue} />
                <StyledButton className={formItemStyles.modal_button} type="primary" onClick={showModal}>
                    찾기
                </StyledButton>
                {renderModal()}
            </div>
        </Form.Item>
    )
}