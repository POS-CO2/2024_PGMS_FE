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
import project from "../../../assets/json/selectedPjt";
import emsData from "../../../assets/json/ems";
import sdData from "../../../assets/json/sd";
import SearchForms from "../../../SearchForms";
import { formField_esm } from "../../../assets/json/searchFormData.js";
import { SdAddModal, DelModal, SdShowDetailsModal } from "../../../modals/PdModal";

const selectOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' }
];

export default function Esm() {
    const [formData, setFormData] = useState({});

    const [showResults, setShowResults] = useState(false);            // 조회결과와 담당자목록을 표시할지 여부
    const [selectedPjt, setSelectedPjt] = useState(null);             // 선택된 프로젝트 코드
    const [selectedEmtn, setSelectedEmtn] = useState(null);           // 선택된 배출원
    const [selectedSd, setSelectedSd] = useState(null);               // 선택된 증빙자료
    const [showSds, setShowSds] = useState(false);

    const [buttonStatus, setButtonStatus] = useState([false, false, false]);
    useEffect(() => {
        // selectedSd가 null인지 여부에 따라 버튼 상태를 설정합니다.
        if (selectedSd === null) {
            setButtonStatus([false, false, true]); // Add만 활성화
        } else {
            setButtonStatus([true, true, true]); // 모든 버튼 활성화
        }
    }, [selectedSd]);

    const [isModalOpen, setIsModalOpen] = useState({
        EsmAdd: false, // 배출원 등록
        SdAdd: false, // 증빙자료 등록
        SdShowDetails: false, // 증빙자료 상세보기
        Del: false
    });

    const handleFormSubmit = (data) => {
        setFormData(data);

        if (data && Object.keys(data).length !== 0) {
            setShowResults(true);
        }
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (row) => {
        setSelectedPjt(row.PjtCode);   // 클릭된 프로젝트의 코드로 상태를 설정
    };
    // 배출원 row 클릭 시 호출될 함수
    const handleEmtnClick = (row) => {
        setSelectedEmtn(row.equipName);
        setShowSds(true);
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
        // 데이터 전달 로직은 각자 구현하기
        console.log(data);
    };
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const onEmsAddClick = () => {
        showModal('EsmAdd');
    };
    const onEmsDeleteClick = () => {
        showModal('Del');
    };

    const onSdAddClick = () => {
        showModal('SdAdd');
    };
    const onSdDeleteClick = () => {
        showModal('Del');
    };
    const onSdShowDetailsClick = () => {
        showModal('SdShowDetails');
    };

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"현장정보 > 배출원 > 배출원 지정"}
            </div>

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_esm} />

            {/* showResults 상태가 true일 때만 결과를 표시 */}
            {showResults && (
                <>
                    <div className={esmStyles.main_grid}>
                        <Card sx={{ width: "100%", height: "auto", borderRadius: "15px", marginBottom: "1rem" }}>
                            <div className={tableStyles.table_title}>조회결과</div>
                            <Table data={project} onRowClick={handlePjtClick} />
                        </Card>
                    </div>

                    <div className={sysStyles.main_grid}>
                        <Card className={sysStyles.card_box} sx={{ width: "50%", height: "100vh", borderRadius: "15px" }}>
                            <div className={sysStyles.mid_title}>
                                {"배출원목록"}
                            </div>
                            <TableCustom
                                title=""
                                data={emsData}
                                buttons={['Delete', 'Add']}
                                onClicks={[onEmsDeleteClick, onEmsAddClick]}
                                onRowClick={handleEmtnClick}
                                modals={[
                                    {
                                        modalType: 'EsmAdd',
                                        isModalOpen: isModalOpen.EsmAdd,
                                        handleOk: handleOk('EsmAdd'),
                                        handleCancel: handleCancel('EsmAdd'),
                                    }, {
                                        modalType: 'Del',
                                        isModalOpen: isModalOpen.Del,
                                        handleOk: handleOk('Del'),
                                        handleCancel: handleCancel('Del'),
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
                                        <Select defaultValue="2024">
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
                                    <Table data={sdData} variant='default' onRowClick={handleSdClick} />

                                    <SdAddModal
                                        isModalOpen={isModalOpen.SdAdd}
                                        handleOk={handleOk('SdAdd')}
                                        handleCancel={handleCancel('SdAdd')}
                                    />
                                    <DelModal
                                        isModalOpen={isModalOpen.Del}
                                        handleOk={handleOk('Del')}
                                        handleCancel={handleCancel('Del')}
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