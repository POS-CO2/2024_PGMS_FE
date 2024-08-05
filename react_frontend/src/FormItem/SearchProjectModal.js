import React from 'react';
import { Modal } from 'antd';

export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  return (
    <Modal title="프로젝트 찾기" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      프로젝트 찾기
    </Modal>
  )
}
