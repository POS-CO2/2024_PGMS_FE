import React, { useState } from 'react';
import { Modal, Select } from 'antd';
import * as modalStyles from "../assets/css/SdAddModal.css";
import Table from "../Table";
import { AddButton } from "../Button";
import sdData from "../assets/json/sd";

const selectOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' }
];

export default function EsmAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedSd, setSelectedSd] = useState();

    const onAddClick = () => { // 증빙자료 등록 버튼
        console.log("onAddClick");
    };

    // 배출원 row 클릭 시 호출될 함수
    const handleSdClick = (row) => {
        setSelectedSd(row.name);
        console.log(selectedSd);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={900}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.modalContent}>
                <div className={modalStyles.leftSide}>
                    <div className={modalStyles.title}>증빙서류 목록</div>

                    <div className={modalStyles.headerContainer}>
                        <Select defaultValue="2024">
                            {selectOptions.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>

                        <AddButton onClick={onAddClick} />
                    </div>

                    <div className={modalStyles.table_container}>
                        <Table data={sdData} onRowClick={handleSdClick} />
                    </div>
                </div>

                <div className={modalStyles.divider} /> {/* 구분선 추가 */}

                <div className={modalStyles.rightSide}>
                    <div className={modalStyles.title}>증빙서류 등록</div>

                    <div className={modalStyles.search_container}>
                        <div className={modalStyles.search_item}>
                            <div className={modalStyles.search_title}>대상년월</div>
                            <input
                                className={modalStyles.search}
                                /*value={pjtCode}
                                onChange={(e) => setPjtCode(e.target.value)}*/
                            />
                        </div>
                        <div className={modalStyles.search_item}>
                            <div className={modalStyles.search_title}>자료명</div>
                            <input
                                className={modalStyles.search}
                                /*value={pjtName}
                                onChange={(e) => setPjtName(e.target.value)}*/
                            />
                        </div>
                        <div className={modalStyles.search_item}>
                            <div className={modalStyles.search_title}>비고</div>
                            <input
                                className={modalStyles.search}
                                /*value={year}
                                onChange={(e) => setYear(e.target.value)}*/
                            />
                        </div>
                        <div className={modalStyles.search_item}>
                            <div className={modalStyles.search_title}>첨부파일</div>
                            <input
                                className={modalStyles.search}
                                /*value={month}
                                onChange={(e) => setMonth(e.target.value)}*/
                            />
                        </div>
                    </div>

                    <button className={modalStyles.select_button} /*onClick={handleSelect}*/>저장</button>

                </div>
            </div>
        </Modal>
    )
}