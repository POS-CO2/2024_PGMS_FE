import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import project from "../assets/json/project.js"
import axiosInstance from '../utils/AxiosInstance.js';
 
export default function ModalComponent({ isModalOpen, handleOk, handleCancel, pgms = 'y' }) {
  const [formData, setFormData] = useState({});           // 검색 데이터
  const [selectedPjt, setSelectedPjt] = useState([]);     // 선택된 프로젝트
  const [allProjects, setAllProjects] = useState([]);     // 전체 프로젝트
  const [project, setProject] = useState([]);

  useEffect(() => {
      const fetchProject = async () => {
          try {
              const response = await axiosInstance.get(`/pjt?pgmsYn=${pgms}`);
              setAllProjects(response.data);
              setProject(response.data);
          } catch (error) {
              console.log(error);
          }
          
      };
      fetchProject(); // 컴포넌트 마운트 될 때 데이터불러옴
  }, [])

  // input 필드 변경 시 호출될 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //찾기 버튼 클릭시 호출될 함수
  const handleFormSubmit = () => {
    const filteredProjects = allProjects.filter(pjt => {
      const matchesCode = formData.projectCode ? pjt.pjtCode.includes(formData.projectCode) : true;
      const matchesName = formData.projectName ? pjt.pjtName.includes(formData.projectName) : true;
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
    handleOk(selectedPjt);                        // 선택된 프로젝트 데이터를 handleOk로 전달
  };

  return (
    <Modal 
      open={isModalOpen} 
      width={1300}
      onCancel={handleCancel} 
      footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    >
      <div className={pjtModalStyles.title}>프로젝트 찾기</div>
      <p className={pjtModalStyles.comment}>* 프로젝트 코드나 프로젝트 명 둘 중에 하나만 입력해도 검색이 가능합니다.</p>
      <div className={pjtModalStyles.search_container}>
        <div className={pjtModalStyles.search_item}>
          <div className={pjtModalStyles.search_title}>프로젝트코드</div>
          <input 
            name="projectCode"
            className={pjtModalStyles.search_code} 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={pjtModalStyles.search_item}>
          <div className={pjtModalStyles.search_title}>프로젝트명</div>
          <div className={pjtModalStyles.search_container}>
            <input 
              name="projectName"
              className={pjtModalStyles.search_name} 
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
          </div>
        </div>
      </div>

      <div className={pjtModalStyles.result_container}>
        <Table data={project} onRowClick={handlePjtClick} />
      </div>

      <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button>
    </Modal>
  )
}