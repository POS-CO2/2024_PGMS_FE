import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import PdModal, { CmAddModal, DeleteModal, CmEditModal, CmListAddModal, CmListEditModal } from "./modals/PdModal.js";
import Ps12Modal from "./modals/Ps12Modal.js";
import { ButtonGroup } from './Button';

const modalMap = {
    PD: PdModal,
    CMAdd: CmAddModal,
    CMEdit: CmEditModal,
    CMListAdd: CmListAddModal,
    CMListEdit: CmListEditModal,
    Delete: DeleteModal,
    Ps12: Ps12Modal,
}

export default function TableCustom({
    title = "Default Title",
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
                        />
                    ) : null;
                })}
            </div>
            <Table data={data} onRowClick={onRowClick} />
        </>
    );
}