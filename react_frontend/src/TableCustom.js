import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { DelModal, PgAddModal, PdAddModal, RmAddModal, FlAddModal, FlEditModal, FamAddModal, FamEditModal, FadAddModal, Ps12UploadExcelModal, CmAddModal, DeleteModal, CmEditModal, CmListAddModal, CmListEditModal, FmAddModal, UmAddModal, MmAddModal, EsmAddModal, SdAddModal, SdShowDetailsModal } from "./modals/PdModal.js";
import { ButtonGroup } from './Button';
import axiosInstance from './utils/AxiosInstance';

const modalMap = {
    CMAdd: CmAddModal,
    CMEdit: CmEditModal,
    CMListAdd: CmListAddModal,
    CMListEdit: CmListEditModal,
    Delete: DeleteModal,
    DeleteA: DeleteModal, // 한페이지에 모달이 두개 있을 경우...
    DeleteB: DeleteModal,
    Ps12UploadExcel: Ps12UploadExcelModal,
    PgAdd: PgAddModal,
    PdAdd: PdAddModal,
    RmAdd: RmAddModal,
    FlAdd: FlAddModal,
    FlEdit: FlEditModal,
    FamAdd: FamAddModal,
    FamEdit: FamEditModal,
    FadAdd: FadAddModal,
    Del: DelModal,
    FmAdd: FmAddModal,
    UmAdd: UmAddModal,
    MmAdd: MmAddModal,
    EsmAdd: EsmAddModal,
    SdAdd: SdAddModal,
    SdShowDetails: SdShowDetailsModal
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
    pagination = true,        // 테이블 페이지네이션 디폴트는 페이지네이션 하는걸로.
    columns = [],
    modalPagination = false
}) {
    // 버튼 활성화 상태 결정
    
    const buttonStatus = buttons.map((button) => {
        if (button === 'Edit' || button === 'Delete') {
            if (selectedRows.includes(null) || selectedRows.includes(undefined)) {  // 선택한 row가 없으면 삭제 버튼의 onRowClick 이벤트 비활성화(variant='default')
                return false;                               
            } else {
                return selectedRows.length > 0;             // 선택된 row가 있으면 delete 버튼 활성화(variant='checkbox')
            }
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
                            key={modal.modalType} // warning 삭제
                            isModalOpen={modal.isModalOpen}
                            handleOk={modal.handleOk || (() => {})}
                            handleCancel={modal.handleCancel || (() => {})}
                            onRowClick={onRowClick}
                            rowData={modal.rowData}
                            dropDown={modal.dropDown || []}
                            rowDataName={modal.rowDataName}
                            url={modal.url || ""}
                        />
                    ) : null;
                })}
            </div>
            {table ? (
            <Table key={JSON.stringify(data)} data={data} variant={variant} onRowClick={onRowClick} pagination={pagination} modalPagination={modalPagination} columns={columns}/>
            ) : (<></>)}
            
        </>
    );
}

export function TableCustomDoubleClickEdit({
    title = "Default Title",
    variant = 'default',
    data = [],
    buttons = [],
    onClicks = [],
    onRowClick = () => { },  // 기본값으로 빈 함수 설정
    selectedRows = [],       // 테이블에서 선택된 row 리스트
    rowData = {},
    modals = [],
    table = true,
    columns = [],
    pagination = true,
    modalPagination = false,
}) {
    const [isEditing, setIsEditing] = useState(false); // 'Edit' 모드 상태 관리
    const [editableData, setEditableData] = useState(data); // 수정된 데이터 저장
    const [editingCell, setEditingCell] = useState({ row: null, col: null }); // 현재 편집 중인 셀
    const [editedRows, setEditedRows] = useState([]); // 수정된 행의 인덱스 추적

    // data가 나중에 전달되거나 변경될 때 editableData도 자동으로 업데이트
    useEffect(() => {
        setEditableData(data);
    }, [data]);

    // 버튼 활성화 상태 결정
    const buttonStatus = buttons.map((button) => {
        if (button === 'Delete') {
            if (selectedRows.includes(null) || selectedRows.includes(undefined)) {  // 수정 중이거나 선택한 row 가 없으면 삭제 버튼의 onRowClick 이벤트 비활성화
                return false;                               
            } else {
                return selectedRows.length > 0;             // 선택된 row가 있으면 delete 버튼 활성화
            }
        }
        return true;  // 'Add' 버튼은 항상 활성화
    });

    // Edit 버튼 클릭 핸들러
    const handleEditButtonClick = async () => {
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (isEditing) {    // 저장 버튼 클릭 시
            const updatedRows = editedRows.map(index => editableData[index]);

            try {
                const requestBody = updatedRows.map(row => ({
                    id: row.id,
                    pjtId: rowData.pjtId,
                    year: row['년'],
                    mth: row['월'],
                    salesAmt: row['매출액']
                }));

                const response = await axiosInstance.put("/pjt/sales", requestBody);

                swalOptions.title = '성공!',
                swalOptions.text = '매출액이 성공적으로 수정되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                swalOptions.title = '실패!',
                swalOptions.text = '매출액 수정에 실패하였습니다.';
                swalOptions.icon = 'error';

                // if(error.response.status === 400) {
                //     swalOptions.text = `이미 ${error.config.data}에 등록된 매출액이 존재합니다.`;
                // }
            }
            setIsEditing(false);
            setEditedRows([]);
            Swal.fire(swalOptions);
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
            [Object.keys(newData[rowIndex])[colIndex+1]]: e.target.value // 특정 셀의 데이터만 업데이트(id 컬럼으로 인해 colIndex+1)
        };

        // 수정된 행의 인덱스를 추가
        if (!editedRows.includes(rowIndex)) {
            setEditedRows([...editedRows, rowIndex]);
        }

        setEditableData(newData);  // 상태 업데이트
    }

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
                            key={modal.modalType}
                            isModalOpen={modal.isModalOpen}
                            handleOk={modal.handleOk || (() => {})}
                            handleCancel={modal.handleCancel || (() => {})}
                            onRowClick={onRowClick}
                            rowData={modal.rowData}
                        />
                    ) : null;
                })}
            </div>
            {table ? (
            <Table 
                key={JSON.stringify(data)}
                data={editableData} 
                columns={columns}
                variant={variant} 
                onRowClick={onRowClick} 
                handleDoubleClick={handleDoubleClick} 
                handleInputChange={handleInputChange} 
                handleBlur={handleBlur}
                editingCell={editingCell}
                pagination={pagination}
            />
            ) : (<></>)}
            
        </>
    );
}