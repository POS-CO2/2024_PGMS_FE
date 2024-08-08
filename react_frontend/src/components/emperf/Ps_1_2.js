import React, { useState } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData"
import InnerTabs from "../../InnerTabs";
import TableCustom from "../../TableCustom.js";

import project from "../../assets/json/selectedPjt";

export default function Ps_1_2() {
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (data) => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // 모달 관련 속성들을 하나의 객체로 묶음
    const modalProps = {
        modalType: 'Ps12',
        buttonClick: showModal,
        isModalOpen: isModalOpen,
        handleOk: handleOk,
        handleCancel: handleCancel
    };

    return (
        <div>
            <p>배출실적 &gt; 실적스코프1,2</p>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12} />
            <InnerTabs items={[
                { label: '사용량', key: '1', children: <Usage formData={formData} modalProps={modalProps} />, },
                { label: '사용금액', key: '2', children: <AmountUsed formData={formData} modalProps={modalProps} />, },
            ]} />
        </div>
    );
}


function Usage({ formData, modalProps }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    const onUploadExcelClick = () => {
        console.log("onUploadExcelClick");
    };
    const onDownloadExcelFormClick = () => {
        console.log("onDownloadExcelFormClick");
    };

    return (
        <div>
            <TableCustom
                title="실적목록"
                data={project}
                buttons={['UploadExcel', 'DownloadExcelForm']}
                onClicks={{onUploadExcelClick, onDownloadExcelFormClick}}
                modal={
                    modalProps
                } />
        </div>
    )
}

function AmountUsed({ formData, modalProps }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    const formDataForTable = Object.entries(formData).map(([key, value]) => {
        return { key: key, value: value != null ? value.toString() : '' };
    })
    return (
        <div>
            <TableCustom
                title="실적목록"
                data={formDataForTable}
                buttons={['UploadExcel', 'DownloadExcelForm']}
                modal={
                    modalProps
                }
            />
        </div>
    )
}