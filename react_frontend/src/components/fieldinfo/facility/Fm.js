import React, { useState } from 'react';
import { SearchFormPd } from '../../../SearchForms';
import { formField_fm } from '../../../assets/json/searchFormData';
import { table_fm_facList, table_fm_res } from '../../../assets/json/selectedPjt';
import TableCustom from '../../../TableCustom';

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
            <SearchFormPd onSearch={handleSearchClick}/>
            {showSearchResult ? (
                <>
                    <TableCustom title="조회결과" data={table_fm_res} onRowClick={handleRowClick}/>
                    {showFacList ? (
                        <>
                            <TableCustom title="설비목록" data={table_fm_facList}/>
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