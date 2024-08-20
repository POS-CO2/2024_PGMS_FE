import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Upload, Select } from 'antd';
import { PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import * as modalStyles from "../assets/css/pdModal.css";
import * as rmStyles from "../assets/css/rmModal.css";
import * as delStyle from "../assets/css/delModal.css";
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import * as sysStyles from "../assets/css/sysmng.css"
import * as sdStyles from "../assets/css/sdModal.css";
import * as ps12Styles from "../assets/css/ps12UploadExcelModal.css";
import { EditButton } from "../Button";
import Table from "../Table";
import project from "../assets/json/project"
import { actv } from "../assets/json/selectedPjt";
import emsData from "../assets/json/ems";
import { selectYear, selectMonth } from "../assets/json/sd";
import { TextField, Box, InputLabel, MenuItem, FormControl, Autocomplete } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Sledding } from '@mui/icons-material';
import axiosInstance from '../utils/AxiosInstance.js';

export function PgAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [formData, setFormData] = useState({});             // 검색 데이터
    const [selectedPjts, setSelectedPjts] = useState([]);     // 선택된 프로젝트
    
    //찾기 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data); 
    };
  
    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (pjts) => {
        setSelectedPjts(pjts.map(item => item.PjtCode));   // 클릭된 프로젝트의 코드로 상태를 설정
    };
  
    // 선택 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedPjts);                            // 선택된 프로젝트 데이터를 handleOk로 전달
    };
  
    return (
      <Modal 
        open={isModalOpen} 
        width={1300}
        onCancel={handleCancel} 
        footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
      >
        <div className={pjtModalStyles.title}>프로젝트 등록</div>
        <p className={pjtModalStyles.comment}>* 프로젝트 코드나 프로젝트 명 둘 중에 하나만 입력해도 검색이 가능합니다.</p>
        <div className={pjtModalStyles.search_container}>
          <div className={pjtModalStyles.search_item}>
            <div className={pjtModalStyles.search_title}>프로젝트코드</div>
            <input className={pjtModalStyles.search_code}/>
          </div>
          <div className={pjtModalStyles.search_item}>
            <div className={pjtModalStyles.search_title}>프로젝트명</div>
            <div className={pjtModalStyles.search_container}>
              <input className={pjtModalStyles.search_name}/>
              <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
            </div>
          </div>
        </div>
  
        <div className={pjtModalStyles.result_container}>
  
        {(!formData || Object.keys(formData).length === 0) ?
              <></> : ( <Table data={project} variant='checkbox' onRowClick={handlePjtClick} /> )}
        </div>
  
        <button className={pjtModalStyles.select_button} onClick={handleSelect}>등록</button>
      </Modal>
    )
}

