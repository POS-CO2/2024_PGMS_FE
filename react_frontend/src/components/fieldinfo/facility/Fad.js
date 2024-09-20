import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Card } from '@mui/material';
import * as tableStyles from "../../../assets/css/newTable.css";
import * as mainStyles from "../../../assets/css/main.css";
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import { formField_fad } from "../../../assets/json/searchFormData";
import { equipLibColumns, equipActvColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';

export default function Fad() {
    const [searchResult, setSearchResult] = useState({});             // 검색 데이터(설비LIB 조회 결과)
    const [actves, setActves] = useState([]);
    const [selectedActv, setSelectedActv] = useState({});             // 선택된 활동자료
    const [isModalOpen, setIsModalOpen] = useState({
        FadAdd: false,
        Delete: false
    });

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (data) => {
        setSearchResult(data.searchLib);

        // 선택한 lib에 매핑된 활동자료 목록 조회
        const response = await axiosInstance.get(`/equip/actv/${data.searchLib.id}`);

        setActves(response.data);
    };

    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (actv) => {
        setSelectedActv(actv.row ?? {});
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 활동자료 지정(등록) 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기
        
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'FadAdd') {
            try {
                // data 배열을 순회하며 requestBody 배열 생성
                const requestBody = data.map(actv => ({
                    equipLibId: searchResult.id,
                    actvDataId: actv.id,
                }));
                const response = await axiosInstance.post("/equip/libmap", requestBody);

                // 기존 활동자료에서 placeholderActv를 제거하고 새 데이터를 병합
                setActves(prevActves => {
                    // placeholderProject 제거
                    const cleanedActves = prevActves.filter(actv => actv.id !== '');

                    // 새로 추가된 설비LIB을 병합
                    return [...cleanedActves, ...response.data];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '활동자료가 성공적으로 지정되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '활동자료 지정에 실패하였습니다.';
                swalOptions.icon = 'error';
            }
        } else if (modalType === 'Delete') {
            try {
                // 선택된 활동자료를 actves 리스트에서 제거
                setActves(prevActves => prevActves.filter(actv => actv.id !== selectedActv.id));
                setSelectedActv({});
            } catch (error) {
                console.log(error);
            }
        }
        Swal.fire(swalOptions);
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 버튼 클릭 시 모달 열림 설정
    const onAddClick = () => {
        showModal('FadAdd');
    };

    const onDeleteClick = () => {
        showModal('Delete');
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 설비 &gt; 활동자료 지정</div>
            
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fad} />
            
            {(!searchResult || Object.keys(searchResult).length === 0) ?
            <></> : (
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table 
                        data={[searchResult]}
                        columns={equipLibColumns}
                        key={JSON.stringify(searchResult.id)} 
                    />                    

                    <TableCustom 
                        title='활동자료목록' 
                        data={actves}
                        columns={equipActvColumns}   
                        buttons={['Delete', 'Add']}
                        onClicks={[onDeleteClick, onAddClick]}
                        onRowClick={handleActvClick}
                        selectedRows={[selectedActv.id]}
                        modals={[
                            {
                                'modalType': 'Delete',
                                'isModalOpen': isModalOpen.Delete,
                                'handleOk': handleOk('Delete'),
                                'handleCancel': handleCancel('Delete'),
                                'rowData': {
                                    ...selectedActv,
                                    equipLibId: searchResult.id
                                },
                                'rowDataName': 'actvDataName',
                                'url': '/equip/libmap'
                            },
                            {
                                'modalType': 'FadAdd',
                                'isModalOpen': isModalOpen.FadAdd,
                                'handleOk': handleOk('FadAdd'),
                                'handleCancel': handleCancel('FadAdd'),
                                'rowData': searchResult
                            },
                        ]}
                    />
                </>
            )}
        </>
    );
}