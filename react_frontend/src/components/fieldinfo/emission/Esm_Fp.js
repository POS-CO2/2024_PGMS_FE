import React, { useState, useEffect } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table.js";
import TableCustom from "../../../TableCustom.js";
import { ButtonGroup } from "../../../Button.js";
import * as sysStyles from '../../../assets/css/sysmng.css';
import * as mainStyle from '../../../assets/css/main.css';
import * as esmStyles from '../../../assets/css/esm.css';
import { Card } from '@mui/material';
import { Select } from 'antd';
import SearchForms from "../../../SearchForms.js";
import { formField_esm } from "../../../assets/json/searchFormData.js";
import { SdAddModal, DeleteModal, SdShowDetailsModal } from "../../../modals/PdModal.js";
import axiosInstance from '../../../utils/AxiosInstance.js';
import { pjtColumns, equipEmissionColumns, equipDocumentColumns } from '../../../assets/json/tableColumn.js';

export default function Esm_Fp() {
    const [formData, setFormData] = useState({});

    const [showResults, setShowResults] = useState(false);            // 조회결과를 표시할지 여부
    const [selectedPjt, setSelectedPjt] = useState([]);               // 선택된 프로젝트
    const [emtns, setEmtns] = useState([]);                           // 배출원 목록
    const [selectedEmtn, setSelectedEmtn] = useState(null);           // 선택된 배출원
    const [showSds, setShowSds] = useState(false);                    // 증빙자료 목록을 표시할지 여부
    const [sds, setSds] = useState([]);                               // 증빙자료 목록
    const [selectedSd, setSelectedSd] = useState({});               // 선택된 증빙자료
    const [selectedYear, setSelectedYear] = useState(null); // 선택된 연도

    const [yearSelectOptions, setYearSelectOptions] = useState([]);
    useEffect(() => {
        if (selectedPjt.length > 0) {
            const yearOptions = [];
            const currentYear = new Date().getFullYear();
            const ctrtFrYear = selectedPjt[0].ctrtFrYear;
            const ctrtToYear = Math.min(selectedPjt[0].ctrtToYear, currentYear);
    
            for (let year = ctrtToYear; year >= ctrtFrYear; year--) {
                yearOptions.push({ value: year.toString(), label: year.toString() });
            }
    
            setYearSelectOptions(yearOptions);
            setSelectedYear(yearOptions[0].value);

            setSelectedEmtn(null);
            setSds([]);
            setShowSds(false);
            setSelectedSd({});
        }
    }, [selectedPjt]);

    const [buttonStatus, setButtonStatus] = useState([false, false, false]);
    useEffect(() => {
        if (Object.keys(selectedSd).length === 0) {
            setButtonStatus([false, false, true]); // Add만 활성화
        } else {
            setButtonStatus([true, true, true]); // 모든 버튼 활성화
        }
    }, [selectedSd]);

    const [isModalOpen, setIsModalOpen] = useState({
        EsmAdd: false, // 배출원 등록
        SdAdd: false, // 증빙자료 등록
        SdShowDetails: false, // 증빙자료 상세보기
        DeleteA: false, // 배출원 삭제
        DeleteB: false, // 증빙자료 삭제
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
        if (row) {
            setSelectedSd(row);
        } else {
            setSelectedSd({});
        }
    };

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };
    // modalType에 따라 결과 처리 해주기
    const handleOk = (modalType) => async (data, closeModal = true) => {
        if (closeModal) {
            setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        }

        if (modalType === 'EsmAdd') {
            console.log(data);
            setEmtns(prevList => [...prevList, ...data]); // 선택된 프로젝트 데이터를 상태로 저장
            console.log(emtns);
        }
        
        else if (modalType === 'DeleteA') {
            setEmtns(prevList => prevList.filter(emtns => emtns.id !== data.id));
            setSelectedEmtn(null);
        }

        else if (modalType === 'SdAdd') {
            // 선택된 프로젝트 데이터를 상태로 저장, data가 배열이 아닌 경우 배열로 변환하여 추가
            setSds(prevList => [...prevList, ...(Array.isArray(data) ? data : [data])]);

            let url = `/equip/emission?projectId=${selectedPjt[0].id}`;
            const emtnData = await axiosInstance.get(url);
            setEmtns(emtnData.data);
        }

        else if (modalType === 'SdShowDetails') {
            // 기존 데이터 중 선택된 Sd를 업데이트
            setSds(prevList => prevList.map(sd => sd.id === data.id ? data : sd));

            // 선택된 증빙자료 업데이트
            const updatedSd = sds.find(sd => sd.id === data.id);
            if (updatedSd) {
                setSelectedSd(updatedSd);
            }
        }

        else if (modalType === 'DeleteB') {
            setSds(prevList => {
                const updatedList = prevList.filter(sd => sd.id !== data.id);
                setSelectedSd({}); // 선택된 증빙자료 해제
                return updatedList;
            });

            let url = `/equip/emission?projectId=${selectedPjt[0].id}`;
            const emtnData = await axiosInstance.get(url);
            setEmtns(emtnData.data);
        }
        
    };
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const onEmsAddClick = () => {
        showModal('EsmAdd');
    };
    const onEmsDeleteClick = () => {
        showModal('DeleteA');
    };

    const onSdAddClick = () => {
        showModal('SdAdd');
    };
    const onSdDeleteClick = () => {
        showModal('DeleteB');
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
                {"현장정보 > 배출원 > 배출원 관리 현장현장"}
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
                                        modalType: 'DeleteA',
                                        isModalOpen: isModalOpen.DeleteA,
                                        handleOk: handleOk('DeleteA'),
                                        handleCancel: handleCancel('DeleteA'),
                                        rowData: selectedEmtn,
                                        rowDataName: "equipName",
                                        url: '/equip/emission',
                                    }
                                ]}
                                selectedRows={[selectedEmtn]}
                                keyProp={emtns.length}
                            />
                        </Card>
                        
                        <Card className={sysStyles.card_box} sx={{ width: "50%", borderRadius: "15px" }}>
                            <div className={tableStyles.table_title}>
                                {"증빙자료 목록"}
                            </div>
                            
                            {showSds ? (
                                <>
                                    <div className={esmStyles.select_button_container}>
                                        <Select defaultValue={selectedYear} onChange={handleYearChange}>
                                            {yearSelectOptions.map(option => (
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
                                    <Table data={sds} onRowClick={handleSdClick} columns={equipDocumentColumns} key={sds.length}/>

                                    <SdAddModal
                                        isModalOpen={isModalOpen.SdAdd}
                                        handleOk={handleOk('SdAdd')}
                                        handleCancel={handleCancel('SdAdd')}
                                        rowData={selectedEmtn}
                                        yearSelectOptions={yearSelectOptions}
                                    />
                                    <DeleteModal
                                        isModalOpen={isModalOpen.DeleteB}
                                        handleOk={handleOk('DeleteB')}
                                        handleCancel={handleCancel('DeleteB')}
                                        rowData={selectedSd}
                                        rowDataName="name"
                                        url='/equip/document'
                                    />
                                    <SdShowDetailsModal
                                        selectedSd={selectedSd}
                                        isModalOpen={isModalOpen.SdShowDetails}
                                        handleOk={handleOk('SdShowDetails')}
                                        handleCancel={handleCancel('SdShowDetails')}
                                        yearSelectOptions={yearSelectOptions}
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