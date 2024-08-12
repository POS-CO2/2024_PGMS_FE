import React, { useState } from 'react';
import { Modal } from 'antd';
import * as modalStyles from "../assets/css/pdModal.css";
import Table from "../Table";
import { employee } from "../assets/json/manager.js"
import emsData from "../assets/json/ems";
import sdData, {selectOptions} from "../assets/json/sd";
import * as sysStyles from "../assets/css/sysmng.css"
import { TextField, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

export default function PdModal({ isModalOpen, handleOk, handleCancel }) {
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
                    <input className={modalStyles.search}/>
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>이름</div>
                    <input className={modalStyles.search}/>
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>부서</div>
                    <div className={modalStyles.input_with_btn}>
                        <input className={modalStyles.search}/>
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

export function CmAddModal({isModalOpen, handleOk, handleCancel}){
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
                <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <TextField id='codeGroupName' label="코드 그룹 명" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeGroupNameEng' label="영문 명" variant='outlined' sx={{width:"20rem"}}/>
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function CmEditModal({isModalOpen, handleOk, handleCancel}){
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
                <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <TextField id='codeGroupName' label="코드 그룹 명" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeGroupNameEng' label="영문 명" variant='outlined' sx={{width:"20rem"}}/>
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

export function DeleteModal({isModalOpen, handleOk, handleCancel}){

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

export function CmListAddModal({isModalOpen, handleOk, handleCancel}){
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
                <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    <TextField id='codeName' label="코드 명" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeNameEng' label="영문 명" variant='outlined' sx={{width:"20rem"}}/>
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function CmListEditModal({isModalOpen, handleOk, handleCancel}){
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
                <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                    <div className={sysStyles.text}>
                        {"코드 번호"}
                    </div>
                    <TextField id='codeNumber' label="코드 번호" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    <TextField id='codeName' label="코드 명" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeNameEng' label="영문 명" variant='outlined' sx={{width:"20rem"}}/>
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

export function FmAddModal({isModalOpen, handleOk, handleCancel}){
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

export function UmAddModal({isModalOpen, handleOk, handleCancel}){
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
                <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                    <div className={sysStyles.text}>
                        {"로그인 ID"}
                    </div>
                    <TextField id='loginId' label="로그인 ID" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"이름"}</div>
                    <TextField id='userName' label="이름" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"사업장"}</div>
                    <TextField id='brnachName' label="사업장" variant='outlined' sx={{width:"20rem"}}/>
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
                        sx={{width:"20rem"}}
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

export function MmAddModal({isModalOpen, handleOk, handleCancel}){
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
                <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                    <div className={sysStyles.text}>
                        {"메뉴 이름"}
                    </div>
                    <TextField id='menuName' label="메뉴 이름" variant='outlined' sx={{width:"20rem"}}/>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"상위 폴더"}</div>
                    <TextField id='parentDir' label="상위 폴더" variant='outlined' sx={{width:"20rem"}}/>
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
                        sx={{width:"20rem"}}
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

export function EsmDeleteModal({ isModalOpen, handleOk, handleCancel }) {

    return (
        <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>배출원 삭제</div>
            

            <button className={modalStyles.select_button} onClick={handleOk}>삭제</button>
        </Modal>
    )
}

export function SdAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedSd, setSelectedSd] = useState();

    const onAddClick = () => { // 증빙자료 등록 버튼
        console.log("onAddClick");
    };

    // 배출원 row 클릭 시 호출될 함수
    const handleSdClick = (row) => {
        setSelectedSd(row.name);
        console.log(selectedSd);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={500}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>증빙서류 등록</div>

            <div className={modalStyles.search_container}>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>대상년월</div>
                    <input
                        className={modalStyles.search}
                    /*value={pjtCode}
                    onChange={(e) => setPjtCode(e.target.value)}*/
                    />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>자료명</div>
                    <input
                        className={modalStyles.search}
                    /*value={pjtName}
                    onChange={(e) => setPjtName(e.target.value)}*/
                    />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>비고</div>
                    <input
                        className={modalStyles.search}
                    /*value={year}
                    onChange={(e) => setYear(e.target.value)}*/
                    />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>첨부파일</div>
                    <input
                        className={modalStyles.search}
                    /*value={month}
                    onChange={(e) => setMonth(e.target.value)}*/
                    />
                </div>
            </div>

            <button className={modalStyles.select_button} /*onClick={handleSelect}*/>저장</button>


        </Modal>
    )
}