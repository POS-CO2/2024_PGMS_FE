import React, { useState, useRef } from 'react';
import { Modal, Button, Upload, Select } from 'antd';
import { PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import * as modalStyles from "../assets/css/pdModal.css";
import * as rmStyles from "../assets/css/rmModal.css";
import * as delStyle from "../assets/css/delModal.css";
import * as sdStyles from "../assets/css/sdModal.css";
import * as ps12Styles from "../assets/css/ps12UploadExcelModal.css";
import Table from "../Table";
import { employee } from "../assets/json/manager.js"
import emsData from "../assets/json/ems";
import { selectYear, selectMonth } from "../assets/json/sd";
import * as sysStyles from "../assets/css/sysmng.css"
import { TextField, Box, InputLabel, MenuItem, FormControl } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export function PdAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [showResults, setShowResults] = useState(false);    // 사원 목록을 표시할지 여부
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list

    // 각 input의 값을 상태로 관리
    const [empId, setEmpId] = useState('');
    const [empName, setEmpName] = useState('');
    const [dept, setDept] = useState('');

    // 찾기 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);

        // 백엔드로 데이터를 전송
        const searchParams = {
            empId,
            empName,
            dept,
        };
    };

    // 사원 row 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps((prevSelectedEmp) => {
            // 선택된 사원의 loginId가 이미 배열에 존재하는지 확인
            if (prevSelectedEmp.includes(emp.loginId)) {
                // 존재한다면 배열에서 제거
                return prevSelectedEmp.filter((id) => id !== emp.loginId);
            } else {
                // 존재하지 않는다면 배열에 추가
                return [...prevSelectedEmp, emp.loginId];
            }
        });
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedEmps);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>현장 담당자 지정</div>
            <div className={modalStyles.search_container}>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>사번</div>
                    <input className={modalStyles.search} />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>이름</div>
                    <input className={modalStyles.search} />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>부서</div>
                    <div className={modalStyles.input_with_btn}>
                        <input className={modalStyles.search} />
                        <button className={modalStyles.search_button} onClick={handleSearch}>조회</button>
                    </div>
                </div>
            </div>

            <div className={modalStyles.result_container}>
                {showResults ? <Table data={employee} variant='checkbox' onRowClick={handleEmpClick} />
                    : <></>}
            </div>

            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function RmAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 등록 버튼 클릭 시 호출될 함수(등록할 매출액의 data를 전달)
    const handleSelect = () => {
        const formData = {
            pjtCode: document.getElementById('pjtCode').value,
            pjtName: document.getElementById('pjtName').value,
            year: document.getElementById('year').value,
            month: document.getElementById('month').value,
            saleAmt: document.getElementById('saleAmt').value,
        };
        handleOk(formData);  // 입력된 데이터를 handleOk 함수로 전달
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            style={{ width: '25rem', maxWidth: '25rem', important: true }}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>매출액 등록</div>

            <div className={rmStyles.search_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>프로젝트코드</div>
                    <input className={rmStyles.search} id="pjtCode" />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>프로젝트명</div>
                    <input className={rmStyles.search} id="pjtName" />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>년</div>
                    <input className={rmStyles.search} id="year" />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>월</div>
                    <input className={rmStyles.search} id="month" />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>매출액</div>
                    <input className={rmStyles.search} id="saleAmt" />
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function FlAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 등록 버튼 클릭 시 호출될 함수(등록할 설비LIB의 data를 전달)
    const handleSelect = () => {
        const formData = {
            eqLibName: document.getElementById('eqLibName').value,
            eqDvs: document.getElementById('eqDvs').value,
            eqType: document.getElementById('eqType').value,
            eqSpecUnit: document.getElementById('eqSpecUnit').value,
        };

        handleOk(formData);  // 입력된 데이터를 handleOk 함수로 전달
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            style={{ width: '25rem', maxWidth: '25rem', important: true }}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>설비LIB 등록</div>

            <div className={rmStyles.search_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비라이브러리명</div>
                    <input className={rmStyles.search} id="eqLibName" />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비구분</div>
                    <Select id="eqDvs">
                        <Select.Option key={"구분1"} value={"구분1"}>{"구분1"}</Select.Option>
                        <Select.Option key={"구분2"} value={"구분2"}>{"구분2"}</Select.Option>
                        <Select.Option key={"구분3"} value={"구분3"}>{"구분3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비유형</div>
                    <Select id="eqType">
                        <Select.Option key={"유형1"} value={"유형1"}>{"유형1"}</Select.Option>
                        <Select.Option key={"유형2"} value={"유형2"}>{"유형2"}</Select.Option>
                        <Select.Option key={"유형3"} value={"유형3"}>{"유형3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비사양단위</div>
                    <Select id="eqSpecUnit">
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function Ps12UploadExcelModal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달
    const fileInputRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const onUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFileList(prevFiles => {
            const existingFileNames = new Set(prevFiles.map(file => file.name));
            const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
            return [...prevFiles, ...filteredNewFiles];
        });
        // Clear the input value to handle the same file being selected again
        event.target.value = null;
    };

    const handleFileRemove = (fileName) => {
        setFileList(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={450}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>엑셀 업로드</div>

            <div className={ps12Styles.header_container}>
                <div className={ps12Styles.input_title}>
                    첨부파일
                    <span className={ps12Styles.requiredAsterisk}>*</span>
                </div>
                <div>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        multiple
                        accept=".xlt,.xls,.xlsx"
                        style={{ display: 'none' }} // 숨김 처리
                        ref={fileInputRef} // useRef로 참조
                        onChange={handleFileChange} // 파일 선택 시 호출
                    />
                    <button type="button" onClick={onUploadClick} className={ps12Styles.upload_button}>
                        파일선택 <PaperClipOutlined />
                    </button>
                </div>
            </div>

            <div className={ps12Styles.file_list_container}>
                <div className={ps12Styles.file_list}>
                    {fileList.length === 0 ? (
                        <></>
                    ) : (
                        fileList.map((file, index) => (
                            <div key={index} className={ps12Styles.file_item}>
                                {file.name}
                                <button
                                    type="button"
                                    className={ps12Styles.remove_button}
                                    onClick={() => handleFileRemove(file.name)}
                                >
                                    <CloseOutlined />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button className={ps12Styles.select_button} onClick={handleOk}>등록</button>
        </Modal>
    )
}

export function DelModal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            centered                     // 모달이 기본적으로 가운데 오도록 설정
            style={{
                width: '20rem',
                maxWidth: '20rem',
                important: true
            }}
            footer={null}
        >
            <div className={delStyle.container}>
                <WarningAmberIcon style={{ fontSize: '2rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                정말 삭제하시겠습니까?
            </div>
            <div className={delStyle.buttonContainer}>
                <button className={delStyle.cancelButton} onClick={handleCancel}>취소</button>
                <button className={delStyle.okButton} onClick={handleOk}>삭제</button>
            </div>
        </Modal>
    )
}

export function CmAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk();
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <TextField id='codeGroupName' label="코드 그룹 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeGroupNameEng' label="영문 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function CmEditModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        console.log(selectedEmps);
        handleOk(selectedEmps);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <TextField id='codeGroupName' label="코드 그룹 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeGroupNameEng' label="영문 명" variant='outlined' sx={{ width: "20rem" }} />
                    {/* <div className={sysStyles.text}>{"접근 권한"}</div>
                    <Box sx={{ minWidth: "20rem" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">권한</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={access}
                        label="권한"
                        onChange={handleAccess}
                        >
                        <MenuItem value={'현장담당자'}>현장담당자</MenuItem>
                        <MenuItem value={'본사담당자'}>본사담당자</MenuItem>
                        <MenuItem value={'관리자'}>관리자</MenuItem>
                        </Select>
                    </FormControl>
                    </Box> */}
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function DeleteModal({ isModalOpen, handleOk, handleCancel }) {

    const [deleteItem, setDeleteItem] = useState(false);

    const handleDelete = () => {
        setDeleteItem(true)
        handleOk(deleteItem);
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div>정말 삭제하시겠습니까?</div>
            <button className={modalStyles.select_button} onClick={handleDelete}>확인</button>
        </Modal>
    )
}

export function CmListAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk();
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    <TextField id='codeName' label="코드 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeNameEng' label="영문 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function CmListEditModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        console.log(selectedEmps);
        handleOk(selectedEmps);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    <TextField id='codeName' label="코드 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeNameEng' label="영문 명" variant='outlined' sx={{ width: "20rem" }} />
                    {/* <div className={sysStyles.text}>{"접근 권한"}</div>
                    <Box sx={{ minWidth: "20rem" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">권한</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={access}
                        label="권한"
                        onChange={handleAccess}
                        >
                        <MenuItem value={'현장담당자'}>현장담당자</MenuItem>
                        <MenuItem value={'본사담당자'}>본사담당자</MenuItem>
                        <MenuItem value={'관리자'}>관리자</MenuItem>
                        </Select>
                    </FormControl>
                    </Box> */}
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function FmAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [showResults, setShowResults] = useState(false);    // 사원 목록을 표시할지 여부
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list

    // 각 input의 값을 상태로 관리
    const [empId, setEmpId] = useState('');
    const [empName, setEmpName] = useState('');
    const [dept, setDept] = useState('');

    // 찾기 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);

        // 백엔드로 데이터를 전송
        const searchParams = {
            empId,
            empName,
            dept,
        };
    };

    // 사원 row 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps((prevSelectedEmp) => {
            // 선택된 사원의 loginId가 이미 배열에 존재하는지 확인
            if (prevSelectedEmp.includes(emp.loginId)) {
                // 존재한다면 배열에서 제거
                return prevSelectedEmp.filter((id) => id !== emp.loginId);
            } else {
                // 존재하지 않는다면 배열에 추가
                return [...prevSelectedEmp, emp.loginId];
            }
        });
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedEmps);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>현장 담당자 지정</div>

            <div className={modalStyles.result_container}>
                <Table data={employee} variant='checkbox' onRowClick={handleEmpClick} />
            </div>

            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function UmAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [showResults, setShowResults] = useState(false);    // 사원 목록을 표시할지 여부
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list
    const access = [
        {
            value: 'None',
            label: 'None'
        },
        {
            value: '현장담당자',
            label: '현장담당자'
        },
        {
            value: '본사담당자',
            label: '본사담당자'
        },
        {
            value: '시스템관리자',
            label: '시스템관리자'
        },
    ]

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedEmps);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>사용자 등록</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"로그인 ID"}
                    </div>
                    <TextField id='loginId' label="로그인 ID" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"이름"}</div>
                    <TextField id='userName' label="이름" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"사업장"}</div>
                    <TextField id='brnachName' label="사업장" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"권한"}</div>
                    <TextField
                        id="outlined-select-currency-native"
                        select
                        label="권한"
                        defaultValue="None"
                        SelectProps={{
                            native: true,
                        }}
                        sx={{ width: "20rem" }}
                    >
                        {access.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function MmAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [showResults, setShowResults] = useState(false);    // 사원 목록을 표시할지 여부
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list
    const access = [
        {
            value: 'None',
            label: 'None'
        },
        {
            value: '현장담당자',
            label: '현장담당자'
        },
        {
            value: '본사담당자',
            label: '본사담당자'
        },
        {
            value: '시스템관리자',
            label: '시스템관리자'
        },
    ]

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedEmps);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>메뉴 등록</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"메뉴 이름"}
                    </div>
                    <TextField id='menuName' label="메뉴 이름" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"상위 폴더"}</div>
                    <TextField id='parentDir' label="상위 폴더" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"접근 권한"}</div>
                    <TextField
                        id="outlined-select-currency-native"
                        select
                        label="접근 권한"
                        defaultValue="현장담당자"
                        SelectProps={{
                            native: true,
                        }}
                        sx={{ width: "20rem" }}
                    >
                        {access.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function EsmAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedEmtns, setSelectedEmtns] = useState([]);

    // 배출원 row 클릭 시 호출될 함수
    const handleEmtnClick = (row) => {
        setSelectedEmtns(row.equipName);
        console.log(selectedEmtns);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={800}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>배출원 등록</div>

            <Table data={emsData} variant='checkbox' onRowClick={handleEmtnClick} />

            <button className={modalStyles.select_button} onClick={handleOk}>등록</button>
        </Modal>
    )
}

