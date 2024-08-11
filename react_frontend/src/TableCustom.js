import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import PdModal from "./modals/PdModal.js";
import Ps12UploadExcelModal from "./modals/Ps12UploadExcelModal.js";
import EsmAddModal from "./modals/EsmAddModal.js";
import EsmDeleteModal from "./modals/EsmDeleteModal.js";
import { ButtonGroup } from './Button';

const modalMap = {
    PdAdd: PdModal,
    PdDel: PdModal,
    Ps12UploadExcel: Ps12UploadExcelModal,
    EsmAdd: EsmAddModal,
    EsmDelete: EsmDeleteModal,
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