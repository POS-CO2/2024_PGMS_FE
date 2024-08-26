import React, { useState, useEffect } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import { ButtonGroup } from "../../../Button";
import * as sysStyles from '../../../assets/css/sysmng.css';
import * as mainStyle from '../../../assets/css/main.css';
import * as esmStyles from '../../../assets/css/esm.css';
import { Card } from '@mui/material';
import { Select } from 'antd';
import SearchForms from "../../../SearchForms";
import { formField_esm } from "../../../assets/json/searchFormData.js";
import { SdAddModal, DeleteModal, SdShowDetailsModal } from "../../../modals/PdModal";
import axiosInstance from '../../../utils/AxiosInstance';
import { pjtColumns, equipEmissionColumns, equipDocumentColumns } from '../../../assets/json/tableColumn';

const selectOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' }
];

export default function Esm() {
    const [formData, setFormData] = useState({});

    const [showResults, setShowResults] = useState(false);            // 조회결과를 표시할지 여부
    const [selectedPjt, setSelectedPjt] = useState([]);               // 선택된 프로젝트
    const [emtns, setEmtns] = useState([]);                           // 배출원 목록
    const [selectedEmtn, setSelectedEmtn] = useState(null);           // 선택된 배출원
    const [showSds, setShowSds] = useState(false);                    // 증빙자료 목록을 표시할지 여부
    const [sds, setSds] = useState([]);                               // 증빙자료 목록
    const [selectedSd, setSelectedSd] = useState(null);               // 선택된 증빙자료
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // 선택된 연도

    const [buttonStatus, setButtonStatus] = useState([false, false, false]);
    useEffect(() => {
        // selectedSd가 null인지 여부에 따라 버튼 상태를 설정합니다.
        if (selectedSd === null) {
            setButtonStatus([false, false, true]); // Add만 활성화
        } else if (selectedSd.length === 1) {
            setButtonStatus([true, true, true]); // 모든 버튼 활성화
        } else { // 여러개 선택된 경우
            setButtonStatus([false, true, true]); // 삭제, 등록 활성화
        }
    }, [selectedSd]);

    const [isModalOpen, setIsModalOpen] = useState({
        EsmAdd: false, // 배출원 등록
        SdAdd: false, // 증빙자료 등록
        SdShowDetails: false, // 증빙자료 상세보기
        Delete: false
    });

    const handleFormSubmit = async (param) => {
        setSelectedPjt([param.searchProject]);

        let url = `/equip/emission?projectId=${param.searchProject.id}`;
        const emtnData = await axiosInstance.get(url);
        setEmtns(emtnData.data);

        if (param && Object.keys(param).length !== 0) {
            setShowResults(true);
        }
    };

    // 배출원 row 클릭 시 호출될 함수
    const handleEmtnClick = async (row) => {
        setSelectedEmtn(row);
        
        if (row) {
            let url = `/equip/document?actvYear=${selectedYear}&emissionId=${row.id}`;
            const sdData = await axiosInstance.get(url);
            setSds(sdData.data);
            setShowSds(true);
        } else {
            setSds([]);
            setShowSds(false);
        }
    };

    // 증빙자료 row 클릭 시 호출될 함수
    const handleSdClick = (row) => {
        setSelectedSd(row);
        console.log(selectedSd);
    };

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };
    // modalType에 따라 결과 처리 해주기
    const handleOk = (modalType) => (data, closeModal = true) => {
        if (closeModal) {
            setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        }

        if (modalType === 'EsmAdd') {
            console.log(data);
            setEmtns(prevList => [...prevList, ...data]); // 선택된 프로젝트 데이터를 상태로 저장
            console.log(emtns);
        }
        
        else if (modalType === 'Delete') {
            setEmtns(prevList => prevList.filter(emtns => emtns.id !== data.id));
            setSelectedEmtn(null);
        }
        
    };
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const onEmsAddClick = () => {
        showModal('EsmAdd');
    };
    const onEmsDeleteClick = () => {
        showModal('Delete');
    };

    const onSdAddClick = () => {
        showModal('SdAdd');
    };
    const onSdDeleteClick = () => {
        showModal('Delete');
    };
    const onSdShowDetailsClick = () => {
        showModal('SdShowDetails');
    };

    // 연도 선택 시 호출될 함수
    const handleYearChange = async (value) => {
        setSelectedYear(value);

        if (selectedEmtn) {
            let url = `/equip/document?actvYear=${value}&emissionId=${selectedEmtn.id}`;
            const sdData = await axiosInstance.get(url);
            setSds(sdData.data);
        }
    };

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"현장정보 > 배출원 > 배출원 관리"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_esm} />

            {/* showResults 상태가 true일 때만 결과를 표시 */}
            {showResults && (
                <>
                    <div className={esmStyles.main_grid}>
                        <Card sx={{ width: "100%", height: "auto", borderRadius: "15px", marginBottom: "1rem" }}>
                            <TableCustom title="조회결과" columns={pjtColumns} data={selectedPjt} pagination={false} />
                        </Card>
                    </div>

                    <div className={sysStyles.main_grid}>
                        <Card className={sysStyles.card_box} sx={{ width: "50%", height: "100vh", borderRadius: "15px" }}>
                            <TableCustom
                                title="배출원목록"
                                columns={equipEmissionColumns}
                                data={emtns}
                                buttons={['Delete', 'Add']}
                                onClicks={[onEmsDeleteClick, onEmsAddClick]}
                                onRowClick={handleEmtnClick}
                                modals={[
                                    {
                                        modalType: 'EsmAdd',
                                        isModalOpen: isModalOpen.EsmAdd,
                                        handleOk: handleOk('EsmAdd'),
                                        handleCancel: handleCancel('EsmAdd'),
                                        rowData: selectedPjt,
                                    }, {
                                        modalType: 'Delete',
                                        isModalOpen: isModalOpen.Delete,
                                        handleOk: handleOk('Delete'),
                                        handleCancel: handleCancel('Delete'),
                                        rowData: selectedEmtn,
                                        rowDataName: "equipName",
                                        url: '/equip/emission',
                                    }
                                ]}
                                selectedRows={[selectedEmtn]}
                            />
                        </Card>
                        
                        <Card className={sysStyles.card_box} sx={{ width: "50%", borderRadius: "15px" }}>
                            <div className={sysStyles.mid_title}>
                                {"증빙자료 목록"}
                            </div>
                            
                            {showSds ? (
                                <>
                                    <div className={esmStyles.select_button_container}>
                                        <Select defaultValue={selectedYear} onChange={handleYearChange}>
                                            {selectOptions.map(option => (
                                                <Select.Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                        <ButtonGroup
                                            buttons={['ShowDetails', 'Delete', 'Add']}
                                            onClicks={[onSdShowDetailsClick, onSdDeleteClick, onSdAddClick]}
                                            buttonStatus={buttonStatus} />
                                    </div>
                                    <Table data={sds} variant='checkbox' onRowClick={handleSdClick} columns={equipDocumentColumns} />

                                    <SdAddModal
                                        isModalOpen={isModalOpen.SdAdd}
                                        handleOk={handleOk('SdAdd')}
                                        handleCancel={handleCancel('SdAdd')}
                                    />
                                    <DeleteModal
                                        isModalOpen={isModalOpen.Delete}
                                        handleOk={handleOk('Delete')}
                                        handleCancel={handleCancel('Delete')}
                                    />
                                    <SdShowDetailsModal
                                        selectedSd={selectedSd}
                                        isModalOpen={isModalOpen.SdShowDetails}
                                        handleOk={handleOk('SdShowDetails')}
                                        handleCancel={handleCancel('SdShowDetails')}
                                    />
                                </>
                            )
                                : (
                                    <></>
                                )}

                        </Card>
                    </div>
                </>
            )}
        </>
    );
}