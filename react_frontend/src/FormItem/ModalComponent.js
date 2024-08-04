import React from 'react';
import { Modal } from 'antd';

export default function ModalComponent({ title, contents, isModalOpen, handleOk, handleCancel }) {
  return (
    <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      {contents}
    </Modal>
  )
}
