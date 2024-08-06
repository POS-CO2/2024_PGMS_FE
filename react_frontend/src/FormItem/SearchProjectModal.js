import React from 'react';
import { Modal } from 'antd';

export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  return (
    <Modal title="프로젝트 찾기" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} bodyStyle={{height: 1000}}>
      프로젝트 찾기2
    </Modal>
  )
}
