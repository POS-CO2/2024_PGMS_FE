import React from 'react';
import { Modal } from 'antd';
import * as basicStyles from "./modal.css";

export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  return (
    <Modal 
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={handleCancel} 
    >
      <div className={basicStyles.title}>프로젝트 찾기</div>
      <p className={basicStyles.comment}>* 프로젝트 코드나 프로젝트 명 둘 중에 하나만 입력해도 검색이 가능합니다.</p>
    
      <div className={basicStyles.result_container}>
        
      </div>
    </Modal>
  )
}
