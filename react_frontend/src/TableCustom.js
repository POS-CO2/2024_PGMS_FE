import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { DelModal, PdAddModal, RmAddModal, FlAddModal, Ps12UploadExcelModal, CmAddModal, DeleteModal, CmEditModal, CmListAddModal, CmListEditModal, FmAddModal, UmAddModal, MmAddModal, EsmAddModal } from "./modals/PdModal.js";
import { ButtonGroup } from './Button';

const modalMap = {
    CMAdd: CmAddModal,
    CMEdit: CmEditModal,
    CMListAdd: CmListAddModal,
    CMListEdit: CmListEditModal,
    Delete: DeleteModal,
    Ps12UploadExcel: Ps12UploadExcelModal,
    EsmAdd: EsmAddModal,
    PdAdd: PdAddModal,
    RmAdd: RmAddModal,
    FlAdd: FlAddModal,
    Del: DelModal,
    FmAdd: FmAddModal,
    UmAdd: UmAddModal,
    MmAdd: MmAddModal,
}

export default function TableCustom({
    title = "Default Title",
    variant = 'default',
    data = [],
    buttons = [],
    onClicks = [],
    onRowClick = () => { },  // 기본값으로 빈 함수 설정
    modals = [],
    table = true,
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
            {table ? (
            <Table data={data} variant={variant} onRowClick={onRowClick} />
            ) : (<></>)}
            
        </>
    );
}