export function PdAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [formData, setformData] = useState({});
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list
    
    // 각 input의 값을 상태로 관리
    const [empId, setEmpId] = useState('');
    const [empName, setEmpName] = useState('');

    // input 필드 변경 시 호출될 함수
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };
    
    // 찾기 버튼 클릭 시 호출될 함수
    const handleSearch = async() => {
        try {
            const response = await axiosInstance.get(`/pjt/not-manager?loginId=${empId}&userName=${empName}`);

            // 필요한 필드만 추출하여 managers에 설정
            const filteredResponse = response.data.map(emp => ({
                id: emp.id,
                사번: emp.loginId,
                이름: emp.userName,
                부서: emp.deptCode,
                권한: emp.role
            }));

            setformData(filteredResponse);
        } catch (error) {
            console.log(error);
        }
    };

    // 엔터 키 입력 시 handleFormSubmit 호출
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();  // 폼의 기본 제출 동작 방지
        handleSearch();
        }
    };

    // 사원 row 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps(emp);
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        setformData({});
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
                    <input 
                        className={modalStyles.search} 
                        onChange={(e) => handleInputChange(e, setEmpId)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>이름</div>
                    <div className={modalStyles.input_with_btn}>
                        <input 
                            className={modalStyles.search} 
                            onChange={(e) => handleInputChange(e, setEmpName)} 
                            onKeyDown={handleKeyDown}
                        />
                        <button className={modalStyles.search_button} onClick={handleSearch}>조회</button>
                    </div>
                </div>
            </div>

            <div className={modalStyles.result_container}>
                {(!formData || Object.keys(formData).length === 0) ? 
                <></> : <Table data={formData} variant='checkbox' onRowClick={handleEmpClick} />
                }
            </div>

            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function RmAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    // 등록 버튼 클릭 시 호출될 함수(등록할 매출액의 data를 전달)
    const handleSelect = () => {
        // 입력 필드의 값 가져오기
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const salesAmt = document.getElementById('salesAmt').value;
        
        // 에러 필드 및 메시지 초기화
        const yearField = document.getElementById('year');
        const monthField = document.getElementById('month');
        const salesAmtField = document.getElementById('salesAmt');

        // 에러 메시지 요소
        const yearError = document.getElementById('year-error');
        const monthError = document.getElementById('month-error');
        const salesAmtError = document.getElementById('salesAmt-error');

        yearField.classList.remove(rmStyles.error);
        monthField.classList.remove(rmStyles.error);
        salesAmtField.classList.remove(rmStyles.error);

        yearError.textContent = '';
        monthError.textContent = '';
        salesAmtError.textContent = '';

        // 별표 제거
        document.getElementById('year-star').textContent = '';
        document.getElementById('month-star').textContent = '';
        document.getElementById('salesAmt-star').textContent = '';

        let hasError = false;

        // 유효성 검사
        if (!year) {
            yearField.classList.add(rmStyles.error); // 오류 클래스 추가
            yearError.textContent = `'년' is required`; // 오류 메시지 설정
            document.getElementById('year-star').textContent = '*'; // 빨간색 별표 추가
            hasError = true;
        }
        if (!month) {
            monthField.classList.add(rmStyles.error); // 오류 클래스 추가
            monthError.textContent = `'월' is required`; // 오류 메시지 설정
            document.getElementById('month-star').textContent = '*'; // 빨간색 별표 추가
            hasError = true;
        }
        if (!salesAmt) {
            salesAmtField.classList.add(rmStyles.error); // 오류 클래스 추가
            salesAmtError.textContent = `'매출액' is required`; // 오류 메시지 설정
            document.getElementById('salesAmt-star').textContent = '*'; // 빨간색 별표 추가
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const formData = {
            year,
            month,
            salesAmt,
        };

        // 부모 컴포넌트에 데이터 전달
        handleOk(formData);

        // 입력창 초기화
        yearField.value = '';
        monthField.value = '';
        salesAmtField.value = '';
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
                        id="pjtCode"
                        className={rmStyles.search} 
                        value={rowData.pjtCode} 
                        readOnly
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>프로젝트명</div>
                    <input 
                        id="pjtName" 
                        className={rmStyles.search} 
                        value={rowData.pjtName} 
                        readOnly
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>
                        년<span id="year-star" className={rmStyles.error_star}></span>
                    </div>
                    <input 
                        id="year"
                        className={rmStyles.search} 
                        required
                    />
                    <div id="year-error" className={rmStyles.error_message}></div>
                </div>
                <div className={rmStyles.search_item}>
                <div className={rmStyles.search_title}>
                        월<span id="month-star" className={rmStyles.error_star}></span>
                    </div>
                    <input 
                        id="month" 
                        className={rmStyles.search} 
                        required
                    />
                    <div id="month-error" className={rmStyles.error_message}></div>
                </div>
                <div className={rmStyles.search_item}>
                <div className={rmStyles.search_title}>
                        매출액<span id="salesAmt-star" className={rmStyles.error_star}></span>
                    </div>
                    <input 
                        id="salesAmt" 
                        className={rmStyles.search} 
                        required
                    />
                    <div id="salesAmt-error" className={rmStyles.error_message}></div>
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

export function FlEditModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [formValues, setFormValues] = useState({
        eqLibName: '',
        equipDvs: '',
        equipType: '',
        equipSpecUnit: ''
    });

    // 모달이 열릴 때 rowData로부터 폼 필드 값을 설정
    useEffect(() => {
        if (isModalOpen && rowData) {
            setFormValues({
                eqLibName: rowData.EquipName || '',
                equipDvs: rowData.equipDvs || '',
                equipType: rowData.equipType || '',
                equipSpecUnit: rowData.equipSpecUnit || '',
            });
        }
    }, [rowData, isModalOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const handleSelect = () => {
        handleOk(formValues);
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
                    <input 
                        className={rmStyles.search} 
                        value={formValues.eqLibName}
                        onChange={handleChange}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비구분</div>
                    <Select 
                        value={formValues.equipDvs}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, actvDvs: value }))}
                    >
                        <Select.Option key={"구분1"} value={"구분1"}>{"구분1"}</Select.Option>
                        <Select.Option key={"구분2"} value={"구분2"}>{"구분2"}</Select.Option>
                        <Select.Option key={"구분3"} value={"구분3"}>{"구분3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비유형</div>
                    <Select 
                        value={formValues.equipType}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, actvDvs: value }))}
                    >
                        <Select.Option key={"유형1"} value={"유형1"}>{"유형1"}</Select.Option>
                        <Select.Option key={"유형2"} value={"유형2"}>{"유형2"}</Select.Option>
                        <Select.Option key={"유형3"} value={"유형3"}>{"유형3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비사양단위</div>
                    <Select 
                        value={formValues.equipSpecUnit}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, actvDvs: value }))}
                    >
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                </div>
            </div>
            
            <button className={rmStyles.select_button} onClick={handleSelect}>수정</button>
        </Modal>
    )
}

