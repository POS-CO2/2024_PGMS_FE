import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { codeMgrSearchForm } from '../../atoms/searchFormAtoms';
import { selectedCGState, selectedCLState } from '../../atoms/selectedRowAtoms';
import Swal from 'sweetalert2';
import SearchForms from '../../SearchForms';
import { formField_cm } from '../../assets/json/searchFormData';
import TableCustom from '../../TableCustom';
import * as sysStyles from '../../assets/css/sysmng.css';
import * as mainStyle from '../../assets/css/main.css';
import { Card } from '@mui/material';
import axiosInstance from '../../utils/AxiosInstance';
import { codeColumns, codeGroupColumns } from '../../assets/json/tableColumn';
import * as pdsStyles from "../../assets/css/pds.css";

export default function Cm() {
    const [formData, setFormData] = useRecoilState(codeMgrSearchForm);
    const [codeGroup, setCodeGroup] = useState([]);
    const [code, setCode] = useState([]);
    const [selectedCodeGroup, setSelectedCodeGroup] = useRecoilState(selectedCGState);
    const [selectedCode, setSelectedCode] = useRecoilState(selectedCLState);
    const [submittedCGIdx, setSubmittedCGIdx] = useState([]);
    const [submittedCLIdx, setSubmittedCLIdx] = useState([]);
    const [newAddedCMId, setNewAddedCMId] = useState(null);
    const [newAddedCLId, setNewAddedCLId] = useState(null);

    const fetchCodeGroup = async () => {
        try {
            const {data} = await axiosInstance.get("/sys/codegroup");
            setCodeGroup(data ?? {});
        } catch (error) {
            console.log(error);
        }
    };

    // 코드 그룹이 추가될 때 데이터의 인덱스를 찾는 useEffect
    useEffect(() => {
        if (newAddedCMId) {
            const newAddedIndex = codeGroup.findIndex(cg => cg.id === newAddedCMId);
            if (newAddedIndex !== -1) {
                setSubmittedCGIdx([newAddedIndex]);
            }
            else {
                setSubmittedCGIdx([]);
                setNewAddedCMId(null); // ID 초기화
            }
        }
    }, [codeGroup.length]);

    // 코드 그룹이 추가될 때 데이터의 인덱스를 찾는 useEffect
    useEffect(() => {
        if (newAddedCLId) {
            const newAddedIndex = code.findIndex(code => code.id === newAddedCLId);
            if (newAddedIndex !== -1) {
                setSubmittedCLIdx([newAddedIndex]);
            }
            else {
                setSubmittedCLIdx([]);
                setNewAddedCLId(null); // ID 초기화
            }
        }
    }, [code.length]);

    useEffect(() => {
        // formData값이 없으면 코드 그룹ID 목록을 findAll, 있으면(이전 탭의 검색기록이 있으면) 그 값을 불러옴
        if(Object.keys(formData).length === 0) {
            fetchCodeGroup();
            if(Object.keys(selectedCodeGroup).length !== 0) {
                fetchCodeList(selectedCodeGroup);
            }
        }
        else {
            handleFormSubmit(formData);
        }
    }, []);
    
    const fetchCodeList = async (e) => {
        try {
            // 선택한 코드그룹에 매핑된 코드리스트 목록 조회
            const response = await axiosInstance.get(`/sys/code?codeGrpNo=${e.codeGrpNo}`);
            setCode(response.data);
        } catch (error) {
            console.error("Error fetching activity data:", error);
        }
    }

    const handleFormSubmit = async (e) => {
        setFormData(e);
        const {data} = await axiosInstance.get(`/sys/codegroup`, {
            params: {
                codeGrpNo : e.codeGrpNo,
                codeGrpName: e.codeGrpName,
                codeGrpNameEn: e.codeGrpNameEn,
                note: e.note,
            }
        });
        setCodeGroup(data ?? {});

        //코드그룹 목록에 selectedCodeGroup 있는지 확인
        const targetRow = data.find(row => row.id === selectedCodeGroup.id);
        if (targetRow) {
            fetchCodeList(selectedCodeGroup);
        } else {
            setCode([]);
        }
        setSubmittedCGIdx([]);
        setFormData(e);
    }

    const handleCodeGroupRowClick = async (e) => {
        if (e.row === undefined || e.row === null){
            setSelectedCodeGroup(e.row);
        }
        else {
            setSelectedCodeGroup(e.row);
        
            fetchCodeList(e.row);
        }
    }

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

    // 모달에서 등록/수정 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
        
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'CMAdd') {
            try {
                // POST 요청으로 서버에 데이터 전송
                const response = await axiosInstance.post('/sys/codegroup', data);
                
                handleFormSubmit(formData);
                setSelectedCodeGroup({});
                setNewAddedCMId(response.data.id); // 새로 추가된 데이터의 ID 저장

                swalOptions.title = '성공!',
                swalOptions.text = `${data.codeGrpName}이(가) 성공적으로 등록되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message,
                swalOptions.icon = 'error';
            }
        }
        else if (modalType === 'CMListAdd') {
            try {
                // POST 요청으로 서버에 데이터 전송
                const response = await axiosInstance.post('/sys/code', data);
                // 새로 추가된 사용자 목록에 추가
                fetchCodeList(selectedCodeGroup);
                setSelectedCode({});
                setNewAddedCLId(response.data.id);

                swalOptions.title = '성공!',
                swalOptions.text = `${data.codeName}이(가) 성공적으로 등록되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message,
                swalOptions.icon = 'error';
            }
        }
        else if (modalType === 'CMEdit') {
            try {
                const response = await axiosInstance.patch('/sys/codegroup', data);

                setCodeGroup(prevList =>
                    prevList.map(item =>
                        item.id === selectedCodeGroup.id ? response.data : item
                    )
                );
                setSelectedCodeGroup(response.data);

                swalOptions.title = '성공!',
                swalOptions.text = `${data.codeGrpName}이(가) 성공적으로 수정되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message,
                swalOptions.icon = 'error';
            }
        }
        else if (modalType === 'CMListEdit') {
            try {
                // POST 요청으로 서버에 데이터 전송
                const response = await axiosInstance.patch('/sys/code', data);
                setCode(prevList =>
                    prevList.map(item =>
                        item.id === selectedCode.id ? response.data : item
                    )
                );
                setSelectedCode(response.data);

                swalOptions.title = '성공!',
                swalOptions.text = `${data.codeName}이(가) 성공적으로 수정되었습니다.`;
                swalOptions.icon = 'success';
            } catch (error) {
                swalOptions.title = '실패!',
                swalOptions.text = error.response.data.message,
                swalOptions.icon = 'error';
            }
        }
        else if (modalType === 'DeleteA') {
            // 사용자 삭제 후 목록 갱신
            setCodeGroup(prevList => prevList.filter(codeGrp => codeGrp.id !== selectedCodeGroup.id));
            setSelectedCodeGroup({});
            setSubmittedCGIdx([]);
        }
        else if (modalType === 'DeleteB') {
            // 사용자 삭제 후 목록 갱신
            setCode(prevList => prevList.filter(code => code.id !== selectedCode.id));
            setSelectedCode({});
            setSubmittedCLIdx([]);
        }

        Swal.fire(swalOptions);
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

    // 서치폼이 변경될 때 목록 clear
    const handleFieldsChange = () => {
        setCodeGroup([]);
        setSelectedCodeGroup({});
    };

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 코드 관리"}
            </div>
            <SearchForms 
                initialValues={formData} 
                onFormSubmit={handleFormSubmit} 
                formFields={formField_cm} 
                handleFieldsChange={handleFieldsChange}
                handleEmptyFields={fetchCodeGroup}
            />
            <div className={sysStyles.main_grid}>
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"auto", borderRadius:"15px"}}>
                    <TableCustom title="코드그룹ID" data={codeGroup} submittedRowIdx={submittedCGIdx} buttons={["Delete", "Edit", "Add"]} selectedRows={[selectedCodeGroup]} onRowClick={(e) => handleCodeGroupRowClick(e)} onClicks={[handleDeleteAClick, handleEditClick, handleAddClick]} columns={codeGroupColumns} modals={
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
                <Card className={sysStyles.card_box} sx={{width:"50%", height:"auto", borderRadius:"15px"}}>
                    {(!selectedCodeGroup || Object.keys(selectedCodeGroup).length === 0) ?
                        <div className={pdsStyles.card_container}>
                            <div className={pdsStyles.table_title} style={{ padding: "8px" }}>코드리스트</div>
                        </div> : (
                            <TableCustom title="코드리스트" data={code} submittedRowIdx={submittedCLIdx} buttons={["Delete", "Edit", "Add"]} columns={codeColumns} selectedRows={[selectedCode]} onRowClick={handleCodeRowClick} onClicks={[handleDeleteBClick, handleListEditClick, handleListAddClick]} modals={
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
                            }
                        />
                    )}
                </Card>
            </div>
        </>
    );
}