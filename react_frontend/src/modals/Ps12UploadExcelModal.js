import React, { useState } from 'react';
import { Modal, Button, message, Upload } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import * as modalStyles from "../assets/css/Ps12UploadExcelModal.css";

const { Dragger } = Upload;
const props = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    /*beforeUpload: (file) => {
        const isPNG = file.type === 'image/png';
        if (!isPNG) {
            message.error(`${file.name} is not a png file`);
        }
        return isPNG || Upload.LIST_IGNORE;
    },*/
    onChange: (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file.name + " uploading");
        }
        if (status === 'uploading') {
            console.log(info.file.name + " uploading2");
        }
        if (status === 'done') {
            console.log("file uploaded successfully.");
        } else if (status === 'error') {
            console.log("file upload failed.");
        }
    },
    onDrop: (e) => {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

export default function Ps12UploadExcelModal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={550}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>엑셀 업로드</div>

            <div>
                <Upload {...props}>
                    <Button>업로드<UploadOutlined /></Button>
                </Upload>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">파일을 마우스로 끌어오세요</p>
                </Dragger>
            </div>

            <button className={modalStyles.select_button} onClick={handleOk}>등록</button>
        </Modal>
    )
}