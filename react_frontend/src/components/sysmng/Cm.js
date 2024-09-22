import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { codeMgrSearchForm } from '../../atoms/searchFormAtoms';
import SearchForms from '../../SearchForms';
import * as tableStyles from '../../assets/css/table.css'
import { formField_cm } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import { table_cm_group, table_cm_code } from '../../assets/json/selectedPjt';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';
import axiosInstance from '../../utils/AxiosInstance';
import { codeColumns, codeGroupColumns } from '../../assets/json/tableColumn';

export default function Cm() {
    const [formData, setFormData] = useRecoilState(codeMgrSearchForm);
    const [codeGroup, setCodeGroup] = useState([]);
    const [showCodeGroup, setShowCodeGroup] = useState(true);

    useEffect(() => {
        const fetchCodeGroup = async () => {
            try {
                const {data} = await axiosInstance.get("/sys/codegroup");
                setCodeGroup(data ?? {});
            } catch (error) {
                console.log(error);
            }
        };

        // formData값이 없으면 코드 그룹ID 목록을 findAll, 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        Object.keys(formData).length === 0 ? fetchCodeGroup() : handleFormSubmit(formData);
    }, []);

    const handleFormSubmit = async (e) => {
        setFormData(e);
        setShowCodeGroup(false);
        const {data} = await axiosInstance.get(`/sys/codegroup`, {
            params: {
                codeGrpNo : e.codeGrpNo,
                codeGrpName: e.codeGrpName,
                codeGrpNameEn: e.codeGrpNameEn,
                note: e.note,
            }
        });
        setCodeGroup(data ?? {});
        setShowCodeGroup(true);
        setShowCode(false);
        setSelectedCode(null);
        setSelectedCodeGroup(null);
    }
    const [selectedCodeGroup, setSelectedCodeGroup] = useState(null);

    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState([]);

    const handleCodeGroupRowClick = async (e) => {
        if (e.row === undefined || e.row === null){
            setShowCode(false);
            setSelectedCodeGroup(e.row);
        }
        else {
            setShowCode(true);
            setSelectedCodeGroup(e.row);
        
            const response = await axiosInstance.get(`/sys/code?codeGrpNo=${e.row.codeGrpNo}`);
            setCode(response.data);
        }
    }

    const [selectedCode, setSelectedCode] = useState(null);

    const handleCodeRowClick = (e) => {
        setSelectedCode(e.row);
    }

    const [isModalOpen, setIsModalOpen] = useState({
        CMAdd: false,
        CMEdit: false,
        DeleteA: false,
        DeleteB: false,
        CMListAdd: false,
        CMListEdit: false,
    });

    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({...prevState, [modalType]: true}));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
        if (modalType === 'CMAdd') {
            // 새로 추가된 사용자 목록에 추가
            setCodeGroup(prevList => [...prevList, data]);
        }
        else if (modalType === 'CMListAdd') {
            // 새로 추가된 사용자 목록에 추가
            setCode(prevList => [...prevList, data]);
        }
        else if (modalType === 'CMEdit') {
            setCodeGroup(prevList =>
                prevList.map(item =>
                    item.codeGrpNo === data.codeGrpNo ? { ...item, ...data } : item
                )
            );
        }
        else if (modalType === 'CMListEdit') {
            setCode(prevList =>
                prevList.map(item =>
                    item.id === data.id ? { ...item, ...data } : item
                )
            );
        }
        else if (modalType === 'DeleteA') {
            // 사용자 삭제 후 목록 갱신
            setCodeGroup(prevList => prevList.filter(codeGrp => codeGrp.id !== data.id));
            setShowCode(false); // 상세 정보 화면 비활성화
        }
        else if (modalType === 'DeleteB') {
            // 사용자 삭제 후 목록 갱신
            setCode(prevList => prevList.filter(code => code.id !== data.id));
        }
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

    const handleDeleteAClick = () => {
        showModal('DeleteA');
    }

    const handleDeleteBClick = () => {
        showModal('DeleteB');
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
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formField_cm} 
            />
            <div className={sysStyles.main_grid}>
            <Card className={sysStyles.card_box} sx={{width:"50%", height:"80vh", borderRadius:"15px"}}>
            <TableCustom title="코드그룹ID" data={codeGroup} buttons={["Delete", "Edit", "Add"]} selectedRows={[selectedCodeGroup]} onRowClick={(e) => handleCodeGroupRowClick(e)} onClicks={[handleDeleteAClick, handleEditClick, handleAddClick]} columns={codeGroupColumns} modals={
                [
                    isModalOpen.CMAdd && {
                        "modalType" : 'CMAdd',
                        'isModalOpen': isModalOpen.CMAdd,
                        'handleOk': handleOk('CMAdd'),
                        'handleCancel': handleCancel('CMAdd')
                    },
                    isModalOpen.CMEdit && {
                        "modalType" : 'CMEdit',
                        'isModalOpen': isModalOpen.CMEdit,
                        'handleOk': handleOk('CMEdit'),
                        'handleCancel': handleCancel('CMEdit'),
                        'rowData': selectedCodeGroup,
                    },
                    isModalOpen.DeleteA && {
                        "modalType" : 'DeleteA',
                        'isModalOpen': isModalOpen.DeleteA,
                        'handleOk': handleOk('DeleteA'),
                        'handleCancel': handleCancel('DeleteA'),
                        'rowData': selectedCodeGroup,
                        'rowDataName': "codeGrpName",
                        'url': '/sys/codegroup',
                    },

                ].filter(Boolean)
            }/>
            </Card>
            <Card className={sysStyles.card_box} sx={{width:"50%", height:"80vh", borderRadius:"15px"}}>
            
            {showCode ? (
                <TableCustom title="코드리스트" data={code} buttons={["Delete", "Edit", "Add"]} columns={codeColumns} selectedRows={[selectedCode]} onRowClick={handleCodeRowClick} onClicks={[handleDeleteBClick, handleListEditClick, handleListAddClick]} modals={
                    [
                        isModalOpen.CMListAdd && {
                            "modalType" : 'CMListAdd',
                            'isModalOpen': isModalOpen.CMListAdd,
                            'handleOk': handleOk('CMListAdd'),
                            'handleCancel': handleCancel('CMListAdd'),
                            'rowData': selectedCodeGroup,
                        },
                        isModalOpen.CMListEdit && {
                            "modalType" : 'CMListEdit',
                            'isModalOpen': isModalOpen.CMListEdit,
                            'handleOk': handleOk('CMListEdit'),
                            'handleCancel': handleCancel('CMListEdit'),
                            'rowData': selectedCode,
                        },
                        isModalOpen.DeleteB && {
                            "modalType" : 'DeleteB',
                            'isModalOpen': isModalOpen.DeleteB,
                            'handleOk': handleOk('DeleteB'),
                            'handleCancel': handleCancel('DeleteB'),
                            'rowData': selectedCode,
                            'rowDataName': 'codeName',
                            'url': '/sys/code'
                        },
    
                    ].filter(Boolean)
                }/>
            ) : (
                <TableCustom title='코드리스트' table={false} />
            )}
            </Card>
            </div>
        </>
    );
}