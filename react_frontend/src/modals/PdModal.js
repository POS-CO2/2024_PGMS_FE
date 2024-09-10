import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Upload, Select, Input } from 'antd';
import { PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import * as modalStyles from "../assets/css/pdModal.css";
import * as rmStyles from "../assets/css/rmModal.css";
import * as delStyle from "../assets/css/delModal.css";
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import * as sysStyles from "../assets/css/sysmng.css"
import * as sdStyles from "../assets/css/sdModal.css";
import * as ps12Styles from "../assets/css/ps12UploadExcelModal.css";
import * as formStyles from "../assets/css/formItem.css"
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
import Swal from 'sweetalert2';
import { pjtColumns, userColumns, equipColumns, equipActvColumns, equipLibColumns, equipEmissionColumns } from '../assets/json/tableColumn.js';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  background: #ECF1F4 !important;
  border: none !important;
  padding: 5px !important;
  height: 32px !important;
  border-radius: 5px !important;

  &:focus {
    background: #ECF1F4 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
`;

export function PgAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [selectedPjts, setSelectedPjts] = useState([]);     // 선택된 프로젝트
    const [allProjects, setAllProjects] = useState([]);       // 전체 프로젝트
    const [project, setProject] = useState([]);

    const [pjtCode, setPjtCode] = useState('');
    const [pjtName, setPjtName] = useState('');

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
    }, [isModalOpen])

    //찾기 버튼 클릭시 호출될 함수
    const handleFormSubmit = () => {
        const filteredProjects = allProjects.filter(pjt => {
        const matchesCode = pjtCode ? pjt.projectCode?.includes(pjtCode) : true;
        const matchesName = pjtName ? pjt.projectName?.includes(pjtName) : true;
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
        setPjtCode('');
        setPjtName('');
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
            <StyledInput
              value={pjtCode}
              allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
              onChange={(e) => setPjtCode(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '12rem' }}
            />
          </div>
          <div className={pjtModalStyles.search_item}>
            <div className={pjtModalStyles.search_title}>프로젝트명</div>
            <div className={pjtModalStyles.search_container}>
                <StyledInput
                value={pjtName}
                allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                onChange={(e) => setPjtName(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '12rem' }}
                />
                <button className={pjtModalStyles.search_button} onClick={handleFormSubmit}>찾기</button>
            </div>
          </div>
        </div>
  
        <div className={pjtModalStyles.result_container}>
            <Table data={project} columns={pjtColumns} variant='checkbox' onRowClick={handlePjtClick} />
        </div>
  
        <div className={pjtModalStyles.button_container}>
            {(!selectedPjts || selectedPjts.length === 0) ?
            <></> : ( <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button> )}
            <button className={pjtModalStyles.select_button} onClick={handleCancel}>취소</button>
        </div>
      </Modal>
    )
}

export function PdAddModal({ isModalOpen, handleOk, handleCancel }) {
    const [formData, setFormData] = useState([]);
    const [selectedEmps, setSelectedEmps] = useState([]);     // 선택된 사원의 loginId list
    const [inputEmpId, setInputEmpId] = useState('');         // 입력한 사번
    const [inputEmpName, setInputEmpName] = useState('');     // 입력한 사원명

    // 엔터 키 입력 시 handleSearch 호출
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();  // 폼의 기본 제출 동작 방지
        handleSearch();
        }
    };
    
    // 찾기 버튼 클릭 시 호출될 함수
    const handleSearch = async() => {
        try {
            const response = await axiosInstance.get(`/pjt/not-manager?loginId=${inputEmpId}&userName=${inputEmpName}`);
            setFormData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // 사원 row 클릭 시 호출될 함수
    const handleEmpClick = (emp) => {
        setSelectedEmps(emp);
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        setFormData([]);
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
                    <Input
                        value={inputEmpId}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setInputEmpId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ width: '12rem' }}
                    />
                </div>
                <div className={modalStyles.search_item}>
                    <div className={modalStyles.search_title}>이름</div>
                    <div className={modalStyles.input_with_btn}>
                        <Input
                            value={inputEmpName}
                            allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                            onChange={(e) => setInputEmpName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ width: '12rem' }}
                        />
                        <button className={modalStyles.search_button} onClick={handleSearch}>조회</button>
                    </div>
                </div>
            </div>

            <div className={modalStyles.result_container}>
                {(!formData || Object.keys(formData).length === 0) ? 
                <></> : <Table data={formData} columns={userColumns} variant='checkbox' onRowClick={handleEmpClick} modalPagination={true} />
                }
            </div>

            {(!selectedEmps || selectedEmps.length === 0) ?
            <></> : ( <button className={modalStyles.select_button} onClick={handleSelect}>등록</button> )}
        </Modal>
    )
}

export function FlAddModal({ isModalOpen, handleOk, handleCancel, dropDown }) {
    const [eqLibName, setEqLibName] = useState('');
    const [selectedEqDvs, setSelectedEqDvs] = useState('');
    const [selectedEqType, setSelectedEqType] = useState('');
    const [selectedEqSpecUnit, setSelectedEqSpecUnit] = useState('');

    // 옵션을 가져오는 함수
    const getOptions = (fieldName) => {
        const field = dropDown.find(field => field.name === fieldName);
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
                    <Input
                        value={eqLibName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '21rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비구분</div>
                    <Select
                        value={selectedEqDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqDvs(value)}
                        style={{ width: '21rem' }}
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
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqType(value)}
                        style={{ width: '21rem' }}
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
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqSpecUnit(value)}
                        style={{ width: '21rem' }}
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
            const equipDvsOption = getOptions('equipDvs').find(option => option.label === rowData.equipDvs);
            const equipTypeOption = getOptions('equipType').find(option => option.label === rowData.equipType);
            const equipSpecUnitOption = getOptions('equipSpecUnit').find(option => option.label === rowData.equipSpecUnit);

            setEqLibName(rowData.equipLibName || '');
            setSelectedEqDvs(equipDvsOption ? equipDvsOption.value : '');
            setSelectedEqType(equipTypeOption ? equipTypeOption.value : '');
            setSelectedEqSpecUnit(equipSpecUnitOption ? equipSpecUnitOption.value : '');
        }
    }, [rowData, isModalOpen]);

    // 수정 버튼 클릭 시 호출될 함수
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
                    <Input
                        value={eqLibName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '21rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>설비구분</div>
                    <Select
                        value={selectedEqDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqDvs(value)}
                        style={{ width: '21rem' }}
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
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqType(value)}
                        style={{ width: '21rem' }}
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
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqSpecUnit(value)}
                        style={{ width: '21rem' }}
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

export function FamAddModal({ isModalOpen, handleOk, handleCancel, dropDown }) {
    const [actvName, setActvName] = useState('');
    const [selectedActvDvs, setSelectedActvDvs] = useState('');
    const [selectedEmtnActv, setSelectedEmtnActv] = useState('');
    const [selectedInputUnit, setSelectedInputUnit] = useState('');
    const [calUnit, setCalUnit] = useState('');
    const [unitConvCoef, setUnitConvCoef] = useState('');
    const [actvUnits, setActvUnits] = useState([]);

    useEffect(() => {
        const fetchActvUnit = async () => {
            try {
                const response = await axiosInstance.get(`/sys/actv-unit`);
                setActvUnits(response.data);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchActvUnit();
    }, []);

    //// 모달이 열릴 때 폼 필드 초기화
    useEffect(() => {
        if (isModalOpen) {
            setActvName('');
            setSelectedActvDvs('');
            setSelectedEmtnActv('');
            setSelectedInputUnit('');
            setCalUnit('');
            setUnitConvCoef('');
        }
    }, [isModalOpen]);

    // 옵션을 가져오는 함수
    const getOptions = (fieldName) => {
        const field = dropDown.find(field => field.name === fieldName);
        return field ? field.options : [];
    };

    // 입력단위 선택 시 대응하는 산정단위와 단위환산계수 업데이트
    const handleInputUnitChange = (value) => {
        setSelectedInputUnit(value);

        const matchedUnit = actvUnits.find(unit => unit.inputUnitCode === value);
        if (matchedUnit) {
            setCalUnit(matchedUnit.calUnitCode);
            setUnitConvCoef(matchedUnit.unitConvCoef);
        } else {
            setCalUnit('');
            setUnitConvCoef('');
        }
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        const formData = {
            actvDataName: actvName,
            actvDataDvs: selectedActvDvs,
            emtnActvType: selectedEmtnActv,
            inputUnit: selectedInputUnit,
            calUnit: calUnit,
            unitConvCoef: unitConvCoef
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
            <div className={rmStyles.title}>활동자료 등록</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료명</div>
                    <Input
                        value={actvName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setActvName(e.target.value)}
                        style={{ width: '21rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료구분</div>
                    <Select
                        value={selectedActvDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedActvDvs(value)}
                        style={{ width: '21rem' }}
                    >
                        {getOptions('actvDataDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>배출활동유형</div>
                    <Select
                        value={selectedEmtnActv}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEmtnActv(value)}
                        style={{ width: '21rem' }}
                    >
                        {getOptions('emtnActvType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>입력단위</div>
                    <Select
                        value={selectedInputUnit}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => handleInputUnitChange(value)}
                        style={{ width: '21rem' }}
                    >
                        {actvUnits.map(unit => (
                            <Select.Option key={unit.inputUnitCode} value={unit.inputUnitCode}>
                                {unit.inputUnitCode}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>산정단위</div>
                    <input 
                        className={rmStyles.search} 
                        id="calUnit" 
                        value={calUnit} 
                        readOnly 
                        style={{ width: '21rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>단위환산계수</div>
                    <input 
                        className={rmStyles.search} 
                        id="unitConvCoef" 
                        value={unitConvCoef} 
                        readOnly 
                        style={{ width: '21rem' }}
                    />
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function FamEditModal({ isModalOpen, handleOk, handleCancel, rowData, dropDown }) {
    const [actvName, setActvName] = useState('');
    const [selectedActvDvs, setSelectedActvDvs] = useState('');
    const [selectedEmtnActv, setSelectedEmtnActv] = useState('');
    const [selectedInputUnit, setSelectedInputUnit] = useState('');
    const [calUnit, setCalUnit] = useState('');
    const [unitConvCoef, setUnitConvCoef] = useState('');
    const [actvUnits, setActvUnits] = useState([]);

    useEffect(() => {
        const fetchActvUnit = async () => {
            try {
                const response = await axiosInstance.get(`/sys/actv-unit`);
                setActvUnits(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchActvUnit();
    }, []);

    // 모달이 열릴 때 rowData로부터 폼 필드 값을 설정
    useEffect(() => {
        if (isModalOpen && rowData) {
            const actvDvsOption = getOptions('actvDataDvs').find(option => option.label === rowData.actvDataDvs);
            const actvTypeOption = getOptions('emtnActvType').find(option => option.label === rowData.emtnActvType);
            const inputUnitOption = getOptions('inputUnit').find(option => option.label === rowData.inputUnitCode);

            setActvName(rowData.actvDataName || '');
            setSelectedActvDvs(actvDvsOption ? actvDvsOption.value : '');
            setSelectedEmtnActv(actvTypeOption ? actvTypeOption.value : '');
            handleInputUnitChange(inputUnitOption.value);
        }
    }, [rowData, isModalOpen]);

    // 옵션을 가져오는 함수
    const getOptions = (fieldName) => {
        const field = dropDown.find(field => field.name === fieldName);
        return field ? field.options : [];
    };

    // 입력단위 선택 시 대응하는 산정단위와 단위환산계수 업데이트
    const handleInputUnitChange = (value) => {
        setSelectedInputUnit(value);

        const matchedUnit = actvUnits.find(unit => unit.inputUnitCode === value);
        
        if (matchedUnit) {
            setCalUnit(matchedUnit.calUnitCode);
            setUnitConvCoef(matchedUnit.unitConvCoef);
        } else {
            setCalUnit('');
            setUnitConvCoef('');
        }
    };

    // 수정 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        const formData = {
            actvDataName: actvName,
            actvDataDvs: selectedActvDvs,
            emtnActvType: selectedEmtnActv,
            inputUnitCode: selectedInputUnit,
            calUnitCode: calUnit,
            unitConvCoef: unitConvCoef
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
            <div className={rmStyles.title}>활동자료 수정</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료명</div>
                    <Input
                        value={actvName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setActvName(e.target.value)}
                        style={{ width: '21rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>활동자료구분</div>
                    <Select
                        value={selectedActvDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedActvDvs(value)}
                        style={{ width: '21rem' }}
                    >
                        {getOptions('actvDataDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>배출활동유형</div>
                    <Select
                        value={selectedEmtnActv}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEmtnActv(value)}
                        style={{ width: '21rem' }}
                    >
                        {getOptions('emtnActvType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>입력단위</div>
                    <Select
                        value={selectedInputUnit}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => handleInputUnitChange(value)}
                        style={{ width: '21rem' }}
                    >
                        {actvUnits.map(unit => (
                            <Select.Option key={unit.inputUnitCode} value={unit.inputUnitCode}>
                                {unit.inputUnitCode}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>산정단위</div>
                    <Input
                        value={calUnit}
                        disabled={true}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '21rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>단위환산계수</div>
                    <Input
                        value={unitConvCoef}
                        disabled={true}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '21rem' }}
                    />
                </div>
            </div>

            <button className={rmStyles.select_button} onClick={handleSelect}>수정</button>
        </Modal>
    )
}

export function FadAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [actvDvsList, setActvDvsList] = useState([]);
    const [allActv, setAllActv] = useState([]);
    const [actves, setActves] = useState([]);                     // 검색 데이터
    const [selectedActves, setselectedActves] = useState([]);     // 선택된 프로젝트
    const [inputActvName, setInputActvName] = useState('');       // 입력한 활동자료명
    const [inputActvDvs, setInputActvDvs] = useState('');         // 입력한 활동자료구분

    // 컴포넌트 생성시 활동자료 목록, 활동자료구분 리스트 불러오기
    useEffect(() => {
        const fetchActvDvs = async () => {
            try {
                // 선택한 lib에 이미 등록된 활동자료를 걸러서 조회
                const response = await axiosInstance.get(`/equip/actv/lib?equipLibId=${rowData.id}`);

                setAllActv(response.data);
                setActves(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDropDown = async () => {
            try {
                const response = await axiosInstance.get("/sys/unit?unitType=활동자료구분");

                const optionsActvDvs = response.data.map(item => ({
                    value: item.code,
                    label: item.name,
                }));

                setActvDvsList(optionsActvDvs);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDropDown();
        fetchActvDvs();
    }, []);

    // 엔터 키 입력 시 handleSearch 호출
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();  // 폼의 기본 제출 동작 방지
        handleSearch();
        }
    };

    // 찾기 버튼 클릭시 호출될 함수
    const handleSearch = async() => {
        const filteredActves = allActv.filter(actv => {
            const opt = actvDvsList.find(option => option.value === inputActvDvs);

            const matchesName = inputActvName ? actv.활동자료명?.includes(inputActvName) : true;
            const matchesActvDvs = inputActvDvs ? actv.활동자료구분?.includes(opt.label) : true;
            return matchesName && matchesActvDvs;
          });
          
          setActves(filteredActves);
    };
  
    // 활동자료 row 클릭 시 호출될 함수
    const handleActvClick = (actv) => {
        setselectedActves(actv);
    };
  
    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = () => {
        setActves([]);
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
                <Input
                    value={inputActvName}
                    allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                    onChange={(e) => setInputActvName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ width: '12rem' }}
                />
            </div>
            <div className={pjtModalStyles.search_item}>
                <div className={pjtModalStyles.search_title}>활동자료구분</div>
                <div className={modalStyles.input_with_btn}>
                    <Select
                        value={inputActvDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setInputActvDvs(value)}
                        style={{ width: '15rem' }}
                    >
                        {actvDvsList.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    <button className={pjtModalStyles.search_button} onClick={handleSearch}>찾기</button>
                </div>
            </div>
        </div>
  
        <div className={pjtModalStyles.result_container}>
            {(!actves || Object.keys(actves).length === 0) ?
                <></> : ( <Table data={actves} columns={equipActvColumns} variant='checkbox' onRowClick={handleActvClick} modalPagination={true} /> )}
        </div>
  
        {(!selectedActves || selectedActves.length === 0) ?
            <></> : ( <button className={pjtModalStyles.select_button} onClick={handleSelect}>등록</button> )}
      </Modal>
    )
}

export function Ps12UploadExcelModal({ isModalOpen, handleOk, handleCancel }) { // '엑셀 업로드' 모달
    const fileInputRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [errors, setErrors] = useState({});

    // 모달 열 때마다 clear
    useEffect(() => {
        if (isModalOpen) {
            setFileList([]);
            setErrors({});
        }
    }, [isModalOpen]);

    const onUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const newFile = event.target.files[0];
        setFileList([newFile]);
    };

    const handleFileRemove = () => {
        setFileList([]);
    };

    const onSaveClick = async () => {
        // 입력 값 검증
        let newErrors = {};
        if (fileList.length === 0) newErrors.file = '필수 항목입니다.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        let swalOptions = {
            confirmButtonText: '확인'
        };
        
        try {
            const formData = new FormData();
            formData.append('file', fileList[0]);

            // 데이터 전송
            const response = await axiosInstance.post('/perf/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            handleOk(response.data, true); // 새로 입력된 데이터를 handleOk 함수로 전달, 두번째 인자-closeModal=true
            swalOptions.title = '성공!',
            swalOptions.text = `성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Error saving document:', error);
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
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
                        id="fileList"
                        name="fileList"
                        accept=".xlsx"
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
                {fileList.length !== 0 ? (
                    <div className={ps12Styles.file_item}>
                        {fileList[0].name}
                        <button
                            type="button"
                            className={ps12Styles.remove_button}
                            onClick={handleFileRemove}
                        >
                            <CloseOutlined />
                        </button>
                    </div>
                ) : (
                    <></>
                )}
                </div>
            </div>
            {errors.file && <div className={modalStyles.error_message}>{errors.file}</div>}

            <button className={ps12Styles.select_button} onClick={onSaveClick}>등록</button>
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
        let swalOptions = {
            confirmButtonText: '확인'
        };

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
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.codeGrpName}가 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
            handleOk(data);
        } catch (error) {
            console.error('Failed to add user:', error);

            swalOptions.title = '실패!',
            swalOptions.text = `${formData.codeGrpName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    {/* <TextField size="small" id='codeGrpNo' value={codeGrpNo} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeGrpNo' value={codeGrpNo} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드 그룹 번호" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    {/* <TextField size="small" id='codeGrpName' value={codeGrpName} onChange={(e) => setCodeGrpName(e.target.value)} label="코드 그룹 명" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeGrpNo' value={codeGrpName} onChange={(e) => setCodeGrpName(e.target.value)} label="코드 그룹 명" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    {/* <TextField size="small" id='codeGrpNameEn' value={codeGrpNameEn} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문 명" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeGrpNoEn' value={codeGrpNameEn} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문 명" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    {/* <TextField size="small" id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
                <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
            
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

        let swalOptions = {
            confirmButtonText: '확인'
        };
        const formData = {
            id: rowData.id,
            codeGrpNo,
            codeGrpName,
            codeGrpNameEn,
            note,
        };
        try {
            const {data} = await axiosInstance.patch('/sys/codegroup', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.codeGrpName}이 성공적으로 수정되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.codeGrpName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹 수정</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    <Input id='codeGrpNo' value={codeGrpNo} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드 그룹 번호" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 명"}</div>
                    <Input id='codeGrpNo' value={codeGrpName} onChange={(e) => setCodeGrpName(e.target.value)} label="코드 그룹 명" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"영문 명"}</div>
                    <Input id='codeGrpNoEn' value={codeGrpNameEn} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문 명" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <Input id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"20rem"}} className={modalStyles.select_button} onClick={handleSelect}>수정</button>
            </div>
        </Modal>
    )
}

export function DeleteModal({ isModalOpen, handleOk, handleCancel, rowData, rowDataName, url }) {
    if (!rowData) {
        return null;
    }
    
    const [rowName, setRowName] = useState(rowData[rowDataName ?? ""]);
    useEffect(() => {
        // rowData가 존재할 때만 rowName을 설정
        if (rowData) {
            setRowName(rowData[rowDataName] || '');
        }
    }, [rowData, rowDataName]);
    const handleDelete = async () => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        try {
            // 서버에 DELETE 요청을 보냅니다.
            if (url === "/sys/menu"){
                await axiosInstance.delete(`${url}?id=${rowData.originId}`);
            }
            else if (url === "/equip/libmap") {
                await axiosInstance.delete(`/equip/libmap?equipLibId=${rowData.equipLibId}&actvDataId=${rowData.id}`);
            }
            else if (url === "/pjt") {
                await axiosInstance.patch(`/pjt?id=${rowData.id}`);
            }
            else {
                await axiosInstance.delete(`${url}?id=${rowData.id}`);
            }
            
            swalOptions.title = '성공!',
            swalOptions.text = `${rowName}(이)가 성공적으로 삭제되었습니다.`;
            swalOptions.icon = 'success';
            handleOk(rowData);
        } catch (error) {
            console.error('Failed to delete user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };
    

    return (
        <Modal
            style={{
                top: "35%"
            }}
            open={isModalOpen}
            onCancel={handleCancel}
            width={380}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div style={{display:"flex", marginTop:"10%", marginLeft:"5%", gap:"1rem", fontSize:"1.3rem", fontWeight:"bold"}}>
                <WarningAmberIcon fontSize="large" sx={{color:"red"}}/>
                정말 삭제하시겠습니까?
            </div>
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
    const [attri1, setAttri1] = useState('');
    const [attri2, setAttri2] = useState('');
    const [note, setNote] = useState('');
    const handleSelect = async() => {
        let swalOptions = {
            confirmButtonText: '확인'
        };

        const formData = {
            codeGrpNo: rowData.codeGrpNo,
            codeGrpName: rowData.codeGrpName,
            code,
            codeName,
            attri1,
            attri2,
            note,
        };
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/sys/code', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.codeName}가 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.codeName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    {/* <TextField size='small' id='codeGrpNo' value={rowData.codeGrpNo} disabled label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeGrpNo' disabled value={rowData.codeGrpNo} label="코드 그룹 번호" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 이름"}</div>
                    {/* <TextField size='small' id='codeName' value={rowData.codeGrpName} disabled label="코드 그룹 이름" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeName' disabled value={rowData.codeGrpName} label="코드 그룹 이름" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드"}</div>
                    {/* <TextField size='small' id='code' value={code} onChange={(e) => setCode(e.target.value)} label="코드" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='code' value={code} onChange={(e) => setCode(e.target.value)} label="코드" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    {/* <TextField size='small' id='codeName' value={codeName} onChange={(e) => setCodeName(e.target.value)} label="코드 명" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeName' value={codeName} onChange={(e) => setCodeName(e.target.value)} label="코드 명" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성1"}</div>
                    {/* <TextField size='small' id='attri1' value={attri1} onChange={(e) => setAttri1(e.target.value)} label="속성1" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='attri1' value={attri1} onChange={(e) => setAttri1(e.target.value)} label="속성1" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성2"}</div>
                    {/* <TextField size='small' id='attri2' value={attri2} onChange={(e) => setAttri2(e.target.value)} label="속성2" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='attri2' value={attri2} onChange={(e) => setAttri2(e.target.value)} label="속성2" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    {/* <TextField size='small' id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
        </Modal>
    )
}

export function CmListEditModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    if (!rowData){
        return <></>;
    }

    const [code, setCode] = useState(rowData.code);
    const [codeName, setCodeName] = useState(rowData.codeName);
    const [attri1, setAttri1] = useState(rowData.attri1);
    const [attri2, setAttri2] = useState(rowData.attri2);
    const [note, setNote] = useState(rowData.note);
    console.log(rowData);
    const handleSelect = async() => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        const formData = {
            id: rowData.id,
            codeGrpNo: rowData.codeGrpNo,
            codeGrpName: rowData.codeGrpName,
            code,
            codeName,
            attri1,
            attri2,
            note,
        };
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.patch('/sys/code', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.codeName}이 성공적으로 수정되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.codeName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };
    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        {"코드 그룹 ID"}
                    </div>
                    {/* <TextField size='small' id='codeGrpNo' value={rowData.codeGrpNo} disabled label="코드 그룹 번호" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeGrpNo' disabled value={rowData.codeGrpNo} label="코드 그룹 번호" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 그룹 이름"}</div>
                    {/* <TextField size='small' id='codeName' value={rowData.codeGrpName} disabled label="코드 그룹 이름" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='codeName' disabled value={rowData.codeGrpName} label="코드 그룹 이름" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드"}</div>
                    {/* <TextField size='small' id='code' value={code} onChange={(e) => setCode(e.target.value)} label="코드" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='code' value={code} onChange={(e) => setCode(e.target.value)} label="코드" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"코드 명"}</div>
                    {/* <TextField size='small' id='codeName' value={codeName} onChange={(e) => setCodeName(e.target.value)} label="코드 명" variant='outlined' sx={{ width: "20rem" }} /
                    > */}
                    <Input id='codeName' value={codeName} onChange={(e) => setCodeName(e.target.value)} label="코드 명" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성1"}</div>
                    {/* <TextField size='small' id='attri1' value={attri1} onChange={(e) => setAttri1(e.target.value)} label="속성1" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='attri1' value={attri1} onChange={(e) => setAttri1(e.target.value)} label="속성1" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성2"}</div>
                    {/* <TextField size='small' id='attri2' value={attri2} onChange={(e) => setAttri2(e.target.value)} label="속성2" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='attri2' value={attri2} onChange={(e) => setAttri2(e.target.value)} label="속성2" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    {/* <TextField size='small' id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" variant='outlined' sx={{ width: "20rem" }} /> */}
                    <Input id='note' value={note} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>수정</button>
            </div>
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
        let swalOptions = {
            confirmButtonText: '확인'
        };

        const formData = {
            pjtId: rowData[0].id,
            equipLibId: value1[0].id, // selectedSulbi[0] <- 여러개일땐 
            equipName,
        };

        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/equip', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.equipName}가 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.equipName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
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
            width={600}
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
                    <Table columns={equipColumns} data={value1} onRowClick={handleSulbiClick} />
                    <div className={sysStyles.text_field}>
                        <div className={sysStyles.text} style={{marginTop:"3rem", marginLeft:"5rem", fontWeight:"bold"}}>{"설비 명"}</div>
                        <TextField size="small" id='equipName' label="설비 명" value={equipName} onChange={(e) => setEquipName(e.target.value)} variant='outlined' sx={{ width: "25rem", margin:"0 auto", display:"flex", justifyContent:"center", alignContent:"center" }} />
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
        let swalOptions = {
            confirmButtonText: '확인'
        };
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
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.userName}가 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.userName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';

        }
        Swal.fire(swalOptions);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>사용자 등록</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text} style={{marginTop:"0.5rem"}}>{"이름"}</div>
                    <TextField id='userName' size="small" label="이름" value={userName} onChange={(e) => setUserName(e.target.value)} borderRadious="4px" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field} style={{ width:"20rem" }}>
                    <div className={sysStyles.text}>
                        {"로그인 ID"}
                    </div>
                    <TextField id='loginId' size="small" label="로그인 ID" value={loginId} onChange={(e) => setLoginId(e.target.value)} variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"비밀번호"}</div>
                    <TextField id='userName' size="small" label="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"부서 명"}</div>
                    <Select value={selectedDept} onChange={(value) => setSelectedDept(value)} style={{width:"20rem", height:"2.5rem",fontSize:"4rem"}}>
                    {dept.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"권한"}</div>
                    <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} style={{width:"20rem", height:"2.5rem", fontSize:"4rem"}}>
                    {access.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
                <button style={{width:"20rem"}} className={modalStyles.select_button} onClick={handleInsert}>등록</button>
            </div>
        </Modal>
    )
}

export function MmAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [selectedRole, setSelectedRole] = useState('');
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
    const [menuName, setMenuName] = useState('');
    const [url, setUrl] = useState('');
    const [orderMenu, setOrderMenu] = useState('');
    
    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = async () => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        const formData = {
            menuName,
            rootId: selectedUpperDir,
            address: url === "" ? null : url,
            accessUser: selectedRole,
            menuOrder: orderMenu
        };
        
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/sys/menu', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.menuName}가 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add menu:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.menuName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };
    
    const [upperDir, setUpperDir] = useState([]);
    const [selectedUpperDir, setSelectedUpperDir] = useState('');
    const [orderMenuList, setOrderMenuList] = useState([]);
    const [selectedOrderMenu, setSelectedOrderMenu] = useState([]);

    useEffect(() => {
        const fetchUpperDir = async () => {
            try {
                const {data} = await axiosInstance.get(`/sys/menu/cand?id=0`)
                setUpperDir(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpperDir();
    },[])

    useEffect(() => {
        if (selectedUpperDir){
            (async () => {
                const {data} = await axiosInstance.get(`/sys/menu/menu-order?id=${selectedUpperDir}&isInsert=true`)
                setOrderMenuList(data);
            })();
        }
        else {
            // setOrderMenuList([]);
        }
    })

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>메뉴 등록</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        {"메뉴 이름"}
                    </div>
                    <TextField size='small' id='menuName' value={menuName} onChange={(e) => setMenuName(e.target.value)} label="메뉴 이름" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"상위 폴더"}</div>
                    <Select value={selectedUpperDir} onChange={(e) => {setSelectedUpperDir(e)}} style={{width:"20rem", height:"2.5rem", fontSize:"4rem"}}>
                    {upperDir.map(option => (
                        <Select.Option key={option.id} value={option.id}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"Url 주소"}</div>
                    <TextField size='small' id='address' value={url} onChange={(e) => setUrl(e.target.value)} label="Url 주소" variant='outlined' sx={{ width: "20rem" }} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"메뉴 순서"}</div>
                    <Select placeholder={"메뉴 순서"} value={orderMenu} onChange={(value) => setOrderMenu(value)} style={{width:"20rem", height:"2.5rem", fontSize:"4rem"}}>
                    {orderMenuList.map(option => (
                        <Select.Option key={option} value={option}>
                            {option}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"접근 권한"}</div>
                    <Select placeholder={"접근 권한"} value={selectedRole} onChange={(value) => setSelectedRole(value)} style={{width:"20rem", height:"2.5rem", fontSize:"4rem"}}>
                    {access.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"20rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
        </Modal>
    )
}

export function EsmAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [emtnCands, setEmtnCands] = useState([]); // 배출원 후보 목록
    const [selectedEmtnCands, setSelectedEmtnCands] = useState([]); // 선택된 배출원 후보 목록

    // 배출원 후보 불러오기 
    useEffect(() => {
        const fetchEmtnCands = async () => {
            try {
                let url = `/equip/emission/cand?projectId=${rowData}`;
                const emtnCandData = await axiosInstance.get(url);
                setEmtnCands(emtnCandData.data);
            } catch (error) {
                console.log(error);
            }
            
        };
        fetchEmtnCands(); // 컴포넌트 마운트 될 때 데이터불러옴
    }, [isModalOpen, rowData])

    // 배출원 row 클릭 시 호출될 함수
    const handleEmtnClick = (row) => {
        setSelectedEmtnCands(row);
        console.log(row);
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = async () => {
        let swalOptions = {
            confirmButtonText: '확인'
        };

        // selectedEmtnCands가 null이거나 비었으면 모달 닫고 함수 종료
        if (!selectedEmtnCands || selectedEmtnCands.length === 0) {
            handleCancel();
            return;
        }

        try {
            // POST 요청으로 서버에 데이터 전송
            const requests = selectedEmtnCands.map((selectedEmtnCand) => {
                const regData = {
                    equipId: selectedEmtnCand.equipId,
                    actvDataId: selectedEmtnCand.actvDataId,
                };

                // 각 항목에 대해 POST 요청을 보내고, 요청 결과를 Promise 배열로 수집
                return axiosInstance.post('/equip/emission', regData);
            });

            // 모든 요청이 완료될 때까지 대기
            const responses = await Promise.all(requests);
            const responseEmtnCands = responses.map(response => response.data);

            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(responseEmtnCands);
            console.log("handleOk2", handleOk);
            swalOptions.title = '성공!',
            swalOptions.text = `배출원이 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error('Failed to add user:', error);
            swalOptions.title = '실패!',
            swalOptions.text = `배출원 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={800}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>배출원 등록</div>

            <Table data={emtnCands} variant='checkbox' onRowClick={handleEmtnClick} columns={equipEmissionColumns} modalPagination={true} />

            <button className={modalStyles.select_button} onClick={handleSelect}>등록</button>
        </Modal>
    )
}

export function SdAddModal({ isModalOpen, handleOk, handleCancel, rowData, yearSelectOptions }) {
    // const [formData, setFormData] = useState({
    //     actvYear: new Date().getFullYear().toString(),
    //     actvMth: (new Date().getMonth() + 1).toString(),
    //     name: '',
    //     fileList: []
    // });
    // const [errors, setErrors] = useState({});

    // // 모달 열 때마다 clear
    // useEffect(() => {
    //     if (isModalOpen) {
    //         setFormData({
    //             actvYear: new Date().getFullYear().toString(),
    //             actvMth: (new Date().getMonth() + 1).toString(),
    //             name: '',
    //             fileList: []
    //         });
    //         setErrors({});
    //     }
    // }, [isModalOpen]);

    // const handleFileChange = (event) => {
    //     const newFiles = Array.from(event.target.files);
    //     setFormData(prevData => {
    //         const existingFileNames = new Set(prevData.fileList.map(file => file.name));
    //         const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
    //         return {
    //             ...prevData,
    //             fileList: [...prevData.fileList, ...filteredNewFiles]
    //         };
    //     });
    //     // 동일한 파일을 다시 선택할 수 있도록 input의 값을 초기화
    //     event.target.value = null;
    // };

    // const handleFileRemove = (fileName) => {
    //     setFormData(prevData => ({
    //         ...prevData,
    //         fileList: prevData.fileList.filter(file => file.name !== fileName)
    //     }));
    // };

    // const uploadFiles = async () => {
    //     let swalOptions = {
    //         confirmButtonText: '확인'
    //     };

    //     try {
    //         /*
    //         const regData = {
    //             files: formData.fileList
    //         };
    //         const response = await axiosInstance.post('/s3/upload', regData);
    //         */
    //         const formDataForUpload = new FormData();
    //         formData.fileList.forEach(file => {
    //             formDataForUpload.append('files', file);
    //         });
    //         const response = await axiosInstance.post('/s3/upload', formDataForUpload, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         return response.data; // 파일 업로드 후 S3에서 반환된 파일 정보 배열
    //     } catch (error) {
    //         console.error('Error uploading files to S3:', error);
    //         swalOptions.title = '실패!',
    //         swalOptions.text = `증빙자료 등록에 실패하였습니다.`;
    //         swalOptions.icon = 'error';
    //     }
    //     Swal.fire(swalOptions);
    // };

    // const onSaveClick = async () => {
    //     // 입력 값 검증
    //     let newErrors = {};
    //     if (!formData.actvYear || !formData.actvMth) newErrors.actvYearMth = '대상년월을 선택해 주세요.';
    //     if (!formData.name) newErrors.name = '필수 항목입니다.';
    //     if (formData.fileList.length === 0) newErrors.fileList = '파일을 선택해 주세요.';

    //     if (Object.keys(newErrors).length > 0) {
    //         setErrors(newErrors);
    //         return;
    //     }

    //     setErrors({});

    //     // 입력값 검증 통과하면 등록 수행
    //     let swalOptions = {
    //         confirmButtonText: '확인'
    //     };
        
    //     try {
    //         const uploadedFiles = await uploadFiles();

    //         const documentData = {
    //             emissionId: rowData.id,
    //             actvYear: parseInt(formData.actvYear, 10),
    //             actvMth: parseInt(formData.actvMth, 10),
    //             name: formData.name,
    //             files: uploadedFiles.map(file => ({
    //                 name: file.name,
    //                 url: file.url
    //             }))
    //         };

    //         // 데이터 전송
    //         const response = await axiosInstance.post('/equip/document', documentData);

    //         handleOk(response.data, true); // 새로 입력된 데이터를 handleOk 함수로 전달, 두번째 인자-closeModal=true
    //         swalOptions.title = '성공!',
    //         swalOptions.text = `성공적으로 등록되었습니다.`;
    //         swalOptions.icon = 'success';
    //     } catch (error) {
    //         console.error('Error saving document:', error);
    //         swalOptions.title = '실패!',
    //         swalOptions.text = `등록에 실패하였습니다.`;
    //         swalOptions.icon = 'error';
    //     }
    //     Swal.fire(swalOptions);
    // };

    // return (
    //     <Modal
    //         open={isModalOpen}
    //         onCancel={handleCancel}
    //         width={400}
    //         footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    //     >
    //         <div className={modalStyles.title}>증빙서류 등록</div>

    //         <div className={sdStyles.input_container}>

    //             <div className={sdStyles.input_item}>
    //                 <div className={sdStyles.input_title}>
    //                     대상년월
    //                     <span className={sdStyles.requiredAsterisk}>*</span>
    //                 </div>
    //                 <div className={sdStyles.select_item}>
    //                     <Select
    //                         id="actvYear"
    //                         value={formData.actvYear}
    //                         onChange={(value) => setFormData(prevData => ({ ...prevData, actvYear: value }))}
    //                     >
    //                         {yearSelectOptions.map(option => (
    //                             <Select.Option key={option.value} value={option.value}>
    //                                 {option.label}
    //                             </Select.Option>
    //                         ))}
    //                     </Select>
    //                     <div>년</div>
    //                     <Select
    //                         id="actvMth"
    //                         value={formData.actvMth}
    //                         onChange={(value) => setFormData(prevData => ({ ...prevData, actvMth: value }))}
    //                     >
    //                         {selectMonth.map(option => (
    //                             <Select.Option key={option.value} value={option.value}>
    //                                 {option.label}
    //                             </Select.Option>
    //                         ))}
    //                     </Select>
    //                     <div>월</div>
    //                 </div>
    //                 {errors.actvYearMth && <div className={modalStyles.error_message}>{errors.actvYearMth}</div>}
    //             </div>

    //             <div className={sdStyles.input_item}>
    //                 <div className={sdStyles.input_title}>
    //                     자료명
    //                     <span className={sdStyles.requiredAsterisk}>*</span>
    //                 </div>
    //                 <input
    //                     className={sdStyles.search}
    //                     id="name"
    //                     value={formData.name}
    //                     onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
    //                 />
    //                 {errors.name && <div className={modalStyles.error_message}>{errors.name}</div>}
    //             </div>

    //             <div className={sdStyles.upload_item}>
    //                 <div className={sdStyles.upload_header}>
    //                     <div className={sdStyles.input_title}>
    //                         첨부파일
    //                         <span className={sdStyles.requiredAsterisk}>*</span>
    //                     </div>
    //                     <div>
    //                         <input
    //                             type="file"
    //                             id="fileList"
    //                             name="fileList"
    //                             multiple
    //                             style={{ display: 'none' }} // 숨김 처리
    //                             onChange={handleFileChange} // 파일 선택 시 호출
    //                         />
    //                         <button
    //                             type="button"
    //                             onClick={() => document.getElementById('fileList').click()}
    //                             className={ps12Styles.upload_button}
    //                         >
    //                             파일선택 <PaperClipOutlined />
    //                         </button>
    //                     </div>
    //                 </div>
    //                 <div className={sdStyles.file_list_container}>
    //                     <div className={sdStyles.file_list}>
    //                         {formData.fileList.length === 0 ? (
    //                             <></>
    //                         ) : (
    //                             formData.fileList.map((file, index) => (
    //                                 <div key={index} className={sdStyles.file_item}>
    //                                     {file.name}
    //                                     <button
    //                                         type="button"
    //                                         className={sdStyles.remove_button}
    //                                         onClick={() => handleFileRemove(file.name)}
    //                                     >
    //                                         <CloseOutlined />
    //                                     </button>
    //                                 </div>
    //                             ))
    //                         )}
    //                     </div>
    //                 </div>
    //                 {errors.fileList && <div className={modalStyles.error_message}>{errors.fileList}</div>}
    //             </div>
    //         </div>

    //         <button className={ps12Styles.select_button} onClick={onSaveClick}>저장</button>
    //     </Modal>
    // )
}

export function SdShowDetailsModal({ selectedSd, isModalOpen, handleOk, handleCancel, yearSelectOptions }) {
    // const [formData, setFormData] = useState({
    //     actvYear: '',
    //     actvMth: '',
    //     name: '',
    //     fileList: []
    // });
    // const [errors, setErrors] = useState({});

    // const [isEditing, setIsEditing] = useState(false);
    // const [innerSelectedSd, setInnerSelectedSd] = useState(selectedSd);

    // useEffect(() => {
    //     if (selectedSd) {
    //         setFormData({
    //             actvYear: String(selectedSd.actvYear || new Date().getFullYear()),
    //             actvMth: String(selectedSd.actvMth || (new Date().getMonth() + 1)),
    //             name: selectedSd.name || '',
    //             fileList: Array.isArray(selectedSd.files) ? selectedSd.files.map(file => ({
    //                 name: file.name,
    //                 status: 'done',
    //                 url: file.url
    //             })) : []
    //         });
    //         setInnerSelectedSd(selectedSd);
    //     }
    // }, [selectedSd]);

    // const handleFileChange = (event) => {
    //     const newFiles = Array.from(event.target.files).map(file => ({
    //         name: file.name,
    //         status: 'new',
    //         originFileObj: file
    //     }));

    //     setFormData(prevData => {
    //         const existingFileNames = new Set(prevData.fileList.map(file => file.name));
    //         const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
    //         return {
    //             ...prevData,
    //             fileList: [...prevData.fileList, ...filteredNewFiles]
    //         };
    //     });
    //     // 동일한 파일을 다시 선택할 수 있도록 input의 값을 초기화
    //     event.target.value = null;
    // };

    // const handleFileRemove = (fileName) => {
    //     setFormData(prevData => ({
    //         ...prevData,
    //         fileList: prevData.fileList.filter(file => file.name !== fileName)
    //     }));
    // };

    // const uploadFiles = async () => { // 새로 추가된 파일만 업로드
    //     let swalOptions = {
    //         confirmButtonText: '확인'
    //     };

    //     // formData.fileList가 null이거나 비어있는지 확인
    //     if (!formData.fileList || formData.fileList.length === 0) {
    //         swalOptions.title = '실패!';
    //         swalOptions.text = '첨부된 증빙파일이 없습니다.';
    //         swalOptions.icon = 'error';
    //         Swal.fire(swalOptions);
    //         return []; // 더 이상 진행하지 않도록 함수 종료
    //     }

    //     try {
    //         const formDataForUpload = new FormData();
    //         formData.fileList.forEach(file => {
    //             if (file.status === 'new') {
    //                 formDataForUpload.append('files', file.originFileObj); // 실제 File 객체를 추가
    //             }
    //         });
    //         if (formDataForUpload.getAll('files').length > 0) {
    //             const response = await axiosInstance.post('/s3/upload', formDataForUpload, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data'
    //                 }
    //             });

    //             return response.data; // 파일 업로드 후 S3에서 반환된 파일 정보 배열
    //         }
    //         return []; // 파일이 없으면 빈 배열 반환
    //     } catch (error) {
    //         console.error('Error uploading files to S3:', error);
    //         swalOptions.title = '실패!',
    //         swalOptions.text = `증빙자료 등록에 실패하였습니다.`;
    //         swalOptions.icon = 'error';
    //         Swal.fire(swalOptions);
    //         return []; // 실패 시 빈 배열 반환
    //     }
    // };

    // const onSaveClick = async () => {
    //     // 입력 값 검증
    //     let newErrors = {};
    //     if (!formData.actvYear || !formData.actvMth) newErrors.actvYearMth = '대상년월을 선택해 주세요.';
    //     if (!formData.name) newErrors.name = '필수 항목입니다.';
    //     if (formData.fileList.length === 0) newErrors.fileList = '파일을 선택해 주세요.';

    //     if (Object.keys(newErrors).length > 0) {
    //         setErrors(newErrors);
    //         return;
    //     }

    //     setErrors({});

    //     // 입력값 검증 통과하면 등록 수행
    //     let swalOptions = {
    //         confirmButtonText: '확인'
    //     };

    //     try {
    //         const uploadedFiles = await uploadFiles() || []; // uploadFiles가 null 또는 undefined일 경우 빈 배열로 처리
            
    //         const existingFiles = (formData.fileList || []).filter(file => file.status === 'done').map(file => ({
    //             name: file.name,
    //             url: file.url
    //         }));
    //         const newFiles = uploadedFiles.map(file => ({ // 기존 파일들 + uploadFiles
    //             name: file.name,
    //             url: file.url
    //         }));
    //         // 최종 파일 목록
    //         const allFiles = [...existingFiles, ...newFiles];

    //         const documentData = {
    //             id: selectedSd.id,
    //             name: formData.name,
    //             files: allFiles
    //         };
            
    //         // 데이터 전송
    //         const response = await axiosInstance.patch('/equip/document', documentData);

    //         setInnerSelectedSd(response.data); // innerSelectedSd 상태 업데이트
    //         setFormData(prevData => ({
    //             ...prevData,
    //             fileList: allFiles.map(file => ({
    //                 name: file.name,
    //                 status: 'done',
    //                 url: file.url
    //             }))
    //         }));

    //         handleOk(response.data, false);  // 새로 입력된 데이터를 handleOk 함수로 전달, 두번째 인자-closeModal=false
    //         setIsEditing(false); // 저장 후 편집 모드 종료
            
    //         swalOptions.title = '성공!',
    //         swalOptions.text = `성공적으로 수정되었습니다.`;
    //         swalOptions.icon = 'success';
    //     } catch (error) {
    //         console.error('Error saving document:', error);
    //         swalOptions.title = '실패!',
    //         swalOptions.text = `수정에 실패하였습니다.`;
    //         swalOptions.icon = 'error';
    //     }
    //     Swal.fire(swalOptions);
    // };

    // const onEditClick = () => {
    //     setErrors({});
    //     setIsEditing(true); // 비편집 모드일 때 편집 모드로 전환
    // };
    // const onCancelClick = () => {
    //     setErrors({});
    //     if (innerSelectedSd) {
    //         setFormData({
    //             actvYear: String(innerSelectedSd.actvYear || new Date().getFullYear()),
    //             actvMth: String(innerSelectedSd.actvMth || (new Date().getMonth() + 1)),
    //             name: innerSelectedSd.name || '',
    //             fileList: Array.isArray(innerSelectedSd.files) ? innerSelectedSd.files.map(file => ({
    //                 name: file.name,
    //                 status: 'done',
    //                 url: file.url
    //             })) : []
    //         });
    //     }
    //     handleOk(innerSelectedSd, false);
    //     setIsEditing(false);
    // };

    // const showEditingAlert = () => {
    //     Swal.fire({
    //         icon: 'warning',
    //         title: '저장되지 않았습니다',
    //         text: '변경사항이 저장되지 않았습니다. 정말 닫으시겠습니까?',
    //         showCancelButton: true,
    //         cancelButtonText: '취소',
    //         confirmButtonText: '확인'
    //     }).then(result => {
    //         if (result.isConfirmed) {
    //             onCancelClick(); // 변경사항 취소 및 폼 데이터 복원
    //             handleCancel(); // 모달 닫기 처리
    //         }
    //     });
    // };

    // return (
    //     <Modal
    //         open={isModalOpen}
    //         onCancel={isEditing ? showEditingAlert : handleCancel} // 수정 중일 때 닫기 시도 시 경고 알림
    //         width={400}
    //         footer={null} //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    //         maskClosable={!isEditing} // 모달 밖을 클릭해도 닫히지 않게 설정
    //     >
    //         <div className={sdStyles.modal_header}>
    //             <div className={modalStyles.title}>증빙서류 상세보기</div>
    //         </div>

    //         <div className={sdStyles.input_container}>

    //             <div className={sdStyles.input_item}>
    //                 <div className={sdStyles.input_title}>
    //                     대상년월
    //                     <span className={sdStyles.requiredAsterisk}>*</span>
    //                 </div>
    //                 <div className={sdStyles.select_item}>
    //                     <Select
    //                         id="actvYear"
    //                         value={formData.actvYear}
    //                         onChange={(value) => setFormData(prevData => ({ ...prevData, actvYear: value }))}
    //                         disabled={true} // 항상 비활성화
    //                     >
    //                         {yearSelectOptions.map(option => (
    //                             <Select.Option key={option.value} value={option.value}>
    //                                 {option.label}
    //                             </Select.Option>
    //                         ))}
    //                     </Select>
    //                     <div>년</div>
    //                     <Select
    //                         id="actvMth"
    //                         value={formData.actvMth}
    //                         onChange={(value) => setFormData(prevData => ({ ...prevData, actvMth: value }))}
    //                         disabled={true} // 항상 비활성화
    //                     >
    //                         {selectMonth.map(option => (
    //                             <Select.Option key={option.value} value={option.value}>
    //                                 {option.label}
    //                             </Select.Option>
    //                         ))}
    //                     </Select>
    //                     <div>월</div>
    //                 </div>
    //                 {errors.actvYearMth && <div className={modalStyles.error_message}>{errors.actvYearMth}</div>}
    //             </div>

    //             <div className={sdStyles.input_item}>
    //                 <div className={sdStyles.input_title}>
    //                     등록자
    //                 </div>
    //                 <input className={sdStyles.search} id="creator"
    //                     value={selectedSd.creatorDeptCode+" / "+selectedSd.creatorName}
    //                     onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
    //                     disabled={true} // 항상 비활성화
    //                 />
    //             </div>

    //             <div className={sdStyles.input_item}>
    //                 <div className={sdStyles.input_title}>
    //                     자료명
    //                     <span className={sdStyles.requiredAsterisk}>*</span>
    //                 </div>
    //                 <input className={sdStyles.search} id="name"
    //                     value={formData.name}
    //                     onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
    //                     disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
    //                 />
    //                 {errors.name && <div className={modalStyles.error_message}>{errors.name}</div>}
    //             </div>

    //             <div className={sdStyles.upload_item}>
    //                 <div className={sdStyles.upload_header}>
    //                     <div className={sdStyles.input_title}>
    //                         첨부파일
    //                         <span className={sdStyles.requiredAsterisk}>*</span>
    //                     </div>
    //                     <div>
    //                         <input
    //                             type="file"
    //                             id="fileList"
    //                             name="fileList"
    //                             multiple
    //                             style={{ display: 'none' }} // 숨김 처리
    //                             onChange={handleFileChange} // 파일 선택 시 호출
    //                             disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
    //                         />
    //                         <button
    //                             type="button"
    //                             onClick={() => document.getElementById('fileList').click()}
    //                             className={ps12Styles.upload_button}
    //                             disabled={!isEditing} // 편집 모드가 아닐 때 비활성화
    //                         >
    //                             파일선택 <PaperClipOutlined />
    //                         </button>
    //                     </div>
    //                 </div>
    //                 <div className={sdStyles.file_list_container}>
    //                     <div className={sdStyles.file_list}>
    //                         {formData.fileList.length === 0 ? (
    //                             <></>
    //                         ) : (
    //                             formData.fileList.map((file, index) => { // file.name 편집모드 아닐 때는 클릭시 다운
    //                                 let displayName = file.name;
    //                                 if (file.status === 'done') {
    //                                     const underscoreIndex = file.name.indexOf('_');
    //                                     if (underscoreIndex !== -1) {
    //                                         displayName = file.name.substring(underscoreIndex + 1);
    //                                     }
    //                                 }
                                    
    //                                 return (
    //                                     <div key={index} className={sdStyles.file_item}>
    //                                         {isEditing ? (
    //                                             displayName
    //                                         ) : (
    //                                             <a href={file.url} target="_blank" rel="noopener noreferrer">
    //                                                 {displayName}
    //                                             </a>
    //                                         )}
    //                                         {isEditing && (
    //                                             <button
    //                                                 type="button"
    //                                                 className={sdStyles.remove_button}
    //                                                 onClick={() => handleFileRemove(file.name)}
    //                                             >
    //                                                 <CloseOutlined />
    //                                             </button>
    //                                         )}
    //                                     </div>
    //                                 )
    //                             })
    //                         )}
    //                     </div>
    //                 </div>
    //                 {errors.fileList && <div className={modalStyles.error_message}>{errors.fileList}</div>}
    //             </div>
    //         </div>

    //         {!isEditing ? (
    //             <button onClick={onEditClick} className={sdStyles.edit_button}>수정</button>
    //         ) : (
    //             <div className={sdStyles.button_group}>
    //                 <button onClick={onCancelClick} className={sdStyles.cancel_button}>취소</button>
    //                 <button onClick={onSaveClick} className={sdStyles.save_button}>저장</button>
    //             </div>
    //         )}
    //     </Modal>
    // )
}