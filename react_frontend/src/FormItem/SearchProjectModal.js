import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { pjtColumns } from '../assets/json/tableColumn';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import axiosInstance from '../utils/AxiosInstance.js';
import styled from 'styled-components';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Texture } from 'three';

const CustomInput = styled(Input)`
    background-color: #ECF1F4 !important;

    &:focus, &:hover, &.ant-input-focused, &:focus-within {
        outline: none;
        box-shadow: 0 0 0 0.5px #0EAA00 !important;
        border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }

    input {
        &:focus {
            box-shadow: none !important;
            border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }
    }
`;
 
export default function ModalComponent({ isModalOpen, handleOk, handleCancel}) {  
  const [selectedPjt, setSelectedPjt] = useState([]);     // 선택된 프로젝트
  const [allProjects, setAllProjects] = useState([]);     // 전체 프로젝트
  const [project, setProject] = useState([]);

  const [pjtCode, setPjtCode] = useState('');
  const [pjtName, setPjtName] = useState('');

  useEffect(() => {
      const fetchProject = async () => {
          try {
              const {data} = await axiosInstance.get(`/pjt?pgmsYn=y`);

              setAllProjects(data);
              setProject(data);
          } catch (error) {
              console.log(error);
          }
          
      };
      fetchProject(); // 컴포넌트 마운트 될 때 데이터불러옴
  }, []);

  //찾기 버튼 클릭시 호출될 함수
  const handleFormSubmit = () => {
    const filteredProjects = allProjects.filter(pjt => {
      const matchesCode = pjtCode ? pjt.pjtCode?.includes(pjtCode) : true;
      const matchesName = pjtName ? pjt.pjtName?.includes(pjtName) : true;
      return matchesCode && matchesName;
    });
    
    setProject(filteredProjects);
  };

  // 엔터 키 입력 시 handleFormSubmit 호출
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // 폼의 기본 제출 동작 방지
      handleFormSubmit();
    }
  };

  // 프로젝트 row 클릭 시 호출될 함수
  const handlePjtClick = (pjt) => {
    setSelectedPjt(pjt ?? {});   // 클릭된 프로젝트의 코드로 상태를 설정
  };

  // 선택 버튼 클릭 시 호출될 함수
  const handleSelect = () => {
    setPjtCode('');
    setPjtName('');
    handleOk(selectedPjt);                        // 선택된 프로젝트 데이터를 handleOk로 전달
  };

  return (
    <Modal 
      open={isModalOpen} 
      width={1400}
      onCancel={handleCancel} 
      footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    >
      <div className={pjtModalStyles.group_container}>
        <div className={pjtModalStyles.title}>프로젝트 찾기</div>
        <p className={pjtModalStyles.comment}>* 프로젝트 코드나 프로젝트 명 둘 중에 하나만 입력해도 검색이 가능합니다.</p>
        <div className={pjtModalStyles.search_container}>
          <div className={pjtModalStyles.search_item}>
            <div className={pjtModalStyles.search_title}>프로젝트코드</div>
            <CustomInput
              value={pjtCode}
              allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
              onChange={(e) => setPjtCode(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '12rem' }}
            />
          </div>
          <div className={pjtModalStyles.search_item}>
            <div className={pjtModalStyles.search_title}>프로젝트명</div>
            <div className={pjtModalStyles.search_container}>
              <CustomInput
                value={pjtName}
                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                onChange={(e) => setPjtName(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '12rem' }}
              />
              <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
            </div>
          </div>
        </div>

        <div className={pjtModalStyles.result_container}>
          <Table columns={pjtColumns} data={project} onRowClick={handlePjtClick} modalPagination={false} />
        </div>
      </div>
      
      <div className={pjtModalStyles.button_container}>
        {(Object.keys(selectedPjt).length === 0) ?
          <></> : ( <button className={pjtModalStyles.select_button} onClick={handleSelect}>
                      <span className={pjtModalStyles.button_text}>선택</span>
                      <CheckBoxIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                    </button> 
                  )}
        <button className={pjtModalStyles.select_button} onClick={handleCancel}>
          <span className={pjtModalStyles.button_text}>취소</span>
          <DisabledByDefaultIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
        </button> 
      </div>
    </Modal>
  )
}