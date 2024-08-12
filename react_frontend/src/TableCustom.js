import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { PdAddModal, RmAddModal, Ps12Modal, DelModal } from "./PdModal";
import { ButtonGroup } from './Button';

const modalMap = {
    PdAdd: PdAddModal,
    Del: DelModal,
    RmAdd: RmAddModal,
    RmDel: RmAddModal,
    Ps12: Ps12Modal,
}

export default function TableCustom({
    title = "Default Title",
    variant = 'default',
    data = [],
    buttons = [],
    onClicks = [],
    onRowClick = () => { },  // 기본값으로 빈 함수 설정
    modals = []
}) {
    return (
        <>
            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>{title}</div>
                <ButtonGroup buttons={buttons} onClicks={onClicks} />
                
                {modals.map((modal) => {
                    const ModalComponent = modalMap[modal.modalType];
                    return ModalComponent ? (
                        <ModalComponent
                            isModalOpen={modal.isModalOpen}
                            handleOk={modal.handleOk || (() => {})}
                            handleCancel={modal.handleCancel || (() => {})}
                            onRowClick={onRowClick}
                        />
                    ) : null;
                })}
            </div>
            <Table data={data} variant={variant} onRowClick={onRowClick} />
        </>
    );
}