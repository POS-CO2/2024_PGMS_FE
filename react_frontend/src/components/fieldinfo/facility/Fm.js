import React, { useState } from 'react';
import SearchForms from '../../../SearchForms';
import { formField_fm } from '../../../assets/json/searchFormData';
import { table_fm_facList, table_fm_res } from '../../../assets/json/selectedPjt';
import TableCustom from '../../../TableCustom';
import { AllButton } from '../../../Button';

export default function Fm() {

    const [fac, setFac] = useState([]);

    const handleFormSubmit = (data) => {
        setFac(data);
    };

    const [showSearchResult, setShowSearchResult] = useState(showSearchResult ? true : false);

    const handleSearchClick = () => {
        setShowSearchResult(!showSearchResult);
        console.log(showSearchResult);
    };

    const [showFacList, setShowFacList] = useState(showFacList ? true : false);

    const handleRowClick = () => {
        setShowFacList(!showFacList);
    };

    return (
        <>
            <div>
                {"현장정보 > 설비 > 설비지정"}
            </div>
            <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_fm} onSearch={handleSearchClick}/>
            {showSearchResult ? (
                <>
                    <TableCustom title="조회결과" data={table_fm_res} onRowClick={handleRowClick}/>
                    {showFacList ? (
                        <>
                            {/** 버튼 변경 필요(엑셀 다운로드, 삭제, 등록) 및 등록 클릭 시 모달 추가 */}
                            <TableCustom title="설비목록" data={table_fm_facList} button="AllButton"/>
                        </>
                    ) : (
                        <></>
                    )}
                </>
            ):(
                <></>
            )}
        </>
    );
}