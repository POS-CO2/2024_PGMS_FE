import React, { useState } from 'react';
import { Modal } from 'antd';
import * as modalStyles from "./assets/css/pdModal.css";
import * as rmStyles from "./assets/css/rmModal.css";
import * as delStyle from "./assets/css/delModal.css";
import Table from "./Table";
import { employee } from "./assets/json/manager";
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

export function RmAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 각 입력 필드의 상태 관리
    const [pjtCode, setPjtCode] = useState('');
    const [pjtName, setPjtName] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [saleAmt, setSaleAmt] = useState('');

    // 등록 버튼 클릭 시 호출될 함수(등록할 매출액의 data를 전달)
    const handleSelect = () => {
        const formData = {
            pjtCode,
            pjtName,
            year,
            month,
            saleAmt,
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
                    <input 
                        className={rmStyles.search}
                        value={pjtCode} 
                        onChange={(e) => setPjtCode(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>프로젝트명</div>
                    <input 
                        className={rmStyles.search} 
                        value={pjtName} 
                        onChange={(e) => setPjtName(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>년</div>
                    <input 
                        className={rmStyles.search} 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>월</div>
                    <input 
                        className={rmStyles.search} 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>매출액</div>
                    <input 
                        className={rmStyles.search} 
                        value={saleAmt} 
                        onChange={(e) => setSaleAmt(e.target.value)} 
                    />
                </div>
            </div>
            
            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function Ps12Modal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달

    return (
        <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>엑셀 업로드</div>
            

            <button className={modalStyles.select_button} >등록</button>
        </Modal>
    )
}

export function DelModal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달

    return (
        <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            centered                     // 모달이 기본적으로 가운데 오도록 설정
            style={{ width: '20rem', 
                maxWidth: '20rem', 
                important: true }}
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

export function FlAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 각 입력 필드의 상태 관리
    const [EqLibName, setEquipLibName] = useState('');
    const [EqDvs, setEqDvs] = useState('');
    const [EqType, setEqType] = useState('');
    const [EqSpecUnit, setEqSpecUnit] = useState('');

    // 등록 버튼 클릭 시 호출될 함수(등록할 설비LIB의 data를 전달)
    const handleSelect = () => {
        const formData = {
            pjtCode,
            pjtName,
            year,
            month,
            saleAmt,
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
                    <div className={rmStyles.search_title}>프로젝트코드</div>
                    <input 
                        className={rmStyles.search}
                        value={pjtCode} 
                        onChange={(e) => setPjtCode(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>프로젝트명</div>
                    <input 
                        className={rmStyles.search} 
                        value={pjtName} 
                        onChange={(e) => setPjtName(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>년</div>
                    <input 
                        className={rmStyles.search} 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>월</div>
                    <input 
                        className={rmStyles.search} 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)} 
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>매출액</div>
                    <input 
                        className={rmStyles.search} 
                        value={saleAmt} 
                        onChange={(e) => setSaleAmt(e.target.value)} 
                    />
                </div>
            </div>
            
            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}