export function FamAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 등록 버튼 클릭 시 호출될 함수(등록할 활동자료의 data를 전달)
    const handleSelect = () => {
        const formData = {
            actvName: document.getElementById('actvName').value,
            actvDvs: document.getElementById('actvDvs').value,
            emtnActvType: document.getElementById('emtnActvType').value,
            calUnit: document.getElementById('calUnit').value,
            inputUnit: document.getElementById('inputUnit').value,
            unitConvCoef: document.getElementById('unitConvCoef').value,
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
            <div className={rmStyles.title}>활동자료 등록</div>

            <div className={rmStyles.search_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료명</div>
                    <input className={rmStyles.search} id="actvName" />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료구분</div>
                    <Select id="actvDvs">
                        <Select.Option key={"구분1"} value={"구분1"}>{"구분1"}</Select.Option>
                        <Select.Option key={"구분2"} value={"구분2"}>{"구분2"}</Select.Option>
                        <Select.Option key={"구분3"} value={"구분3"}>{"구분3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>배출활동유형</div>
                    <Select id="emtnActvType">
                        <Select.Option key={"유형1"} value={"유형1"}>{"유형1"}</Select.Option>
                        <Select.Option key={"유형2"} value={"유형2"}>{"유형2"}</Select.Option>
                        <Select.Option key={"유형3"} value={"유형3"}>{"유형3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>산정단위</div>
                    <Select id="calUnit">
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>입력단위</div>
                    <Select id="inputUnit">
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>단위환산계수</div>
                    <input className={rmStyles.search} id="unitConvCoef" />
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function FamEditModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [formValues, setFormValues] = useState({
        actvName: '',
        actvDvs: '',
        emtnActvType: '',
        calUnit: '',
        inputUnit: '',
        unitConvCoef: ''
    });

    // 모달이 열릴 때 rowData로부터 폼 필드 값을 설정
    useEffect(() => {
        if (isModalOpen && rowData) {
            setFormValues({
                actvName: rowData.actvDataName || '',
                actvDvs: rowData.actvDataDvs || '',
                emtnActvType: rowData.emtnActvType || '',
                calUnit: rowData.calUnit || '',
                inputUnit: rowData.inputUnit || '',
                unitConvCoef: rowData.unitConvCoef || ''
            });
        }
    }, [rowData, isModalOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const handleSelect = () => {
        handleOk(formValues);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            style={{ width: '25rem', maxWidth: '25rem', important: true }}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>활동자료 수정</div>

            <div className={rmStyles.search_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료명</div>
                    <input
                        className={rmStyles.search}
                        value={formValues.actvName}
                        onChange={handleChange}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료구분</div>
                    <Select
                        value={formValues.actvDvs}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, actvDvs: value }))}
                    >
                        <Select.Option key={"구분1"} value={"구분1"}>{"구분1"}</Select.Option>
                        <Select.Option key={"구분2"} value={"구분2"}>{"구분2"}</Select.Option>
                        <Select.Option key={"구분3"} value={"구분3"}>{"구분3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>배출활동유형</div>
                    <Select
                        value={formValues.emtnActvType}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, emtnActvType: value }))}
                    >
                        <Select.Option key={"유형1"} value={"유형1"}>{"유형1"}</Select.Option>
                        <Select.Option key={"유형2"} value={"유형2"}>{"유형2"}</Select.Option>
                        <Select.Option key={"유형3"} value={"유형3"}>{"유형3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>산정단위</div>
                    <Select
                        value={formValues.calUnit}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, calUnit: value }))}
                    >
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>입력단위</div>
                    <Select
                        value={formValues.inputUnit}
                        onChange={(value) => setFormValues(prevValues => ({ ...prevValues, inputUnit: value }))}
                    >
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>단위환산계수</div>
                    <input
                        className={rmStyles.search}
                        value={formValues.unitConvCoef}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>수정</button>
        </Modal>
    )
}

