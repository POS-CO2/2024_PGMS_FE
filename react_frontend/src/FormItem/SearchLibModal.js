import React from 'react';
import { Modal } from 'antd';

export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  return (
    <Modal title="설비LIB 찾기" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      설비LIB 찾기
    </Modal>
  )
}
