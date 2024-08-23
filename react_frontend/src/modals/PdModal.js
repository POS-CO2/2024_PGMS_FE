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
import { actv } from "../assets/json/selectedPjt";
import emsData from "../assets/json/ems";
import { selectYear, selectMonth } from "../assets/json/sd";
import { TextField, Box, InputLabel, MenuItem, FormControl, Autocomplete, createTheme, ThemeProvider  } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Sledding } from '@mui/icons-material';
import axiosInstance from '../utils/AxiosInstance.js';
import { Center } from '@react-three/drei';

export function PgAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [formData, setFormData] = useState({});             // 검색 데이터
    const [selectedPjts, setSelectedPjts] = useState([]);     // 선택된 프로젝트
    const [allProjects, setAllProjects] = useState([]);       // 전체 프로젝트
    const [project, setProject] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get(`/pjt?pgmsYn=n`);
                setAllProjects(response.data);
                setProject(response.data);
            } catch (error) {
                console.log(error);
            }
            
        };
        fetchProject(); // 컴포넌트 마운트 될 때 데이터불러옴
    }, [])

    // input 필드 변경 시 호출될 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    //찾기 버튼 클릭시 호출될 함수
    const handleFormSubmit = () => {
        const filteredProjects = allProjects.filter(pjt => {
        const matchesCode = formData.projectCode ? pjt.pjtCode.includes(formData.projectCode) : true;
        const matchesName = formData.projectName ? pjt.pjtName.includes(formData.projectName) : true;
        return matchesCode && matchesName;
        });
        setProject(filteredProjects);
    };

    // 엔터 키 입력 시 handleFormSubmit 호출
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();  // 폼의 기본 제출 동작 방지
        handleFormSubmit();
        }
    };

    // 프로젝트 row 클릭 시 호출될 함수
    const handlePjtClick = (pjt) => {
        setSelectedPjts(pjt);
    };

    // 선택 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        setFormData({});
        handleOk(selectedPjts);
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
            <input 
                name="projectCode"
                className={pjtModalStyles.search_code} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
          </div>
          <div className={pjtModalStyles.search_item}>
            <div className={pjtModalStyles.search_title}>프로젝트명</div>
            <div className={pjtModalStyles.search_container}>
                <input 
                name="projectName"
                className={pjtModalStyles.search_name} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                />
              <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
            </div>
          </div>
        </div>
  
        <div className={pjtModalStyles.result_container}>
            <Table data={project} variant='checkbox' onRowClick={handlePjtClick} />
        </div>
  
        <button className={pjtModalStyles.select_button} onClick={handleSelect}>등록</button>
      </Modal>
    )
}

export function PdAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [formData, setFormData] = useState({});
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

            setFormData(filteredResponse);
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
        setFormData({});
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
        else {
            yearError.textContent = `empty`; // 오류 메시지 설정
            yearError.classList.add(rmStyles.empty_message);
        }

        if (!month) {
            monthField.classList.add(rmStyles.error); // 오류 클래스 추가
            monthError.textContent = `'월' is required`; // 오류 메시지 설정
            document.getElementById('month-star').textContent = '*'; // 빨간색 별표 추가
            hasError = true;
        }
        else {
            monthError.textContent = `empty`; // 오류 메시지 설정
            monthError.classList.add(rmStyles.empty_message);
        }

        if (!salesAmt) {
            salesAmtField.classList.add(rmStyles.error); // 오류 클래스 추가
            salesAmtError.textContent = `'매출액' is required`; // 오류 메시지 설정
            document.getElementById('salesAmt-star').textContent = '*'; // 빨간색 별표 추가
            hasError = true;
        }
        else {
            salesAmtField.textContent = `empty`; // 오류 메시지 설정
            salesAmtField.classList.add(rmStyles.empty_message);
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

            <div className={rmStyles.container}>
                <div className={rmStyles.read_only}>
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
                </div>
                <div className={rmStyles.search_container}>
                    <div className={rmStyles.search_item}>
                        <div className={rmStyles.search_title}>
                            년<span id="year-star" className={rmStyles.error_star}></span>
                        </div>
                        <input 
                            id="year"
                            className={rmStyles.search} 
                        />
                        <div id="year-error" className={rmStyles.error_message}>&nbsp;</div>
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
                        <div id="month-error" className={rmStyles.error_message}>&nbsp;</div>
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
                        <div id="salesAmt-error" className={rmStyles.error_message}>&nbsp;</div>
                    </div>
                </div>
            </div>
            
            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            height: "2.5rem", // 전체 높이 조정
            padding: 0,
            "& .MuiOutlinedInput-input": {
              height: "1.5rem",
              padding: "0.5rem",
              boxSizing: "border-box",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            transform: "translate(14px, 10px) scale(1)", // label 위치 조정
            "&.MuiInputLabel-shrink": {
              transform: "translate(14px, -6px) scale(0.75)", // 축소된 상태에서의 위치 조정
            },
          },
        },
      },
    },
  });