export function FadAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [formData, setFormData] = useState({});             // 검색 데이터
    const [selectedActves, setselectedActves] = useState([]);     // 선택된 프로젝트
    
    // 찾기 버튼 클릭시 호출될 함수
    const handleFormSubmit = (data) => {
        setFormData(data); 
    };
  
    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (actves) => {
        setselectedActves(actves.map(actv => actv.actvDataName));
    };
  
    // 선택 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedActves);
    };
  
    return (
      <Modal 
        open={isModalOpen} 
        width={800}
        onCancel={handleCancel} 
        footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
      >
        <div className={pjtModalStyles.title}>활동자료 지정</div>
        <p className={pjtModalStyles.comment}>* 활동자료명이나 활동자료구분 둘 중에 하나만 입력해도 검색이 가능합니다.</p>
        <div className={pjtModalStyles.search_container}>
            <div className={pjtModalStyles.search_item}>
                <div className={pjtModalStyles.search_title}>활동자료명</div>
                <input className={pjtModalStyles.search_code}/>
            </div>
            <div className={pjtModalStyles.search_item}>
                <div className={pjtModalStyles.search_title}>활동자료구분</div>
                <div className={modalStyles.input_with_btn}>
                    <Select style={{ width: '250px' }}>
                        <Select.Option key={"단위1"} value={"단위1"}>{"단위1"}</Select.Option>
                        <Select.Option key={"단위2"} value={"단위2"}>{"단위2"}</Select.Option>
                        <Select.Option key={"단위3"} value={"단위3"}>{"단위3"}</Select.Option>
                    </Select>
                    <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
                </div>
            </div>
        </div>
  
        <div className={pjtModalStyles.result_container}>
            {(!formData || Object.keys(formData).length === 0) ?
                <></> : ( <Table data={actv} variant='checkbox' onRowClick={handleActvClick} /> )}
        </div>
  
        <button className={pjtModalStyles.select_button} onClick={handleSelect}>등록</button>
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

export function DelModal({ isModalOpen, handleOk, handleCancel, rowData }) { // '엑셀 업로드' 모달
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
                <button className={delStyle.cancelButton} onClick={() => {handleCancel}}>취소</button>
                <button className={delStyle.okButton} onClick={() => {handleOk(rowData)}}>삭제</button>
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
            style={{
                top: "35%"
            }}
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div>정말 삭제하시겠습니까?</div>
            <div style={{display:"flex"}}>
            <button className={modalStyles.cancel_button} style={{width:"45%"}} onClick={handleDelete}>취소</button>
            <button className={modalStyles.select_button} style={{width:"45%"}} onClick={handleDelete}>확인</button>
            </div>
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
    const [showResults, setShowResults] = useState(false);    // 목록을 표시할지 여부
    const [selectedSulbi, setSelectedSulbi] = useState([]);     // 선택된 Id list
    const [sulbiLib, setSulbiLib] = useState([]);

    // 설비 라이브러리 불러오기 
    useEffect(() => {
        const fetchSulbiLib = async () => {
            try {
                const {data}= await axiosInstance.get("/equip/lib");
                setSulbiLib(data);    
            } catch (error) {
                console.log(error);
            }
            
        };
        fetchSulbiLib(); // 컴포넌트 마운트 될 때 데이터불러옴
    }, [])

    // 찾기 버튼 클릭 시 호출될 함수
    const handleSearch = () => {
        setShowResults(true);

    };

    // row 클릭 시 호출될 함수
    const handleSulbiClick = (sulbi) => {
        setSelectedSulbi((prevSelectedSulbi) => {
            // 선택된 Id가 이미 배열에 존재하는지 확인
            if (prevSelectedSulbi.includes(sulbi.id)) {
                // 존재한다면 배열에서 제거
                return prevSelectedSulbi.filter((id) => id !== sulbi.id);
            } else {
                // 존재하지 않는다면 배열에 추가
                return [...prevSelectedSulbi, sulbi.id];
            }
        });
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        handleOk(selectedSulbi);
    };


    const defaultProps = {
        options: sulbiLib,
        getOptionLabel: (option) => option.equipLibName
    };

    const flatProps = {
        options: sulbiLib.map((option) => option.label),
    };

    const [value1, setValue] = useState([]);

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={680}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>설비 지정</div>
            <div className={modalStyles.search_container}>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>설비LIB명</div>
                    <Autocomplete
                        {...defaultProps}
                        id="blur-on-select"
                        blurOnSelect
                        disableClearable
                        onChange={(e, v) => setValue([v])}
                        renderInput={(params) => (
                            <TextField {...params} variant="standard" sx={{ width: "10rem" }} />
                        )}
                    />
                </div>
                <div className={modalStyles.input_with_btn}>
                    <button className={modalStyles.search_button} style={{ marginTop: "1rem" }} onClick={handleSearch}>조회</button>
                </div>
            </div>

            <div className={modalStyles.result_container}>
                {showResults ? <Table data={value1} onRowClick={handleSulbiClick} />
                    : <></>}
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
                        <Select defaultValue={new Date().getFullYear().toString()}>
                            {selectYear.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>년</div>
                        <Select defaultValue={("00" + (new Date().getMonth() + 1)).slice(-2)}>
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
                            <button type="button" onClick={onUploadClick} className={ps12Styles.upload_button}>
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

            <button className={ps12Styles.select_button} onClick={handleOk}>저장</button>
        </Modal>
    )
}

export function SdShowDetailsModal({ selectedSd, isModalOpen, handleOk, handleCancel }) {
    const fileInputRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const [formData, setFormData] = useState({
        actvYear: '',
        actvMonth: '',
        name: '',
        note: '',
        fileList: []
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (selectedSd) {
            setFormData({
                actvYear: selectedSd.actvYear || new Date().getFullYear().toString(),
                actvMonth: selectedSd.actvMonth || ("00" + (new Date().getMonth() + 1)).slice(-2),
                name: selectedSd.name || '',
                note: selectedSd.note || '',
                fileList: Array.isArray(selectedSd.fileList) ? selectedSd.fileList : [] // 배열인지 확인
            });
            setFileList(Array.isArray(selectedSd.fileList) ? selectedSd.fileList : []); // 배열인지 확인
        }
    }, [selectedSd]);

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

    const onSaveClick = () => {
        const updatedFormData = {
            ...formData,
            fileList // 현재 상태의 파일 목록을 추가
        };
        handleOk(updatedFormData, false);  // 입력된 데이터를 handleOk 함수로 전달, 두번째 인자-closeModal=false
        setIsEditing(false); // 저장 후 편집 모드 종료
    };

    const onEditClick = () => {
        if (isEditing) {
            onSaveClick(); // 편집 모드일 때 저장 기능 호출
        } else {
            setIsEditing(true); // 비편집 모드일 때 편집 모드로 전환
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={sdStyles.modal_header}>
                <div className={modalStyles.title}>증빙서류 상세보기</div>
                <div  className={sdStyles.edit_button}>
                <EditButton onClick={onEditClick} isEditing={isEditing} />
                </div>
            </div>

            <div className={sdStyles.input_container}>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        대상년월
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <div className={sdStyles.select_item}>
                        <Select
                            id="actvYear"
                            value={formData.actvYear}
                            onChange={(value) => setFormData(prevData => ({ ...prevData, actvYear: value }))}
                            disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
                        >
                            {selectYear.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>년</div>
                        <Select
                            id="actvMonth"
                            value={formData.actvMonth}
                            onChange={(value) => setFormData(prevData => ({ ...prevData, actvMonth: value }))}
                            disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
                        >
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
                    <input className={sdStyles.search} id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
                        disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
                    />
                </div>
                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>비고</div>
                    <input
                        className={sdStyles.search} id="note"
                        value={formData.note}
                        onChange={(e) => setFormData(prevData => ({ ...prevData, note: e.target.value }))}
                        disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
                    />
                </div>
                <div className={sdStyles.upload_item}>
                    <div className={sdStyles.upload_header}>
                        <div className={sdStyles.input_title}>첨부파일</div>
                        <div>
                            <input
                                type="file"
                                id="fileList"
                                name="fileList"
                                multiple
                                style={{ display: 'none' }} // 숨김 처리
                                ref={fileInputRef} // useRef로 참조
                                onChange={handleFileChange} // 파일 선택 시 호출
                                disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className={ps12Styles.upload_button}
                                disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
                            >
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
                                            disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
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

            <button className={ps12Styles.select_button} onClick={handleOk}>확인</button>
        </Modal>
    )
}
