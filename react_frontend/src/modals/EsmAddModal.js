import React, { useState } from 'react';
import { Modal } from 'antd';
import * as modalStyles from "../assets/css/pdModal.css";
 
export default function Ps12Modal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달

    return (
        <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>배출원 등록</div>
            

            <button className={modalStyles.select_button} onClick={handleOk}>등록</button>
        </Modal>
    )
}