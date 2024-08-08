import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import * as tableStyles from '../../assets/css/table.css'
import { formField_cm } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_cm_group, table_cm_code } from '../../assets/json/selectedPjt';
import PD from '../../modals/PdModal';


export default function Cm() {
    const [codeGroup, setCodeGroup] = useState([]);
    console.log(PD);

    const handleFormSubmit = (data) => {
        setCodeGroup(data);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [showTable, setShowTable] = useState(showTable ? true : false);

    const handleRowClick = () => {
        setShowTable(!showTable);
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (data) => {
        setIsModalOpen(false);
        setInputValue(data);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    }; 

    return (
        <>
            <div>
                {"시스템관리 > 코드 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_cm}/>
            <div>
                {"코드그룹ID"}
            </div>
            {/** 모달 추가 필요 */}
            <TableCustom title="코드그룹ID" data={table_cm_group} buttons={["Edit", "Delete", "Add"]} onRowClick={handleRowClick} modal={
                {
                    'buttonClick': showModal,
                    'isModalOpen': isModalOpen,
                    'handleOk': handleOk,
                    'handleCancel': handleCancel
                }
            }/>
            <div>{"코드리스트"}</div>
            {showTable ? (
                <TableCustom title="코드그룹ID" data={table_cm_code} buttons={["Edit", "Delete", "Add"]} modal={
                    {
                        'modalType' : 'PD',
                        'buttonClick': showModal,
                        'isModalOpen': isModalOpen,
                        'handleOk': handleOk,
                        'handleCancel': handleCancel
                    }
                }/>
            ) : (
                <></>
            )}
            
        </>
    );
}