export function SdAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const fileInputRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const onUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFileList(prevFiles => {
            const existingFileNames = new Set(prevFiles.map(file => file.name));
            const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
            return [...prevFiles, ...filteredNewFiles];
        });
        // Clear the input value to handle the same file being selected again
        event.target.value = null;
    };
    const handleFileRemove = (fileName) => {
        setFileList(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>증빙서류 등록</div>

            <div className={sdStyles.input_container}>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        대상년월
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <div className={sdStyles.select_item}>
                        <Select defaultValue="2024">
                            {selectYear.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>년</div>
                        <Select defaultValue="01">
                            {selectMonth.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>월</div>
                    </div>
                </div>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        자료명
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <input
                        className={sdStyles.search}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>비고</div>
                    <input
                        className={sdStyles.search}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <div className={sdStyles.upload_item}>
                    <div className={sdStyles.upload_header}>
                        <div className={sdStyles.input_title}>첨부파일</div>
                        <div>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                multiple
                                style={{ display: 'none' }} // 숨김 처리
                                ref={fileInputRef} // useRef로 참조
                                onChange={handleFileChange} // 파일 선택 시 호출
                            />
                            <button type="button" onClick={onUploadClick} className={sdStyles.upload_button}>
                                파일선택 <PaperClipOutlined />
                            </button>
                        </div>
                    </div>
                    <div className={sdStyles.file_list_container}>
                        <div className={sdStyles.file_list}>
                            {fileList.length === 0 ? (
                                <></>
                            ) : (
                                fileList.map((file, index) => (
                                    <div key={index} className={sdStyles.file_item}>
                                        {file.name}
                                        <button
                                            type="button"
                                            className={sdStyles.remove_button}
                                            onClick={() => handleFileRemove(file.name)}
                                        >
                                            <CloseOutlined />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button className={sdStyles.select_button} onClick={handleOk}>저장</button>
        </Modal>
    )
}

export function SdShowDetailsModal({ selectedSd, isModalOpen, handleOk, handleCancel }) {
    /*const [actvYear, setActvYear] = useState(selectedSd?.actvYear || '');
    const [actvMonth, setActvMonth] = useState(selectedSd?.actvMonth || '');
    const [name, setName] = useState(selectedSd.name);
    const [note, setNote] = useState('');*/
    const fileInputRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const onUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFileList(prevFiles => {
            const existingFileNames = new Set(prevFiles.map(file => file.name));
            const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
            return [...prevFiles, ...filteredNewFiles];
        });
        // Clear the input value to handle the same file being selected again
        event.target.value = null;
    };
    const handleFileRemove = (fileName) => {
        setFileList(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>증빙서류 상세보기</div>

            <div className={sdStyles.input_container}>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        대상년월
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <div className={sdStyles.select_item}>
                        <Select defaultValue={selectedSd.actvYear}>
                            {selectYear.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>년</div>
                        <Select defaultValue={actvMonth}>
                            {selectMonth.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>월</div>
                    </div>
                </div>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        자료명
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <input
                        className={sdStyles.search}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>비고</div>
                    <input
                        className={sdStyles.search}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <div className={sdStyles.upload_item}>
                    <div className={sdStyles.upload_header}>
                        <div className={sdStyles.input_title}>첨부파일</div>
                        <div>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                multiple
                                style={{ display: 'none' }} // 숨김 처리
                                ref={fileInputRef} // useRef로 참조
                                onChange={handleFileChange} // 파일 선택 시 호출
                            />
                            <button type="button" onClick={onUploadClick} className={sdStyles.upload_button}>
                                파일선택 <PaperClipOutlined />
                            </button>
                        </div>
                    </div>
                    <div className={sdStyles.file_list_container}>
                        <div className={sdStyles.file_list}>
                            {fileList.length === 0 ? (
                                <></>
                            ) : (
                                fileList.map((file, index) => (
                                    <div key={index} className={sdStyles.file_item}>
                                        {file.name}
                                        <button
                                            type="button"
                                            className={sdStyles.remove_button}
                                            onClick={() => handleFileRemove(file.name)}
                                        >
                                            <CloseOutlined />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button className={sdStyles.select_button} onClick={handleOk}>저장</button>
        </Modal>
    )
}