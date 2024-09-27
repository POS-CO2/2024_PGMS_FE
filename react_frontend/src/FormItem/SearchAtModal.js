import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { selectedPjtState } from '../atoms/searchFormAtoms';
import * as formItemStyles from '../assets/css/formItem.css';
import { Form, Button, Input } from 'antd';
import ModalComponent from "./ModalComponent";
import SearchProjectModal from "./SearchProjectModal";
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #0EAA00; /* 원하는 배경색으로 설정 */
  color: white; /* 텍스트 색상 */
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  margin-left: 0.3rem;
  height: 32px;
  vertical-align: middle;

  &:hover {
    background-color: #8AC784; /* 마우스 오버 시 배경색 */
  }
`;

/**
 * 프로젝트 찾기(searchProject), 설비LIB 찾기(searchLib)
 */
export default function SearchAtModal({ initialValues={}, name, label, required = false, modalType = "검색", form, onProjectSelect=()=>{} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedPjt, setSelectedPjt] = useRecoilState(selectedPjtState);

    useEffect(() => {
        if(Object.keys(initialValues).length !== 0) {
            setInputValue(initialValues.searchProject.pjtCode + '/' + initialValues.searchProject.pjtName);
        }
    }, [initialValues])
    
    useEffect(() => {
        if(Object.keys(selectedPjt).length !== 0) {
            setInputValue(selectedPjt.pjtCode + '/' + selectedPjt.pjtName);
            form.setFieldsValue({ [name]: selectedPjt });
            if (onProjectSelect) {  // onProjectSelect 콜백이 존재하는 경우 호출
                onProjectSelect(selectedPjt);
            }
        }
    }, [selectedPjt])

    const showModal = (e) => {
        e.preventDefault(); // 기본 동작 방지
        setIsModalOpen(true);
    };
    
    const searchProject = (data) => {
        setIsModalOpen(false);
        setSelectedPjt(data);
        form.setFieldsValue({ [name]: data  });
        setInputValue(data.pjtCode + '/' + data.pjtName); // SearchProjectModal.js 에서 [pjt.pjtCode, pjt.pjtName]을 pjt로 넘겨주어 변경

        form.validateFields([name]) // 명시적으로 onFieldsChange를 트리거
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const renderModal = () => {
        switch (modalType) {
            case "프로젝트 찾기":
                return <SearchProjectModal isModalOpen={isModalOpen} handleOk={searchProject} handleCancel={handleCancel} />;
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
                <Input className={formItemStyles.input_field} disabled={true} value={inputValue} title={inputValue} style={{height:"32px"}}/>
                <StyledButton className={formItemStyles.modal_button} htmlType="button" type="primary" onClick={showModal}>
                    찾기
                </StyledButton>
                {renderModal()}
            </div>
        </Form.Item>
    )
}