import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import PdModal, { CmModal } from "./modals/PdModal.js";
import { ButtonGroup } from './Button';

const modalMap = {
    PD: PdModal,
    CM: CmModal,
}

export default function TableCustom({
    title = "Default Title",
    data = [],
    buttons = [],
    onRowClick = () => { },  // 기본값으로 빈 함수 설정
    modal = {}
}) {
    

    const renderModal = () => {
        if (modal.isModalOpen) {
            return (
                <ModalGroup modal={modal} />
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

export function ModalGroup({ modal }) {
    const ModalComponent = modalMap[modal.modalType];
    return ModalComponent ? <ModalComponent
                                isModalOpen={modal.isModalOpen}
                                handleOk={modal.handleOk || (() => { })}
                                handleCancel={modal.handleCancel || (() => { })}
                            /> : null;
}