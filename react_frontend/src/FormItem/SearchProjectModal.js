import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import project from "../assets/json/project.js"
import axiosInstance from '../utils/AxiosInstance.js';
 
export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  const [formData, setFormData] = useState({});                 // 검색 데이터
  const [selectedPjt, setSelectedPjt] = useState([]);     // 선택된 프로젝트
  const [project, setProject] = useState([]);

    // 설비 라이브러리 불러오기 
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get("/pjt");
                setProject(response.data);    
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
            
        };
        fetchProject(); // 컴포넌트 마운트 될 때 데이터불러옴
    }, [])

  //찾기 버튼 클릭시 호출될 함수
  const handleFormSubmit = () => {
    setFormData(project); 
  };

  // 프로젝트 row 클릭 시 호출될 함수
  const handlePjtClick = (pjt) => {
    console.log(pjt);
    console.log([pjt.pjtCode, pjt.pjtName]);
    setSelectedPjt(pjt);   // 클릭된 프로젝트의 코드로 상태를 설정
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
          <input className={pjtModalStyles.search_code}/>
        </div>
        <div className={pjtModalStyles.search_item}>
          <div className={pjtModalStyles.search_title}>프로젝트명</div>
          <div className={pjtModalStyles.search_container}>
            <input className={pjtModalStyles.search_name}/>
            <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
          </div>
        </div>
      </div>

      <div className={pjtModalStyles.result_container}>

      {(!formData || Object.keys(formData).length === 0) ?
            <></> : ( <Table data={project} onRowClick={handlePjtClick} /> )}
      </div>

      <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button>
    </Modal>
  )
}