import React, { useState, useEffect } from "react";
import { RecoilRoot } from 'recoil';
import Swal from 'sweetalert2';
import { Input, Select } from 'antd';
import { Card, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../../../utils/AxiosInstance';
import SearchProjectModal from "../../../../FormItem/SearchProjectModal";
import * as pdsStyles from "../../../../assets/css/pds.css";
import * as mainStyles from "../../../../assets/css/main.css";
import PdsStateMgr from "./PdsStateMgr";

const { Option } = Select;

const CustomInput = styled(Input)`
    background-color: transparent !important;

    &:focus, &:hover, &.ant-input-focused, &:focus-within {
        outline: none;
        box-shadow: 0 0 0 0.5px #0EAA00 !important;
        border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }

    input {
        &:focus {
            box-shadow: none !important;
            border-color: #0EAA00 !important;
    }

    &:hover {
        border-color: #0EAA00 !important;
    }
`;

const CustomSelect = styled(Select)`
    .ant-select-selector {
        background-color: transparent !important;
        border-color: #D9D9D9 !important;
        transition: border-color 0.3s;

        &:hover {
            border-color: #0EAA00 !important;
        }

        &:focus, &:focus-within {
            outline: none;
            box-shadow: 0 0 0 0.5px #0EAA00 !important;
            border-color: #0EAA00 !important;
        }
    }

    .ant-select-selection-item {
        &:hover {
            border-color: #0EAA00 !important;
        }
    }
`;

export default function Pd() {
    const [searchedPjt, setSearchedPjt] = useState({});                         // 프로젝트 조회 결과
    const [isSearchPjtModalOpen, setIsSearchPjtModalOpen] = useState(false);

    const [emissions, setEmissions] = useState([]);                             // 조회 결과(배출원 목록)
    const [selectedEms, setSelectedEms] = useState({});                         // 선택된 배출원
    const [notEms, setNotEms] = useState([]);                                   
    const [selectedNotEm, setSelectedNotEm] = useState({});

    const showSearchPjtModal = () => {
        setIsSearchPjtModalOpen(true);
    };

    const closeSearchPjtModal = () => {
        setIsSearchPjtModalOpen(false);
    };

    // 프로젝트 찾기 모달의 선택 버튼 클릭 시 호출될 함수
    const searchProject = (data) => {
        setIsSearchPjtModalOpen(false);
        setSearchedPjt(data);
    };

    // 배출원 row 클릭 시 호출될 함수
    const handleEmClick = (em) => {
        setSelectedEms(em ?? {});
    };
    
    const handleOptionBtnClick = async (button) => {
        setSelectedButton(button); // 클릭된 버튼의 상태를 변경

        if (button === '담당자 지정') {
            const response = await axiosInstance.get(`/pjt/manager?pjtId=${searchedPjt.id}`);
            setManagers(response.data);
        } else if (button === '설비 지정') {
            const response = await axiosInstance.get(`/equip?pjtId=${searchedPjt.id}`);
            setEquips(response.data);

            const totalEqLib = await axiosInstance.get(`/equip/lib`);
            setNotEqs(totalEqLib.data);
        } else if (button === '배출원 관리') {
            const response = await axiosInstance.get(`/equip/emission?projectId=${searchedPjt.id}`);
            setEmissions(response.data);
        }
    };
    
    // 찾기(조회) 버튼 클릭 시 호출될 함수
    const handleSearch = async() => {
        try {
            if (selectedButton === '담당자 지정') {
                const response = await axiosInstance.get(`/pjt/not-manager?pjtId=${searchedPjt.id}&loginId=${inputEmpId}&userName=${inputEmpName}`);
                setEmps(response.data);
            } else if (selectedButton === '설비 지정') {
                const params = {
                    equipLibName: inputEqLib,
                    equipDvs: inputEqDvs === '' ? null : inputEqDvs,
                    equipType: inputEqType === '' ? null : inputEqType,
                };

                const response = await axiosInstance.get("/equip/lib", {params});
                setNotEqs(response.data);
            } else if (selectedButton === '배출원 관리') {
                const response = await axiosInstance.get(`/pjt/not-manager?pjtId=${searchedPjt.id}&loginId=${inputEmpId}&userName=${inputEmpName}`);
                setNotEms(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = async(data) => {
        setSelectedEmps([]);

        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (selectedButton === '담당자 지정') {
            // data 배열을 순회하며 requestBody 배열 생성
            const requestBody = data.map(user => ({
                pjtId: searchedPjt.id,
                userId: user.id
            }));

            const response = await axiosInstance.post("/pjt/manager", requestBody);

            // 기존 managers에서 placeholderManager 제거하고 새 데이터를 병합
            setManagers(prevManagers => {
                // placeholderManager 제거
                const cleanedManagers = prevManagers.filter(manager => manager.id !== '');

                // 새로 추가된 담당자를 병합
                return [...cleanedManagers, ...response.data];
            });

            // emps 에서 새 데이터를 제거
            setEmps(prevEmps => {
                const managerIds = data.map(manager => manager.id);
                const cleanedEmps = prevEmps.filter(emp => !managerIds.includes(emp.id));

                return [...cleanedEmps];
            })

            // 입력창 초기화
            setInputEmpId('');
            setInputEmpName('');

            swalOptions.title = '성공!',
            swalOptions.text = '담당자가 성공적으로 지정되었습니다.';
            swalOptions.icon = 'success';
        } else if (selectedButton === '설비 지정') {
            // data 배열을 순회하며 requestBody 배열 생성
            const requestBody = data.map(user => ({
                pjtId: searchedPjt.id,
                userId: user.id
            }));

            const response = await axiosInstance.post("/pjt/manager", requestBody);

            // 기존 managers에서 placeholderManager 제거하고 새 데이터를 병합
            setManagers(prevManagers => {
                // placeholderManager 제거
                const cleanedManagers = prevManagers.filter(manager => manager.id !== '');

                // 새로 추가된 담당자를 병합
                return [...cleanedManagers, ...response.data];
            });

            // emps 에서 새 데이터를 제거
            setEmps(prevEmps => {
                const managerIds = data.map(manager => manager.id);
                const cleanedEmps = prevEmps.filter(emp => !managerIds.includes(emp.id));

                return [...cleanedEmps];
            })

            // 입력창 초기화
            setInputEqLib('');
            setInputEqType('');
            setInputEqDvs('');

            swalOptions.title = '성공!',
            swalOptions.text = '담당자가 성공적으로 지정되었습니다.';
            swalOptions.icon = 'success';
        }

        Swal.fire(swalOptions);
    };

    return (
        <>
            <div className={mainStyles.breadcrumb}>현장정보 &gt; 프로젝트 상세설정 </div>
            
            {Object.keys(searchedPjt).length === 0 ? (
                <div className={pdsStyles.main_grid}>
                    <Card sx={{ height: "auto", padding: "2.5rem", borderRadius: "0.5rem" }}>
                        <div className={pdsStyles.message_container}>
                            <div className={pdsStyles.message}>프로젝트 찾기를 통해 먼저 프로젝트를 하나 선택해주세요.
                                <button type="primary" onClick={showSearchPjtModal}>
                                    프로젝트 찾기
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

            ) : (
                <div className={pdsStyles.main_grid}>
                    <Card sx={{ height: "auto", padding: "1rem", borderRadius: "0.5rem" }}>
                        <div className={pdsStyles.project_container}>
                            <div className={pdsStyles.pjt_data_container}>프로젝트 코드
                                <div className={pdsStyles.code}>{searchedPjt.pjtCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>프로젝트명
                                <div className={pdsStyles.code}>{searchedPjt.pjtName}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>프로젝트 지역
                                <div className={pdsStyles.code}>{searchedPjt.pjtType} / {searchedPjt.regCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>계약일
                                <div className={pdsStyles.code}>{searchedPjt.ctrtFrYear} / {searchedPjt.ctrtFrMth} ~ {searchedPjt.ctrtToYear} / {searchedPjt.ctrtToMth}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>본부명
                                <div className={pdsStyles.code}>{searchedPjt.divCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>연면적(m²)
                                <div className={pdsStyles.code}>{searchedPjt.bldArea}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>진행상태
                                <div className={pdsStyles.code}>{searchedPjt.pjtProgStus}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>분류
                                <div className={pdsStyles.code}>{searchedPjt.prodTypeCode}</div>
                            </div>
                            <button style={{ marginLeft: "10px" }} onClick={showSearchPjtModal}>다시 선택하기</button>
                        </div>
                    </Card>

                    <RecoilRoot>
                        <PdsStateMgr pjtId={searchedPjt.id} />
                    </RecoilRoot>
                </div>
            )}

            <SearchProjectModal 
                isModalOpen={isSearchPjtModalOpen} 
                handleOk={searchProject} 
                handleCancel={closeSearchPjtModal} 
            />
        </>
    )
};