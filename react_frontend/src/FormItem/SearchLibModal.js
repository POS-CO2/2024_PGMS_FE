import React, { useState } from 'react';
import { Modal } from 'antd';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import {lib} from "../assets/json/selectedPjt"

export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  const [formData, setFormData] = useState({});           // 검색 데이터
  const [selectedEq, setSelectedEq] = useState(null);     // 선택된 설비 리스트

  // 찾기 버튼 클릭 시 호출될 함수
  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  // 설비 row 클릭 시 호출될 함수
  const handleEqClick = (eq) => {
    setSelectedEq(eq.EquipName);
  };

  // 선택 버튼 클릭 시 호출될 함수
  const handleSelect = () => {
    handleOk(selectedEq);
  };
  
  return (
    <Modal 
      open={isModalOpen} 
      width={680}
      onCancel={handleCancel}
      footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    >
      <div className={pjtModalStyles.title}>설비LIB 찾기</div>
      <div className={pjtModalStyles.search_container}>
        <div className={pjtModalStyles.search_item}>
          <div className={pjtModalStyles.search_title}>설비LIB명</div>
          <div className={pjtModalStyles.search_container}>
            <input className={pjtModalStyles.search_name}/>
            <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
          </div>
        </div>
      </div>

      <div className={pjtModalStyles.result_container}>
        {(!formData || Object.keys(formData).length === 0) ?
          <></> : ( <Table data={lib} onRowClick={handleEqClick} /> )}
      </div>

      <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button>
    </Modal>
  )
}