export function FlAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [eqLibName, setEqLibName] = useState('');
    const [selectedEqDvs, setSelectedEqDvs] = useState('');
    const [selectedEqType, setSelectedEqType] = useState('');
    const [selectedEqSpecUnit, setSelectedEqSpecUnit] = useState('');

    // 옵션을 가져오는 함수
    const getOptions = (fieldName) => {
        const field = rowData.find(field => field.name === fieldName);
        return field ? field.options : [];
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        const formData = {
            eqLibName,
            eqDvs: selectedEqDvs,
            eqType: selectedEqType,
            eqSpecUnit: selectedEqSpecUnit
        };

        handleOk(formData);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            style={{ width: '25rem', maxWidth: '25rem', important: true }}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>설비LIB 등록</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비라이브러리명</div>
                    <ThemeProvider theme={theme}>
                        <TextField
                            id='eqLibName'
                            variant='outlined'
                            borderRadius='4px'
                            fullWidth
                            value={eqLibName}
                            onChange={(e) => setEqLibName(e.target.value)}
                            sx={{
                                width: '22rem',
                                "& .MuiOutlinedInput-root": {
                                    height: "2rem !important", // 강제로 높이 조정
                                },
                                "& .MuiOutlinedInput-input": {
                                    height: '1.5rem !important', // 강제로 높이 조정
                                    padding: '0.5rem !important', // 강제로 패딩 조정
                                    boxSizing: 'border-box',
                                },
                            }}
                        />
                    </ThemeProvider>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비구분</div>
                    <Select
                        id="eqDvs"
                        value={selectedEqDvs}
                        onChange={(value) => setSelectedEqDvs(value)}
                    >
                        {getOptions('equipDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비유형</div>
                    <Select
                        id="eqType"
                        value={selectedEqType}
                        onChange={(value) => setSelectedEqType(value)}
                    >
                        {getOptions('equipType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비사양단위</div>
                    <Select
                        id="eqSpecUnit"
                        value={selectedEqSpecUnit}
                        onChange={(value) => setSelectedEqSpecUnit(value)}
                    >
                        {getOptions('equipSpecUnit').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function FlEditModal({ isModalOpen, handleOk, handleCancel, rowData, dropDown }) {
    const [eqLibName, setEqLibName] = useState('');
    const [selectedEqDvs, setSelectedEqDvs] = useState('');
    const [selectedEqType, setSelectedEqType] = useState('');
    const [selectedEqSpecUnit, setSelectedEqSpecUnit] = useState('');

    // 옵션을 가져오는 함수
    const getOptions = (fieldName) => {
        const field = dropDown.find(field => field.name === fieldName);
        return field ? field.options : [];
    };

    // 모달이 열릴 때 rowData로부터 폼 필드 값을 설정
    useEffect(() => {
        if (isModalOpen && rowData) {
            const equipDvsOption = getOptions('equipDvs').find(option => option.label === rowData.설비구분);
            const equipTypeOption = getOptions('equipType').find(option => option.label === rowData.설비유형);
            const equipSpecUnitOption = getOptions('equipSpecUnit').find(option => option.label === rowData.설비사양단위);

        setEqLibName(rowData.설비라이브러리명 || '');
        setSelectedEqDvs(equipDvsOption ? equipDvsOption.value : '');
        setSelectedEqType(equipTypeOption ? equipTypeOption.value : '');
        setSelectedEqSpecUnit(equipSpecUnitOption ? equipSpecUnitOption.value : '');
        }
    }, [rowData, isModalOpen]);

    const handleSelect = () => {
        const formData = {
            eqLibName,
            eqDvs: selectedEqDvs,
            eqType: selectedEqType,
            eqSpecUnit: selectedEqSpecUnit
        };

        handleOk(formData);
    };

    return (
        <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            style={{ width: '25rem', maxWidth: '25rem', important: true }}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>설비LIB 수정</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비라이브러리명</div>
                    <TextField
                        id='eqLibName'
                        variant='outlined'
                        size='small'
                        fullWidth
                        value={eqLibName}
                        onChange={(e) => setEqLibName(e.target.value)}
                        sx={{width: '22rem'}}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비구분</div>
                    <Select
                        value={selectedEqDvs}
                        onChange={(value) => setSelectedEqDvs(value)}
                    >
                        {getOptions('equipDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비유형</div>
                    <Select
                        value={selectedEqType}
                        onChange={(value) => setSelectedEqType(value)}
                    >
                        {getOptions('equipType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비사양단위</div>
                    <Select
                        value={selectedEqSpecUnit}
                        onChange={(value) => setSelectedEqSpecUnit(value)}
                    >
                        {getOptions('equipSpecUnit').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
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
    const [codeGrpNo, setCodeGrpNo] = useState('');
    const [codeGrpName, setCodeGrpName] = useState('');
    const [codeGrpNameEn, setCodeGrpNameEn] = useState('');
    const [note, setNote] = useState('');

    const handleSelect = async() => {
        const formData = {
            codeGrpNo,
            codeGrpName,
            codeGrpNameEn,
            note,
        };
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/sys/codegroup', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    <TextField id='codeGrpNo' value={codeGrpNo} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <TextField id='codeGrpName' value={codeGrpName} onChange={(e) => setCodeGrpName(e.target.value)} label="코드 그룹 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeGrpNameEn' value={codeGrpNameEn} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <TextField id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} />
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function CmEditModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    // 예외처리
    if (!rowData){
        return <></>;
    }
    const [codeGrpNo, setCodeGrpNo] = useState(rowData.codeGrpNo);
    const [codeGrpName, setCodeGrpName] = useState(rowData.codeGrpName);
    const [codeGrpNameEn, setCodeGrpNameEn] = useState(rowData.codeGrpNameEn);
    const [note, setNote] = useState(rowData.note);
    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = async() => {
        const formData = {
            id: rowData.id,
            codeGrpNo,
            codeGrpName,
            codeGrpNameEn,
            note,
        };
        console.log("formData",formData);
        try {
            const {data} = await axiosInstance.patch('/sys/codegroup', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹 수정</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    <TextField id='codeGrpNo' value={codeGrpNo} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <TextField id='codeGrpName' value={codeGrpName} onChange={(e) => setCodeGrpName(e.target.value)} label="코드 그룹 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <TextField id='codeGrpNameEn' value={codeGrpNameEn} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <TextField id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} />
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>수정</button>
        </Modal>
    )
}

export function DeleteModal({ isModalOpen, handleOk, handleCancel, rowData, url }) {
    console.log("왜널?",rowData);
    const handleDelete = async () => {
        try {
            // 서버에 DELETE 요청을 보냅니다.
            console.log("셀릭",rowData);
            console.log(url);
            await axiosInstance.delete(`${url}?id=${rowData.id}`);
            handleOk(rowData); // 삭제 성공 시 상위 컴포넌트에 알림
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

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
            <button className={modalStyles.cancel_button} style={{width:"45%"}} onClick={handleCancel}>취소</button>
            <button className={modalStyles.select_button} style={{width:"45%"}} onClick={handleDelete}>확인</button>
            </div>
        </Modal>
    )
}

export function CmListAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [code, setCode] = useState('');
    const [codeName, setCodeName] = useState('');
    const [attr1, setAttr1] = useState('');
    const [attr2, setAttr2] = useState('');
    const [note, setNote] = useState('');
    const handleSelect = async() => {
        const formData = {
            codeGrpNo: rowData.codeGrpNo,
            codeGrpName: rowData.codeGrpName,
            code,
            codeName,
            attr1,
            attr2,
            note,
        };
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/sys/code', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={480}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "2rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    <TextField id='codeGrpNo' value={rowData.codeGrpNo} disabled label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 이름"}</div>
                    <TextField id='codeName' value={rowData.codeGrpName} disabled label="코드 그룹 이름" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드"}</div>
                    <TextField id='code' value={code} onChange={(e) => setCode(e.target.value)} label="코드" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    <TextField id='codeName' value={codeName} onChange={(e) => setCodeName(e.target.value)} label="코드 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성1"}</div>
                    <TextField id='attr1' value={attr1} onChange={(e) => setAttr1(e.target.value)} label="속성1" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성2"}</div>
                    <TextField id='attr2' value={attr2} onChange={(e) => setAttr2(e.target.value)} label="속성2" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <TextField id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} />
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function CmListEditModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    if (!rowData){
        return <></>;
    }

    const [code, setCode] = useState(rowData.code);
    const [codeName, setCodeName] = useState(rowData.codeName);
    const [attr1, setAttr1] = useState(rowData.attr1);
    const [attr2, setAttr2] = useState(rowData.attr2);
    const [note, setNote] = useState(rowData.note);
    const handleSelect = async() => {
        const formData = {
            id: rowData.id,
            codeGrpNo: rowData.codeGrpNo,
            codeGrpName: rowData.codeGrpName,
            code,
            codeName,
            attr1,
            attr2,
            note,
        };
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.patch('/sys/code', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
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
                        {"코드 그룹 ID"}
                    </div>
                    <TextField id='codeGrpNo' value={rowData.codeGrpNo} disabled label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 이름"}</div>
                    <TextField id='codeName' value={rowData.codeGrpName} disabled label="코드 그룹 이름" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드"}</div>
                    <TextField id='code' value={code} onChange={(e) => setCode(e.target.value)} label="코드" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    <TextField id='codeName' value={codeName} onChange={(e) => setCodeName(e.target.value)} label="코드 명" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성1"}</div>
                    <TextField id='attr1' value={attr1} onChange={(e) => setAttr1(e.target.value)} label="속성1" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성2"}</div>
                    <TextField id='attr2' value={attr2} onChange={(e) => setAttr2(e.target.value)} label="속성2" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <TextField id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} />
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleSelect}>수정</button>
        </Modal>
    )
}

export function FmAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [showResults, setShowResults] = useState(false);    // 목록을 표시할지 여부
    const [selectedSulbi, setSelectedSulbi] = useState([]);     // 선택된 Id list
    const [sulbiLib, setSulbiLib] = useState([]);
    const [equipName, setEquipName] = useState([]);
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
    const handleSearch = (e) => {
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
    const handleSelect = async () => {
        const formData = {
            pjtId: rowData[0].id,
            equipLibId: value1[0].id, // selectedSulbi[0] <- 여러개일땐 
            equipName,
        };

        try {
            // POST 요청으로 서버에 데이터 전송
            console.log(formData);
            const {data} = await axiosInstance.post('/equip', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            console.log(data);
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };


    const defaultProps = {
        options: sulbiLib,
        getOptionLabel: (option) => option.equipLibName
    };

    const flatProps = {
        options: sulbiLib.map((option) => option.label),
    };

    const [value1, setValue] = useState([]);
    console.log(value1);
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
                {showResults && 
                <>
                    <Table data={value1} onRowClick={handleSulbiClick} />
                    <div className={sysStyles.text_field}>
                        <div className={sysStyles.text} style={{marginTop:"3rem", marginLeft:"5rem", fontWeight:"bold"}}>{"설비 명"}</div>
                        <TextField id='equipName' label="설비 명" value={equipName} onChange={(e) => setEquipName(e.target.value)} variant='outlined' sx={{ width: "30rem", margin:"0 auto", display:"flex", justifyContent:"center", alignContent:"center" }} />
                    </div>
                </>
                }
            </div>


            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function UmAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [dept, setDept] = useState([]);
    const [userName, setUserName] = useState('');      // 사용자명 상태
    const [loginId, setLoginId] = useState('');        // 로그인 ID 상태
    const [password, setPassword] = useState('');      // 비밀번호 상태
    const [selectedDept, setSelectedDept] = useState(''); // 부서 선택 상태
    const [selectedRole, setSelectedRole] = useState(''); // 권한 선택 상태
    const access = [
        {
            value: 'FP',
            label: '현장 담당자'
        },
        {
            value: 'HP',
            label: '본사 담당자'
        },
        {
            value: 'ADMIN',
            label: '시스템 관리자'
        },
    ]
    useEffect(() => {
        const fetchDeptCode = async () => {
            try {
                const res = await axiosInstance.get("/sys/unit?unitType=부서코드");
                const options = res.data.map(dept => ({
                    value: dept.code,
                    label: dept.name,
                }));
                setDept(options);

            } catch (error) {
                console.error(error);
            }
        };

        fetchDeptCode();


    },[])



    // 등록 버튼 클릭 시 호출될 함수
    const handleInsert = async () => {
        const formData = {
            userName,
            loginId,
            password,
            deptCode: selectedDept,
            role: selectedRole,
        };

        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/sys/user', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
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
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text} style={{marginTop:"2rem"}}>{"이름"}</div>
                    <TextField id='userName' label="이름" value={userName} onChange={(e) => setUserName(e.target.value)} variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field} style={{ width:"20rem" }}>
                    <div className={sysStyles.text}>
                        {"로그인 ID"}
                    </div>
                    <TextField id='loginId' label="로그인 ID" value={loginId} onChange={(e) => setLoginId(e.target.value)} variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"비밀번호"}</div>
                    <TextField id='userName' label="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"부서 명"}</div>
                    <Select value={selectedDept} onChange={(value) => setSelectedDept(value)} style={{width:"20rem", height:"3.5rem", fontSize:"4rem"}}>
                    {dept.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"권한"}</div>
                    <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} style={{width:"20rem", height:"3.5rem", fontSize:"4rem"}}>
                    {access.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
            </div>
            <button className={modalStyles.select_button} onClick={handleInsert}>등록</button>
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
