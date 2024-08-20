import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import * as tableStyles from "../../../assets/css/newTable.css"
import * as mainStyles from "../../../assets/css/main.css"
import Table from "../../../Table";
import {TableCustomDoubleClickEdit} from "../../../TableCustom";
import SearchForms from "../../../SearchForms";
import {formField_ps12} from "../../../assets/json/searchFormData.js";
import axiosInstance from '../../../utils/AxiosInstance';

export default function Rm() {
    const [formData, setFormData] = useState({});         // 검색 데이터(프로젝트 조회 결과)
    const [salesAmts, setSalesAmts] = useState([]);         // 조회 결과(매출액 목록 리스트)
    const [selectedSA, setSelectedSA] = useState(null);   // 선택된 매출액(pk column only)
    const [isModalOpen, setIsModalOpen] = useState({
        RmAdd: false,
        Del: false
    });

    // selectedSA 변경될 때마다 실행될 useEffect
    useEffect(() => {}, [selectedSA]);

    // saleAmt 상태가 변경될 때 실행될 useEffect
    useEffect(() => {
        if (salesAmts.length === 0) {
            const placeholderSA = {
                id: '',
                년: '',
                월: '',
                매출액: '',
            };
            setSalesAmts([placeholderSA]);
        }
    }, [salesAmts]);

    // 조회 버튼 클릭시 호출될 함수
    const handleFormSubmit = async (param) => {
        setFormData([param.searchProject]);
        const {data} = await axiosInstance.get(`/pjt/manager?pjtId=${param.searchProject.id}`);

        // data가 빈 배열인지 확인
        if (data.length === 0) {
            // 빈 데이터인 경우, 기본 형태의 객체를 생성
            const placeholderSA = {
                id: '',
                년: '',
                월: '',
                매출액: ''
            };
            setSalesAmts([placeholderSA]);
        } else {
            // 필요한 필드만 추출하여 managers에 설정
            const filteredSAs = data.map(sales => ({
                id: sales.id,
                년: sales.year,
                월: sales.mth,
                매출액: sales.salesAmt
            }));

            setSalesAmts(filteredSAs);
        }
    };

    // 매출액 row 클릭 시 호출될 함수
    const handleSAClick = (salesAmt) => {
        setSelectedSA(salesAmt?.id ?? null);
    };

    // 모달 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    // 매출액 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기

        // modalType에 따른 SweetAlert2 설정
        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'RmAdd') {
            try {
                const requestBody = {
                    pjtId: formData[0].id,
                    year: parseInt(data.year, 10), // 문자열을 정수로 변환
                    mth: parseInt(data.month, 10), // 문자열을 정수로 변환
                    salesAmt: parseFloat(data.salesAmt) // 문자열을 실수로 변환
                };
                
                const response = await axiosInstance.post("/pjt/sales", requestBody);
                

                // 데이터가 객체인 경우 처리 방법
                const filteredData = {
                    id: response.data.id,
                    년: response.data.year,
                    월: response.data.mth,
                    매출액: response.data.salesAmt,
                };

                // 기존 managers에서 placeholderManager 제거하고 새 데이터를 병합
                setSalesAmts(prevSAs => {
                    // placeholderManager 제거
                    const cleanedSAs = prevSAs.filter(sales => sales.id !== '');

                    // 새로 추가된 담당자를 병합
                    return [...cleanedSAs, filteredData];
                });

                swalOptions.title = '성공!',
                swalOptions.text = '매출액이 성공적으로 등록되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log("aa:", error);

                swalOptions.title = '실패!',
                swalOptions.text = '매출액 등록에 실패하였습니다.';
                swalOptions.icon = 'error';

                // if(error.response.status === 400) {
                //     swalOptions.text = `이미 ${error.config.data}에 등록된 매출액이 존재합니다.`;
                // }
            }
        } else if (modalType === 'Del') {
            try {
                const response = await axiosInstance.delete(`/pjt/sales?id=${selectedSA}`);

                // 선택된 담당자를 managers 리스트에서 제거
                setSalesAmts(prevSAs => prevSAs.filter(salesAmt => salesAmt.id !== data));
                setSelectedSA(null);

                swalOptions.title = '성공!',
                swalOptions.text = '매출액이 성공적으로 삭제되었습니다.';
                swalOptions.icon = 'success';
            } catch (error) {
                console.log(error);

                swalOptions.title = '실패!',
                swalOptions.text = '매출액 삭제에 실패하였습니다.';
                swalOptions.icon = 'success';
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
        showModal('RmAdd');
    };

    const onDeleteClick = () => {
        showModal('Del');
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 &gt; 매출액 관리</div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={[formField_ps12[0]]} />
            
            {(!formData || Object.keys(formData).length === 0) ?
            <></> : (
                <>
                    <div className={tableStyles.table_title}>조회결과</div>
                    <Table 
                        data={formData}
                        key={JSON.stringify(formData)} // formData 변경 시 key 변경되어 리렌더링
                    />                    
                    <TableCustomDoubleClickEdit 
                        title='매출액목록' 
                        data={salesAmts}                   
                        buttons={['Delete', 'Edit', 'Add']}
                        onClicks={[onDeleteClick, () => {}, onAddClick]}
                        onRowClick={handleSAClick}
                        selectedRows={[selectedSA]}
                        modals={[
                            {
                                'modalType': 'Del',
                                'isModalOpen': isModalOpen.Del,
                                'handleOk': handleOk('Del'),
                                'handleCancel': handleCancel('Del')
                            },
                            {
                                'modalType': 'RmAdd',
                                'isModalOpen': isModalOpen.RmAdd,
                                'handleOk': handleOk('RmAdd'),
                                'handleCancel': handleCancel('RmAdd'),
                                'rowData': {'pjtCode': formData[0].pjtCode, 'pjtName': formData[0].pjtName}
                            },
                        ]}
                    />
                </>
            )}
        </>
    );
}