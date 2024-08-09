import React, { useState } from 'react';
import SearchForms from "../../SearchForms";
import { formField_ps12 } from "../../assets/json/searchFormData"
import InnerTabs from "../../InnerTabs";
import TableCustom from "../../TableCustom.js";

import project from "../../assets/json/selectedPjt";

export default function Ps_1_2() {
    const [formData, setFormData] = useState({});

    const handleFormSubmit = (data) => {
        setFormData(data);
    };

    return (
        <div>
            <p>배출실적 &gt; 실적스코프1,2</p>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12} />
            <InnerTabs items={[
                { label: '사용량', key: '1', children: <Usage formData={formData} />, },
                { label: '사용금액', key: '2', children: <AmountUsed formData={formData} />, },
            ]} />
        </div>
    );
}


function Usage({ formData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    const [isModalOpen, setIsModalOpen] = useState({
        Ps12: false,
        PD: false
    });
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };
    // modalType에 따라 결과 처리 해주기
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const onUploadExcelClick = () => {
        console.log("onUploadExcelClick");
        showModal('Ps12');
    };
    const onDownloadExcelFormClick = () => {
        console.log("onDownloadExcelFormClick");
        showModal('PD');
    };

    return (
        <div>
            <TableCustom
                title="실적목록"
                data={project}
                buttons={['UploadExcel', 'DownloadExcelForm']}
                onClicks={[onUploadExcelClick, onDownloadExcelFormClick]}
                modals={[
                    {
                        modalType: 'Ps12',
                        //buttonClick: showModal('Ps12'),
                        isModalOpen: isModalOpen.Ps12,
                        handleOk: handleOk('Ps12'),
                        handleCancel: handleCancel('Ps12'),
                    }, {
                        modalType: 'PD',
                        //buttonClick: showModal('PD'),
                        isModalOpen: isModalOpen.PD,
                        handleOk: handleOk('PD'),
                        handleCancel: handleCancel('PD'),
                    }
                ]}
            />
        </div>
    )
}

function AmountUsed({ formData }) {
    if (!formData || Object.keys(formData).length === 0) {
        return <p>검색조건을 선택하세요</p>
    }

    const formDataForTable = Object.entries(formData).map(([key, value]) => {
        return { key: key, value: value != null ? value.toString() : '' };
    })

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        // 결과 처리
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onUploadExcelClick = () => {
        console.log("onUploadExcelClick2");
        showModal();
    };
    const onDownloadExcelFormClick = () => {
        console.log("onDownloadExcelFormClick2");
    };

    return (
        <div>
            <TableCustom
                title="실적목록"
                data={formDataForTable}
                buttons={['UploadExcel', 'DownloadExcelForm']}
                onClicks={[onUploadExcelClick, onDownloadExcelFormClick]}
                modals={[
                    {
                        modalType: 'Ps12',
                        isModalOpen: isModalOpen,
                        handleOk: handleOk,
                        handleCancel: handleCancel
                    }
                ]}
            />
        </div>
    )
}