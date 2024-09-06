import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Input, Select } from 'antd';
import { Card, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@ant-design/icons';
import { pjtManagerColumns, equipColumns, equipEmissionColumns, userColumns } from '../../../assets/json/tableColumn';
import axiosInstance from '../../../utils/AxiosInstance';
import Table from "../../../Table";
import TableCustom from "../../../TableCustom";
import SearchProjectModal from "../../../FormItem/SearchProjectModal";
import * as pdsStyles from "../../../assets/css/pds.css";
import * as mainStyles from "../../../assets/css/main.css";
import selectedPjt from "../../../assets/json/selectedPjt";

const { Option } = Select;

const CustomButton = styled(Button)(({ theme, selected }) => ({
    color: selected ? '#000' : '#B6B6B6',
    border: selected ? '0.1rem solid #0A7800' : 'none',
    backgroundColor: selected ? '#fff' : 'transparent',
    fontWeight: selected ? 'bolder' : 'normal',
    borderRadius: '1.3rem',
    fontSize: '1rem',
    paddingTop: '0.1rem',
    paddingBottom: '0.1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',

    '&:hover': {
        color: '#000',
        backgroundColor: '#fff',
        border: '0.1rem solid #0A7800',
        borderRadius: '1.3rem',
        fontWeight: 'bolder',
    },
}));

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

// Select 컴포넌트 스타일
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
    const [isModalOpen, setIsModalOpen] = useState({
        SdMgr: false,
        Delete: false
    });
    const [selectedButton, setSelectedButton] = useState('담당자 지정');
    
    const [managers, setManagers] = useState([]);                               // 조회 결과(담당자 목록)
    const [selectedManager, setSelectedManager] = useState({});                 // 선택된 담당자
    const [emps, setEmps] = useState([]);                                       // 조회 결과(사원 목록)
    const [selectedEmps, setSelectedEmps] = useState([]);                       // 선택된 사원의 loginId list
    const [inputEmpId, setInputEmpId] = useState('');                           // 입력한 사번
    const [inputEmpName, setInputEmpName] = useState('');                       // 입력한 사원명

    const [equips, setEquips] = useState([]);                                   
    const [selectedEq, setSelectedEq] = useState({});                           
    const [notEqs, setNotEqs] = useState([]);                                   
    const [selectedNotEq, setSelectedNotEq] = useState({});
    const [inputEqLib, setInputEqLib] = useState('');
    const [inputEqType, setInputEqType] = useState('');
    const [inputEqDvs, setInputEqDvs] = useState('');
    const [inputEqName, setInputEqName] = useState('');
    const [eqTypeList, setEqTypeList] = useState([]);                           // 설비유형 리스트
    const [eqDvsList, setEqDvsList] = useState([]);                             // 설비구분 리스트

    const [emissions, setEmissions] = useState([]);                             // 조회 결과(배출원 목록)
    const [selectedEms, setSelectedEms] = useState({});                         // 선택된 배출원
    const [notEms, setNotEms] = useState([]);                                   
    const [selectedNotEm, setSelectedNotEm] = useState({});

    // 설비유형 및 설비구분 데이터를 불러오는 함수
    const fetchDropdownOptions = async () => {
        try {
            const typeResponse = await axiosInstance.get(`/sys/unit?unitType=설비유형`);
            const dvsResponse = await axiosInstance.get(`/sys/unit?unitType=설비구분`);
            setEqTypeList(typeResponse.data);  // 설비유형 리스트 설정
            setEqDvsList(dvsResponse.data);    // 설비구분 리스트 설정
        } catch (error) {
            console.error("Error fetching dropdown data: ", error);
        }
    };

    useEffect(async() => {
        fetchDropdownOptions();  // 컴포넌트가 마운트될 때 드롭다운 리스트 데이터를 가져옴

        const totalEqLib = await axiosInstance.get(`/equip/lib`);
        setNotEqs(totalEqLib.data);
    }, []);

    useEffect(() => {
        if(Object.keys(selectedNotEq).length === 0) {
            setInputEqName('');
        } else {
            setInputEqName(selectedNotEq.equipLibName);
        }
    }, [selectedNotEq]);

    const showSearchPjtModal = () => {
        setIsSearchPjtModalOpen(true);
    };

    const closeSearchPjtModal = () => {
        setIsSearchPjtModalOpen(false);
    };

    // 모달(프로젝트 찾기 모달 제외) 열기
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: true }));
    };

    const onDeleteClick = () => {
        showModal('Delete');
    };

    // 모달 닫기
    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    // 프로젝트 찾기 모달의 선택 버튼 클릭 시 호출될 함수
    const searchProject = (data) => {
        setIsSearchPjtModalOpen(false);
        setSearchedPjt(data);
    };

    // 사원 row 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps(emp);
    };

    // 담당자 row 클릭 시 호출될 함수
    const handleManagerClick = (manager) => {
        setSelectedManager(manager ?? {});
    };

    // 설비 row 클릭 시 호출될 함수
    const handleEqClick = (eq) => {
        setSelectedEq(eq ?? {});
    };

    // 지정되지 않은 설비 row 클릭 시 호출될 함수
    const handleNotEqClick = (eq) => {
        setSelectedNotEq(eq ?? {});
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
        } else if (button === '배출원 관리') {
            const response = await axiosInstance.get(`/equip/emission?projectId=${searchedPjt.id}`);
            setEmissions(response.data);
        }
    };

    const handleExcelUploadClick = (csvData, fileName) => {
        // CSV 변환 함수
        const csvRows = [];
        
        // 헤더 생성
        const headers = Object.keys(csvData[0]);
        csvRows.push(headers.join(','));
        
        // 데이터 생성
        for (const row of csvData) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        // CSV 파일 생성
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // 삭제 모달의 확인 버튼 클릭 시 호출될 함수
    const handleOk = (modalType, button) => async (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false })); //모달 닫기

        let swalOptions = {
            confirmButtonText: '확인'
        };

        if (modalType === 'Delete') {
            try {
                if (button === '담당자 지정') {
                    // 선택된 담당자를 managers 리스트에서 제거
                    setManagers(prevManagers => prevManagers.filter(manager => manager.id !== selectedManager.id));
                    setSelectedManager({});
                } else if (button === '설비 지정') {
                    // 선택된 담당자를 managers 리스트에서 제거
                    setManagers(prevManagers => prevManagers.filter(manager => manager.id !== selectedManager.id));
                    setSelectedManager({});
                } else if (button === '담당자 관리') {
                    // 선택된 담당자를 managers 리스트에서 제거
                    setManagers(prevManagers => prevManagers.filter(manager => manager.id !== selectedManager.id));
                    setSelectedManager({});
                }
            } catch (error) {
                console.log(error);
            }
        } 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  // 폼의 기본 제출 동작 방지
            handleSearch();
        }
    };
    
    // 찾기(조회) 버튼 클릭 시 호출될 함수
    const handleSearch = async() => {
        try {
            if (selectedButton === '담당자 지정') {
                const response = await axiosInstance.get(`/pjt/not-manager?pjtId=${searchedPjt.id}&loginId=${inputEmpId}&userName=${inputEmpName}`);
                setEmps(response.data);
            } else if (selectedButton === '설비 지정') {
                const response = await axiosInstance.get(`/equip/lib?equipLibName=${inputEqLib}&equipDvs=${inputEqDvs}&equipType=${inputEqType}`);
                setNotEqs(response.data);
                console.log("aa", inputEqLib);
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
                            <button onClick={showSearchPjtModal}>다시 선택하기</button>
                        </div>
                    </Card>

                    <div className={pdsStyles.button_container}>
                        <CustomButton
                            variant="outlined"
                            selected={selectedButton === '담당자 지정'}
                            onClick={() => handleOptionBtnClick('담당자 지정')}
                        >
                            담당자 지정
                        </CustomButton>
                        <CustomButton
                            variant="outlined"
                            selected={selectedButton === '설비 지정'}
                            onClick={() => handleOptionBtnClick('설비 지정')}
                        >
                            설비 지정
                        </CustomButton>
                        <CustomButton
                            variant="outlined"
                            selected={selectedButton === '배출원 관리'}
                            onClick={() => handleOptionBtnClick('배출원 관리')}
                        >
                            배출원 관리
                        </CustomButton>
                    </div>

                    <div className={pdsStyles.contents_container}>
                        {selectedButton === '담당자 지정' && (
                            <>
                                <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                                    <TableCustom
                                        title='담당자목록' 
                                        data={managers}
                                        columns={pjtManagerColumns}                 
                                        buttons={['Delete']}
                                        onClicks={[onDeleteClick]}
                                        onRowClick={handleManagerClick}
                                        selectedRows={[selectedManager]}
                                        modals={[
                                            {
                                                'modalType': 'Delete',
                                                'isModalOpen': isModalOpen.Delete,
                                                'handleOk': handleOk('Delete', selectedButton),
                                                'handleCancel': handleCancel('Delete'),
                                                'rowData': selectedManager,
                                                'rowDataName': 'userName',
                                                'url': '/pjt/manager'
                                            },
                                        ]}
                                    />
                                </Card>
                                <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                                    <div className={pdsStyles.card_container}>
                                        <div className={pdsStyles.table_title}>현장 담당자 지정</div>
                                        <div className={pdsStyles.search_container}>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>사번</div>
                                                <CustomInput
                                                    value={inputEmpId}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(e) => setInputEmpId(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    style={{ width: '12rem', backgroundColor: '#E5F1E4', outline: 'none', boxShadow: 'none' }}
                                                />
                                            </div>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>이름</div>
                                                <div className={pdsStyles.input_with_btn}>
                                                    <CustomInput
                                                        value={inputEmpName}
                                                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                        onChange={(e) => setInputEmpName(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        style={{ width: '12rem', backgroundColor: '#E5F1E4', outline: 'none', boxShadow: 'none' }}
                                                    />
                                                    <button className={pdsStyles.search_button} onClick={handleSearch}>조회</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={pdsStyles.result_container}>
                                            {(!emps || Object.keys(emps).length === 0) ? 
                                            <></> : <Table key={JSON.stringify(managers.length)} data={emps} columns={userColumns} variant='checkbox' onRowClick={handleEmpClick} modalPagination={true} />
                                            }
                                            {(!selectedEmps || selectedEmps.length === 0) ?
                                            <></> : ( <button className={pdsStyles.select_button} onClick={() => handleSelect(selectedEmps)}>등록</button> )}
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )}
                        {selectedButton === '설비 지정' && (
                            <>
                                <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                                    <TableCustom
                                        title='설비목록' 
                                        data={equips}
                                        columns={equipColumns}                 
                                        buttons={['DownloadExcel', 'Delete']}
                                        onClicks={[() => handleExcelUploadClick(equips, 'exported_table'), onDeleteClick]}
                                        onRowClick={handleEqClick}
                                        selectedRows={[selectedEq]}
                                        excel={true}
                                        modals={[
                                            {
                                                'modalType': 'Delete',
                                                'isModalOpen': isModalOpen.Delete,
                                                'handleOk': handleOk('Delete', selectedButton),
                                                'handleCancel': handleCancel('Delete'),
                                                'rowData': selectedEq,
                                                'rowDataName': 'equipName',
                                                'url': '/equip'
                                            },
                                        ]}
                                    />
                                </Card>
                                <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem", paddingBottom: "20px" }}>
                                    <div className={pdsStyles.card_container}>
                                        <div className={pdsStyles.table_title}>설비 등록</div>
                                        <div className={pdsStyles.search_container}>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비LIB명</div>
                                                <CustomInput
                                                    value={inputEqLib}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(e) => setInputEqLib(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    style={{ width: '8rem' }}
                                                />
                                            </div>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비유형</div>
                                                <CustomSelect
                                                    value={inputEqType}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(value) => setInputEqType(value)}
                                                    style={{ width: '12.3rem' }}
                                                    placeholder="설비유형 선택"
                                                >
                                                    {eqTypeList.map((item) => (
                                                        <Option key={item.code} value={item.name}>
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                                </CustomSelect>
                                            </div>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비구분</div>
                                                <div className={pdsStyles.input_with_btn}>
                                                    <CustomSelect
                                                        value={inputEqDvs}
                                                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                        onChange={(value) => setInputEqDvs(value)}
                                                        style={{ width: '7rem' }}
                                                        placeholder="설비구분 선택"
                                                    >
                                                        {eqDvsList.map((item) => (
                                                            <Option key={item.code} value={item.name}>
                                                                {item.name}
                                                            </Option>
                                                        ))}
                                                    </CustomSelect>
                                                    <button className={pdsStyles.search_button} onClick={handleSearch} style={{ width: '3rem' }}>조회</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={pdsStyles.result_container}>
                                            <Table key={JSON.stringify(equips.length)} data={notEqs} columns={equipColumns} onRowClick={handleNotEqClick} modalPagination={true} />
                                            
                                            <div className={pdsStyles.input_container} style={{ padding: '0.5rem', marginBottom: "1rem" }}>
                                                <div className={pdsStyles.search_title} style={{ marginRight: '0.2rem' }}>
                                                    <span style={{ color: 'red', position: 'relative', top: '-0.2rem' }}>*</span>
                                                    등록할 설비명
                                                </div>
                                                <CustomInput
                                                    value={inputEqName}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(e) => setInputEqName(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    style={{ flex: 1 }}
                                                />
                                            </div>
                                            {(!selectedNotEq || Object.keys(selectedNotEq).length === 0) ?
                                            <></> : ( <button className={pdsStyles.select_button} onClick={() => handleSelect(selectedNotEq)}>등록</button> )}
                                        </div>

    
                                    </div>
                                </Card>
                            </>
                        )}
                        {selectedButton === '배출원 관리' && (
                            <>
                                <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                                    <TableCustom
                                        title="배출원목록"
                                        columns={equipEmissionColumns}
                                        data={emissions}
                                        buttons={['Delete']}
                                        onClicks={[onDeleteClick]}
                                        onRowClick={handleEmClick}
                                        modals={[
                                            {
                                                modalType: 'Delete',
                                                isModalOpen: isModalOpen.Delete,
                                                handleOk: handleOk('Delete'),
                                                handleCancel: handleCancel('Delete'),
                                                rowData: selectedEms,
                                                rowDataName: "equipName",
                                                url: '/equip/emission',
                                            }
                                        ]}
                                        selectedRows={[selectedEms]}
                                        keyProp={emissions.length}
                                    />
                                </Card>
                                <Card sx={{ width: "50%", height: "auto", borderRadius: "0.5rem" }}>
                                    <div className={pdsStyles.card_container}>
                                        <div className={pdsStyles.table_title}>배출원 등록</div>
                                        <div className={pdsStyles.search_container} style={{ gap: '5px', padding: '16px 8px' }}>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비명</div>
                                                <CustomInput
                                                    value={inputEqLib}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(e) => setInputEqLib(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    style={{ width: '7rem' }}
                                                />
                                            </div>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비LIB명</div>
                                                <CustomInput
                                                    value={inputEqLib}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(e) => setInputEqLib(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    style={{ width: '7rem' }}
                                                />
                                            </div>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비유형</div>
                                                <CustomSelect
                                                    value={inputEqType}
                                                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                    onChange={(value) => setInputEqType(value)}
                                                    style={{ width: '10rem' }}
                                                    placeholder="설비유형 선택"
                                                >
                                                    {eqTypeList.map((item) => (
                                                        <Option key={item.code} value={item.name}>
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                                </CustomSelect>
                                            </div>
                                            <div className={pdsStyles.search_item}>
                                                <div className={pdsStyles.search_title}>설비구분</div>
                                                <div className={pdsStyles.input_with_btn} style={{ gap: 0 }}>
                                                    <CustomSelect
                                                        value={inputEqDvs}
                                                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                                                        onChange={(value) => setInputEqDvs(value)}
                                                        style={{ width: '7rem' }}
                                                        placeholder="설비구분 선택"
                                                    >
                                                        {eqDvsList.map((item) => (
                                                            <Option key={item.code} value={item.name}>
                                                                {item.name}
                                                            </Option>
                                                        ))}
                                                    </CustomSelect>
                                                    <button className={pdsStyles.search_button} onClick={handleSearch} style={{ width: '3rem' }}>조회</button>
                                                </div>
                                            </div>
                                            
                                        </div>

                                        <div className={pdsStyles.result_container}>
                                            {(!notEqs || Object.keys(notEqs).length === 0) ? 
                                            <></> : <Table key={JSON.stringify(equips.length)} data={notEqs} columns={equipColumns} variant='checkbox' onRowClick={handleNotEqClick} modalPagination={true} />
                                            }
                                            {(!selectedNotEq || Object.keys(selectedNotEq).length === 0) ?
                                            <></> : ( <button className={pdsStyles.select_button} onClick={() => handleSelect(selectedNotEq)}>등록</button> )}
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
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