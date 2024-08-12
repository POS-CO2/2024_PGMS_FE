import React, {useState} from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { DelModal, PdAddModal, RmAddModal, FlAddModal, Ps12Modal, CmAddModal, DeleteModal, CmEditModal, CmListAddModal, CmListEditModal, FmAddModal, UmAddModal, MmAddModal } from "./modals/PdModal.js";
import { ButtonGroup } from './Button';

const modalMap = {
    CMAdd: CmAddModal,
    CMEdit: CmEditModal,
    CMListAdd: CmListAddModal,
    CMListEdit: CmListEditModal,
    Delete: DeleteModal,
    Ps12: Ps12Modal,
    PdAdd: PdAddModal,
    RmAdd: RmAddModal,
    FlAdd: FlAddModal,
    Del: DelModal,
    FmAdd: FmAddModal,
    UmAdd: UmAddModal,
    MmAdd: MmAddModal,
    Del: DelModal,
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
    selectedRows = [],       // 테이블에서 선택된 row 리스트
}) {
    const [isEditing, setIsEditing] = useState(false); // 'Edit' 모드 상태 관리
    const [editableData, setEditableData] = useState(data); // 수정된 데이터 저장
    const [editingCell, setEditingCell] = useState({ row: null, col: null }); // 현재 편집 중인 셀

    // 버튼 활성화 상태 결정
    const buttonStatus = buttons.map((button) => {
        if (button === 'Delete') {
            return !isEditing && selectedRows.length > 0;   // 수정 중에는 삭제 버튼의 onRowClick 이벤트 비활성화
        }
        return true;  // 'Add' 버튼은 항상 활성화
    });

    // Edit 버튼 클릭 핸들러
    const handleEditButtonClick = () => {
        if (isEditing) {    // 저장 버튼 클릭 시
            // TODO: 데이터 저장 로직 구현하기
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    // 버튼 클릭 핸들러 수정
    const updatedOnClicks = onClicks.map((clickHandler, index) => 
        buttons[index] === 'Edit' ? handleEditButtonClick : clickHandler
    );

    const handleDoubleClick = (rowIndex, colIndex) => {
        if (isEditing) {
            setEditingCell({ row: rowIndex, col: colIndex });
        }
    };

    const handleInputChange = (e, rowIndex, colIndex) => {
        const newData = [...editableData];  // editableData 복사
        newData[rowIndex] = {
            ...newData[rowIndex],            // 해당 행 복사
            [Object.keys(newData[rowIndex])[colIndex]]: e.target.value // 특정 셀의 데이터만 업데이트
        };
        setEditableData(newData);  // 상태 업데이트
    };

    //다른 셀을 클릭하거나 테이블 외부를 클릭했을 때, 이전에 편집 중이던 셀의 편집 모드를 종료
    const handleBlur = () => {
        setEditingCell({ row: null, col: null });
    };

    return (
        <>
            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>{title}</div>
                <ButtonGroup 
                    buttons={buttons} 
                    onClicks={updatedOnClicks} 
                    buttonStatus={buttonStatus}
                    isEditing={isEditing}       //for edit button
                />
                
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
            {table ? (
            <Table 
                data={editableData} 
                variant={variant} 
                onRowClick={onRowClick} 
                handleDoubleClick={handleDoubleClick} 
                handleInputChange={handleInputChange} 
                handleBlur={handleBlur}
                editingCell={editingCell}
            />
            ) : (<></>)}
            
        </>
    );
}

export function TableCustomEditModal({
    title = "Default Title",
    variant = 'default',
    data = [],
    buttons = [],
    onClicks = [],
    onRowClick = () => { },  // 기본값으로 빈 함수 설정
    modals = [],
    table = true,
    selectedRows = [],       // 테이블에서 선택된 row 리스트
}) {
    // 버튼 활성화 상태 결정
    const buttonStatus = buttons.map((button) => {
        if (button === 'Edit' || button === 'Delete') {
            return selectedRows.length > 0;
        }
        return true;  // 'Add' 버튼은 항상 활성화
    });

    return (
        <>
            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>{title}</div>
                <ButtonGroup buttons={buttons} onClicks={onClicks} buttonStatus={buttonStatus} />
                
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
            {table ? (
            <Table data={data} variant={variant} onRowClick={onRowClick} />
            ) : (<></>)}
            
        </>
    );
}