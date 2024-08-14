import React, { useState } from "react";
import { AddButton, UploadExcelButton } from "../../../Button";
import { SdAddModal, Ps12UploadExcelModal } from "../../../modals/PdModal";
/*
import * as tableStyles from "../../../assets/css/newTable.css"
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import project from "../../../assets/json/selectedPjt";
import managers from "../../../assets/json/manager";
import SearchForms from "../../../SearchForms";
import { formField_sd } from "../../../assets/json/searchFormData.js";
*/

export default function Sd() {
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
    const onAddClick = () => { // 모달 여는 버튼
        console.log("onAddClick");
        showModal();
    };

    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    const handleOk2 = (data) => {
        // 결과 처리
        setIsModalOpen2(false);
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };
    const onUploadExcelClick = () => { // 모달 여는 버튼
        console.log("onUploadExcelClick");
        showModal2();
    };

    return (
        <div>
            <h2>증빙자료 관리</h2>

            <AddButton onClick={onAddClick} />

            <SdAddModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            <UploadExcelButton onClick={onUploadExcelClick} />

            <Ps12UploadExcelModal
                isModalOpen={isModalOpen2}
                handleOk={handleOk2}
                handleCancel={handleCancel2}
            />
        </div>
    );
}