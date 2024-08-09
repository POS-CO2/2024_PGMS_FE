import React, { useState } from 'react';
import SearchForms from '../../SearchForms';
import * as tableStyles from '../../assets/css/table.css'
import { formField_cm } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_cm_group, table_cm_code } from '../../assets/json/selectedPjt';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';


export default function Cm() {
    const [codeGroup, setCodeGroup] = useState([]);

    const handleFormSubmit = (data) => {
        setCodeGroup(data);
    }

    const [isModalOpen, setIsModalOpen] = useState({
        CMAdd: false,
        CMEdit: false,
        Delete: false,
        CMListAdd: false,
        CMListEdit: false,
    });
    const [inputValue, setInputValue] = useState("");
    const [showTable, setShowTable] = useState(false);

    const handleRowClick = () => {
        setShowTable(true);
    }

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({...prevState, [modalType]: true}));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    }; 

    const handleAddClick = () => {
        showModal('CMAdd');
    }

    const handleEditClick = () => {
        showModal('CMEdit');
    }

    const handleDeleteClick = () => {
        showModal('Delete');
    }

    const handleListAddClick = () => {
        showModal('CMListAdd');
    }

    const handleListEditClick = () => {
        showModal('CMListEdit');
    }

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 코드 관리"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_cm} />
            <div className={sysStyles.main_grid}>
            <Card className={sysStyles.card_box} sx={{width:"50%", height:"100vh"}}>
            <div className={sysStyles.mid_title}>
                {"코드그룹ID"}
            </div>
            {/** 모달 추가 필요 */}
            <TableCustom title="" data={table_cm_group} buttons={["Add", "Edit", "Delete"]} onRowClick={handleRowClick} onClicks={[handleAddClick, handleEditClick, handleDeleteClick]} modals={
                [
                    {
                        "modalType" : 'CMAdd',
                        'isModalOpen': isModalOpen.CMAdd,
                        'handleOk': handleOk('CMAdd'),
                        'handleCancel': handleCancel('CMAdd')
                    },
                    {
                        "modalType" : 'CMEdit',
                        'isModalOpen': isModalOpen.CMEdit,
                        'handleOk': handleOk('CMEdit'),
                        'handleCancel': handleCancel('CMEdit')
                    },
                    {
                        "modalType" : 'Delete',
                        'isModalOpen': isModalOpen.Delete,
                        'handleOk': handleOk('Delete'),
                        'handleCancel': handleCancel('Delete')
                    },

                ]
            }/>
            </Card>
            <Card className={sysStyles.card_box} sx={{width:"50%"}}>
            <div className={sysStyles.mid_title}>{"코드리스트"}</div>
            {showTable ? (
                <TableCustom title="" data={table_cm_code} buttons={["Add", "Edit", "Delete"]} onRowClick={handleRowClick} onClicks={[handleListAddClick, handleListEditClick, handleDeleteClick]} modals={
                    [
                        {
                            "modalType" : 'CMListAdd',
                            'isModalOpen': isModalOpen.CMListAdd,
                            'handleOk': handleOk('CMListAdd'),
                            'handleCancel': handleCancel('CMListAdd')
                        },
                        {
                            "modalType" : 'CMListEdit',
                            'isModalOpen': isModalOpen.CMListEdit,
                            'handleOk': handleOk('CMListEdit'),
                            'handleCancel': handleCancel('CMListEdit')
                        },
                        {
                            "modalType" : 'Delete',
                            'isModalOpen': isModalOpen.Delete,
                            'handleOk': handleOk('Delete'),
                            'handleCancel': handleCancel('Delete')
                        },
    
                    ]
                }/>
            ) : (
                <></>
            )}
            </Card>
            </div>
        </>
    );
}