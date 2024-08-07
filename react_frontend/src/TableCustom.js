import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import PdModal from "./modals/PdModal.js";
import { ButtonGroup } from './Button';

export default function TableCustom({
    title = "Default Title", 
    data = [], 
    buttons = [], 
    onRowClick = () => {},  // 기본값으로 빈 함수 설정
    modal = {}
}) {
    const renderModal = () => {
        if (modal.isModalOpen) {
            return (
                <PdModal 
                    isModalOpen={modal.isModalOpen} 
                    handleOk={modal.handleOk || (() => {})} 
                    handleCancel={modal.handleCancel || (() => {})}
                />
            );
        }
        return null;
    };
    
    return (
        <>
            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>{title}</div>
                <ButtonGroup buttons={buttons} onClick={modal.buttonClick} />
                {renderModal()}
            </div>
            <Table data={data} onRowClick={onRowClick} />
        </>
    );
}