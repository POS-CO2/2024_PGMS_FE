import React, { useState } from "react";
import { useRecoilState } from 'recoil';
import { selectedPjtState } from '../../../../atoms/pdsAtoms';
import { Card } from '@mui/material';
import SearchProjectModal from "../../../../FormItem/SearchProjectModal";
import * as pdsStyles from "../../../../assets/css/pds.css";
import * as mainStyles from "../../../../assets/css/main.css";
import PdsStateMgr from "./PdsStateMgr";

export default function Pds() {
    const [searchedPjt, setSearchedPjt] = useRecoilState(selectedPjtState);                         // 프로젝트 조회 결과
    const [isSearchPjtModalOpen, setIsSearchPjtModalOpen] = useState(false);

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
                        <div className={pdsStyles.row}>
                            <div className={pdsStyles.pjt_data_container}>프로젝트 코드
                                <div className={pdsStyles.code}>{searchedPjt.pjtCode}</div>
                            </div>
                            <div className={pdsStyles.pjt_data_container}>프로젝트명
                                <div className={pdsStyles.code}>{searchedPjt.pjtName}</div>
                            </div>
                        </div>

                        <div className={pdsStyles.row}>
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

                            <div className={pdsStyles.right_aligned}>
                                <button style={{ marginLeft: "10px" }} onClick={showSearchPjtModal}>다시 선택하기</button>
                            </div>
                        </div>
                    </Card>

                    <PdsStateMgr pjtId={searchedPjt.id} />
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