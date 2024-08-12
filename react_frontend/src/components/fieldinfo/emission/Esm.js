import React, { useState } from "react";
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import project from "../../../assets/json/selectedPjt";
import emsData from "../../../assets/json/ems";
import SearchForms from "../../../SearchForms";
import { formField_esm } from "../../../assets/json/searchFormData.js";

export default function Esm() {
    const [formData, setFormData] = useState({});

    const [showResults, setShowResults] = useState(false);            // 조회결과와 담당자목록을 표시할지 여부
    const [selectedPjt, setSelectedPjt] = useState(null);             // 선택된 프로젝트 코드
    const [selectedEmtns, setSelectedEmtns] = useState([]);          // 선택된 배출원

    const [isModalOpen, setIsModalOpen] = useState({
        EsmAdd: false, // 모달1
        EsmDelete: false // 모달2
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
        setSelectedEmtns(row.equipName);
    };

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };
    // modalType에 따라 결과 처리 해주기
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        // 데이터 전달 로직은 각자 구현하기
    };
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const onAddClick = () => {
        showModal('EsmAdd');
    };
    const onDeleteClick = () => {
        showModal('EsmDelete');
    };

    return (
        <>
            <div className={tableStyles.menu}>현장정보 &gt; 배출원 &gt; 배출원 지정</div>

            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_esm} />

            {/* showResults 상태가 true일 때만 결과를 표시 */}
            {showResults && (
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table data={project} onRowClick={handlePjtClick} />



                    <div className={esmStyles.resultContent}>
                        <div className={esmStyles.leftSide}>
                            <TableCustom
                                title='배출원목록'
                                data={emsData}
                                buttons={['Delete', 'Add']}
                                onClicks={[onDeleteClick, onAddClick]}
                                onRowClick={handleEmtnClick}
                                modals={[
                                    {
                                        modalType: 'EsmAdd',
                                        isModalOpen: isModalOpen.EsmAdd,
                                        handleOk: handleOk('EsmAdd'),
                                        handleCancel: handleCancel('EsmAdd'),
                                    }, {
                                        modalType: 'EsmDelete',
                                        isModalOpen: isModalOpen.EsmDelete,
                                        handleOk: handleOk('EsmDelete'),
                                        handleCancel: handleCancel('EsmDelete'),
                                    }
                                ]}
                            />
                        </div>

                        <div className={esmStyles.divider} /> {/* 구분선 추가 */}

                        <div className={esmStyles.rightSide}>
                        <TableCustom
                                title='증빙자료 목록'
                                data={emsData}
                                buttons={['Delete', 'Add']}
                                onClicks={[onDeleteClick, onAddClick]}
                                onRowClick={handleEmtnClick}
                                modals={[
                                    {
                                        modalType: 'EsmAdd',
                                        isModalOpen: isModalOpen.EsmAdd,
                                        handleOk: handleOk('EsmAdd'),
                                        handleCancel: handleCancel('EsmAdd'),
                                    }, {
                                        modalType: 'EsmDelete',
                                        isModalOpen: isModalOpen.EsmDelete,
                                        handleOk: handleOk('EsmDelete'),
                                        handleCancel: handleCancel('EsmDelete'),
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}