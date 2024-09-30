import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Upload, Select, Input, ConfigProvider } from 'antd';
import Swal from 'sweetalert2';
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedSuppDocState } from '../atoms/pdsAtoms';
import { selectedPjtState } from '../atoms/searchFormAtoms.js';
import axiosInstance from '../utils/AxiosInstance';
import { TextField, Autocomplete } from '@mui/material';
import { PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import CheckOutlinedIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/DisabledByDefault';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Table from "../Table";
import { CustomButton } from '../Button';
import styled from 'styled-components';
import { pjtColumns, equipColumns, equipActvColumns, equipEmissionColumns } from '../assets/json/tableColumn.js';
import * as modalStyles from "../assets/css/pdModal.css";
import * as rmStyles from "../assets/css/rmModal.css";
import * as delStyle from "../assets/css/delModal.css";
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import * as sdStyles from "../assets/css/sdModal.css";
import * as pdsStyles from "../assets/css/pds.css";
import * as sysStyles from "../assets/css/sysmng.css"
import * as ps12Styles from "../assets/css/ps12UploadExcelModal.css";

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

const selectMonth = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' }
];

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
         // 입력 값에 공백이 있다면 제거
        const trimmedCode = pjtCode.trim();
        const trimmedName = pjtName.trim();
        
        // 필터링 로직
        const filteredProjects = allProjects.filter(pjt => {
            // 프로젝트 코드와 이름이 비어있는 경우를 처리
            const matchesCode = trimmedCode 
                ? pjt.pjtCode.toLowerCase().includes(trimmedCode.toLowerCase()) 
                : true;
            const matchesName = trimmedName 
                ? pjt.pjtName.toLowerCase().includes(trimmedName.toLowerCase()) 
                : true;

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
        setSelectedPjts(pjt.row ?? {});
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
        <div className={pjtModalStyles.group_container}>
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
            <div className={pjtModalStyles.button_container}>
                <CustomButton className={pjtModalStyles.select_button} onClick={handleSelect} disabled={selectedPjts.length === 0}>
                    <CheckOutlinedIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                    <span className={pjtModalStyles.button_text}>선택</span>
                </CustomButton> 
                <CustomButton className={pjtModalStyles.select_button} onClick={handleCancel}>
                <CloseIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                <span className={pjtModalStyles.button_text}>취소</span>
                </CustomButton> 
            </div>
            </div>
            <div className={pjtModalStyles.result_container}>
                <Table data={project} columns={pjtColumns} variant='checkbox' onRowClick={handlePjtClick} modalPagination={true} />
            </div>
        </div>
      </Modal>
    )
}

export function FlAddModal({ isModalOpen, handleOk, handleCancel, dropDown }) {
    const [eqLibName, setEqLibName] = useState('');
    const [selectedEqDvs, setSelectedEqDvs] = useState('');
    const [selectedEqType, setSelectedEqType] = useState('');
    const [selectedEqSpecUnit, setSelectedEqSpecUnit] = useState('');
    const [errors, setErrors] = useState({});

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

        // 입력 값 검증
        let newErrors = {};
        if (!formData.eqLibName) newErrors.eqLibName = '설비명을 입력해 주세요.';
        if (!formData.eqDvs) newErrors.eqDvs = '설비구분을 선택해 주세요.';
        if (!formData.eqType) newErrors.eqType = '설비유형을 선택해 주세요.';
        if (!formData.eqSpecUnit) newErrors.eqSpecUnit = '설비사양단위를 선택해 주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        handleOk(formData);
    };

    return (
        <ConfigProvider theme={{token:{fontFamily:"SUITE-Regular"}}}>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                width={350}
                footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
            >
                <div className={rmStyles.title}>설비LIB 등록</div>

                <div className={rmStyles.submit_container}>
                    <div className={rmStyles.search_item}>
                        <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비LIB명</div>
                        <Input
                            value={eqLibName}
                            allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                            onChange={(e) => setEqLibName(e.target.value)}
                            style={{ width: '18rem' }}
                        />
                        {errors.eqLibName && <div className={modalStyles.error_message}>{errors.eqLibName}</div>}
                    </div>
                    <div className={rmStyles.search_item}>
                        <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비구분</div>
                        <Select
                            value={selectedEqDvs}
                            allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                            onChange={(value) => setSelectedEqDvs(value)}
                            style={{ width: '18rem' }}
                        >
                            {getOptions('equipDvs').map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        {errors.eqDvs && <div className={modalStyles.error_message}>{errors.eqDvs}</div>}
                    </div>
                    <div className={rmStyles.search_item}>
                        <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비유형</div>
                        <Select
                            value={selectedEqType}
                            allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                            onChange={(value) => setSelectedEqType(value)}
                            style={{ width: '18rem' }}
                        >
                            {getOptions('equipType').map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        {errors.eqType && <div className={modalStyles.error_message}>{errors.eqType}</div>}
                    </div>
                    <div className={rmStyles.search_item}>
                        <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비사양단위</div>
                        <Select
                            value={selectedEqSpecUnit}
                            allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                            onChange={(value) => setSelectedEqSpecUnit(value)}
                            style={{ width: '18rem' }}
                        >
                            {getOptions('equipSpecUnit').map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        {errors.eqSpecUnit && <div className={modalStyles.error_message}>{errors.eqSpecUnit}</div>}
                    </div>
                    <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
                </div>

                
            </Modal>
        </ConfigProvider>
    )
}

export function FlEditModal({ isModalOpen, handleOk, handleCancel, rowData, dropDown }) {
    const [eqLibName, setEqLibName] = useState('');
    const [selectedEqDvs, setSelectedEqDvs] = useState('');
    const [selectedEqType, setSelectedEqType] = useState('');
    const [selectedEqSpecUnit, setSelectedEqSpecUnit] = useState('');
    const [errors, setErrors] = useState({});

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

        // 입력 값 검증
        let newErrors = {};
        if (!formData.eqLibName) newErrors.eqLibName = '설비명을 입력해 주세요.';
        if (!formData.eqDvs) newErrors.eqDvs = '설비구분을 선택해 주세요.';
        if (!formData.eqType) newErrors.eqType = '설비유형을 선택해 주세요.';
        if (!formData.eqSpecUnit) newErrors.eqSpecUnit = '설비사양단위를 선택해 주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        handleOk(formData);
    };

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            width={350}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>설비LIB 수정</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비LIB명</div>
                    <Input
                        value={eqLibName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '18rem' }}
                    />
                    {errors.eqLibName && <div className={modalStyles.error_message}>{errors.eqLibName}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비구분</div>
                    <Select
                        value={selectedEqDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqDvs(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('equipDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.eqDvs && <div className={modalStyles.error_message}>{errors.eqDvs}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비유형</div>
                    <Select
                        value={selectedEqType}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqType(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('equipType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.eqType && <div className={modalStyles.error_message}>{errors.eqType}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>설비사양단위</div>
                    <Select
                        value={selectedEqSpecUnit}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEqSpecUnit(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('equipSpecUnit').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.eqSpecUnit && <div className={modalStyles.error_message}>{errors.eqSpecUnit}</div>}
                </div>
                <button className={rmStyles.select_button} onClick={handleSelect}>수정</button>
            </div>
            
            
        </Modal>
        </ConfigProvider>
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
    const [errors, setErrors] = useState({});

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

        // 입력 값 검증
        let newErrors = {};
        if (!formData.actvDataName) newErrors.actvDataName = '활동자료명을 입력해 주세요.';
        if (!formData.actvDataDvs) newErrors.actvDataDvs = '활동자료구분을 선택해 주세요.';
        if (!formData.emtnActvType) newErrors.emtnActvType = '배출활동유형을 선택해 주세요.';
        if (!formData.inputUnit) newErrors.inputUnit = '입력단위를 선택해 주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        handleOk(formData);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>활동자료 등록</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>활동자료명</div>
                    <Input
                        value={actvName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setActvName(e.target.value)}
                        style={{ width: '18rem' }}
                    />
                    {errors.actvDataName && <div className={modalStyles.error_message}>{errors.actvDataName}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>활동자료구분</div>
                    <Select
                        value={selectedActvDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedActvDvs(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('actvDataDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.actvDataDvs && <div className={modalStyles.error_message}>{errors.actvDataDvs}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>배출활동유형</div>
                    <Select
                        value={selectedEmtnActv}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEmtnActv(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('emtnActvType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.emtnActvType && <div className={modalStyles.error_message}>{errors.emtnActvType}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>입력단위</div>
                    <Select
                        value={selectedInputUnit}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => handleInputUnitChange(value)}
                        style={{ width: '18rem' }}
                    >
                        {actvUnits.map(unit => (
                            <Select.Option key={unit.inputUnitCode} value={unit.inputUnitCode}>
                                {unit.inputUnitCode}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.inputUnit && <div className={modalStyles.error_message}>{errors.inputUnit}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>산정단위</div>
                    <input 
                        className={rmStyles.search} 
                        id="calUnit" 
                        value={calUnit} 
                        readOnly 
                        style={{ width: '18rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>단위환산계수</div>
                    <input 
                        className={rmStyles.search} 
                        id="unitConvCoef" 
                        value={unitConvCoef} 
                        readOnly 
                        style={{ width: '18rem' }}
                    />
                </div>
                <button className={rmStyles.select_button} onClick={handleSelect}>등록</button>
            </div>

            
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
    const [errors, setErrors] = useState({});

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

    useEffect(() => {
        // actvUnits이 변경된 후에 실행
        if (actvUnits.length > 0 && rowData) {
            const actvDvsOption = getOptions('actvDataDvs').find(option => option.label === rowData.actvDataDvs);
            const actvTypeOption = getOptions('emtnActvType').find(option => option.label === rowData.emtnActvType);
            const inputUnitOption = getOptions('inputUnit').find(option => option.label === rowData.inputUnitCode);
    
            setActvName(rowData.actvDataName || '');
            setSelectedActvDvs(actvDvsOption ? actvDvsOption.value : '');
            setSelectedEmtnActv(actvTypeOption ? actvTypeOption.value : '');
            if (inputUnitOption) {
                handleInputUnitChange(inputUnitOption.value); // actvUnits이 설정된 후 호출
            }
        }
    }, [actvUnits, rowData]);

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

        // 입력 값 검증
        let newErrors = {};
        if (!formData.actvDataName) newErrors.actvDataName = '활동자료명을 입력해 주세요.';
        if (!formData.actvDataDvs) newErrors.actvDataDvs = '활동자료구분을 선택해 주세요.';
        if (!formData.emtnActvType) newErrors.emtnActvType = '배출활동유형을 선택해 주세요.';
        if (!formData.inputUnitCode) newErrors.inputUnit = '입력단위를 선택해 주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        handleOk(formData);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}                                                   //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={rmStyles.title}>활동자료 수정</div>

            <div className={rmStyles.submit_container}>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>활동자료명</div>
                    <Input
                        value={actvName}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setActvName(e.target.value)}
                        style={{ width: '18rem' }}
                    />
                    {errors.actvDataName && <div className={modalStyles.error_message}>{errors.actvDataName}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>활동자료구분</div>
                    <Select
                        value={selectedActvDvs}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedActvDvs(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('actvDataDvs').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.actvDataDvs && <div className={modalStyles.error_message}>{errors.actvDataDvs}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>배출활동유형</div>
                    <Select
                        value={selectedEmtnActv}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => setSelectedEmtnActv(value)}
                        style={{ width: '18rem' }}
                    >
                        {getOptions('emtnActvType').map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.emtnActvType && <div className={modalStyles.error_message}>{errors.emtnActvType}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}><span className={modalStyles.star}>*</span>입력단위</div>
                    <Select
                        value={selectedInputUnit}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(value) => handleInputUnitChange(value)}
                        style={{ width: '18rem' }}
                    >
                        {actvUnits.map(unit => (
                            <Select.Option key={unit.inputUnitCode} value={unit.inputUnitCode}>
                                {unit.inputUnitCode}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.inputUnit && <div className={modalStyles.error_message}>{errors.inputUnit}</div>}
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>산정단위</div>
                    <Input
                        value={calUnit}
                        disabled={true}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '18rem' }}
                    />
                </div>
                <div className={rmStyles.search_item}>
                    <div className={rmStyles.search_title}>단위환산계수</div>
                    <Input
                        value={unitConvCoef}
                        disabled={true}
                        allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }}
                        onChange={(e) => setEqLibName(e.target.value)}
                        style={{ width: '18rem' }}
                    />
                </div>
                <button className={rmStyles.select_button} onClick={handleSelect}>수정</button>
            </div>

            
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

            const matchesName = inputActvName ? actv.actvDataName?.includes(inputActvName) : true;
            const matchesActvDvs = inputActvDvs ? actv.actvDataDvs?.includes(opt.label) : true;
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
            width={1200}
            onCancel={handleCancel} 
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
            // bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
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
                            style={{ width: '12rem' }}
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
                <div className={pjtModalStyles.button_container}>
                    <CustomButton className={pjtModalStyles.select_button} onClick={handleSelect} disabled={selectedActves.length === 0}>
                        <CheckOutlinedIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                        <span className={pjtModalStyles.button_text}>선택</span>
                    </CustomButton> 
                    <CustomButton className={pjtModalStyles.select_button} onClick={handleCancel}>
                    <CloseIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                    <span className={pjtModalStyles.button_text}>취소</span>
                    </CustomButton> 
                </div>
            </div>

            <div className={pjtModalStyles.result_container}>
                <Table data={actves} columns={equipActvColumns} variant='checkbox' onRowClick={handleActvClick} modalPagination={true} />
            </div>

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
        event.target.value = null;
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

            handleOk(response.data, true); // 새로 입력된 데이터를 handleOk 함수로 전달, 두번째 인자-closeModal=true
            swalOptions.title = '성공!',
            swalOptions.text = `성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
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
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
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
                <div style={{fontFamily:"SUITE-Regular"}}>
                정말 삭제하시겠습니까?
                </div>
            </div>
            <div className={delStyle.buttonContainer}>
                <button className={delStyle.cancelButton} onClick={() => {handleCancel}}>취소</button>
                <button className={delStyle.okButton} onClick={() => {handleOk(rowData)}}>삭제</button>
            </div>
        </Modal>
        </ConfigProvider>   
    )
}

export function CmAddModal({ isModalOpen, handleOk, handleCancel }) {
    // 등록 버튼 클릭 시 호출될 함수
    const [codeGrpNo, setCodeGrpNo] = useState('');
    const [codeGrpName, setCodeGrpName] = useState('');
    const [codeGrpNameEn, setCodeGrpNameEn] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState({});

    const handleSelect = async() => {
        const formData = {
            codeGrpNo,
            codeGrpName,
            codeGrpNameEn,
            note,
        };
        let newError = {};
        if(!formData.codeGrpNo) newError.codeGrpNo = '코드그룹ID를 입력해주세요.';
        if(!formData.codeGrpName) newError.codeGrpName = '코드그룹명을 입력해주세요.';
        if(!formData.codeGrpNameEn) newError.codeGrpNameEn = '영문명을 입력해주세요.';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk(formData);
    };

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>코드 그룹 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"코드그룹ID"}
                    </div>
                    <Input id='codeGrpNo' value={codeGrpNo} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드그룹번호" style={{width:"18rem"}} />
                    {error.codeGrpNo && <div className={modalStyles.error_message}>{error.codeGrpNo}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드그룹명"}</div>
                    <Input id='codeGrpName' value={codeGrpName} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeGrpName(e.target.value)} label="코드그룹명" style={{width:"18rem"}} />
                    {error.codeGrpName && <div className={modalStyles.error_message}>{error.codeGrpName}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"영문명"}</div>
                    <Input id='codeGrpNameEn' value={codeGrpNameEn} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문명" style={{width:"18rem"}} />
                    {error.codeGrpNameEn && <div className={modalStyles.error_message}>{error.codeGrpNameEn}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <Input id='note' value={note} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
                <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
            
        </Modal>
        </ConfigProvider>
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
    const [error, setError] = useState({});
    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = async() => {
        const formData = {
            id: rowData.id,
            codeGrpNo,
            codeGrpName,
            codeGrpNameEn,
            note,
        };
        let newError = {};
        if(!formData.codeGrpNo) newError.codeGrpNo = '코드그룹ID를 입력해주세요.';
        if(!formData.codeGrpName) newError.codeGrpName = '코드그룹명을 입력해주세요.';
        if(!formData.codeGrpNameEn) newError.codeGrpNameEn = '영문명을 입력해주세요.';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }
        
        setError({});

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk(formData);
    };

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 그룹 수정</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"코드그룹ID"}
                    </div>
                    <Input id='codeGrpNo' value={codeGrpNo} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeGrpNo(e.target.value)} label="코드그룹번호" style={{width:"18rem"}} />
                    {error.codeGrpNo && <div className={modalStyles.error_message}>{error.codeGrpNo}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드그룹명"}</div>
                    <Input id='codeGrpName' value={codeGrpName} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeGrpName(e.target.value)} label="코드그룹명" style={{width:"18rem"}} />
                    {error.codeGrpName && <div className={modalStyles.error_message}>{error.codeGrpName}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"영문명"}</div>
                    <Input id='codeGrpNameEn' value={codeGrpNameEn} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeGrpNameEn(e.target.value)} label="영문명" style={{width:"18rem"}} />
                    {error.codeGrpNameEn && <div className={modalStyles.error_message}>{error.codeGrpNameEn}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <Input id='note' value={note} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>수정</button>
            </div>
        </Modal>
        </ConfigProvider>
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
                const res = await axiosInstance.delete(`${url}?id=${rowData.id}`);
            }
            
            swalOptions.title = '성공!',
            swalOptions.text = `${rowName}이(가) 성공적으로 삭제되었습니다.`;
            swalOptions.icon = 'success';
            handleOk();
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message,
            swalOptions.icon = 'error';
            handleCancel();
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
            <div style={{display:"flex", marginTop:"10%", marginLeft:"5%", gap:"1rem", fontSize:"1.3rem", fontWeight:"bold", fontFamily:"SUITE-Regular"}}>
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
    const [error, setError] = useState({});

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

        let newError = {};
        if(!formData.code) newError.code = '코드번호를 입력해주세요.';
        if(!formData.codeName) newError.codeName = '코드이름을 입력해주세요.';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
         handleOk(formData);
    };

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"코드그룹ID"}
                    </div>
                    <Input id='codeGrpNo' disabled value={rowData.codeGrpNo} label="코드 그룹 번호" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드그룹이름"}</div>
                    <Input id='codeName' disabled value={rowData.codeGrpName} label="코드 그룹 이름" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드번호"}</div>
                    <Input id='code' value={code} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCode(e.target.value)} label="코드" style={{width:"18rem"}} />
                    {error.code && <div className={modalStyles.error_message}>{error.code}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드명"}</div>
                    <Input id='codeName' value={codeName} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeName(e.target.value)} label="코드 명" style={{width:"18rem"}} />
                    {error.codeName && <div className={modalStyles.error_message}>{error.codeName}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성1"}</div>
                    <Input id='attri1' value={attri1} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setAttri1(e.target.value)} label="속성1" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성2"}</div>
                    <Input id='attri2' value={attri2} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setAttri2(e.target.value)} label="속성2" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <Input id='note' value={note} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
        </Modal>
        </ConfigProvider>
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
    const [error, setError] = useState({});
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

        let newError = {};
        if(!formData.code) newError.code = '코드번호를 입력해주세요.';
        if(!formData.codeName) newError.codeName = '코드이름을 입력해주세요.';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk(formData);
    };
    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>코드 리스트 수정</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"코드그룹ID"}
                    </div>
                    <Input id='codeGrpNo' disabled value={rowData.codeGrpNo} label="코드 그룹 번호" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드그룹이름"}</div>
                    <Input id='codeName' disabled value={rowData.codeGrpName} label="코드 그룹 이름" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드"}</div>
                    <Input id='code' value={code} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCode(e.target.value)} label="코드" style={{width:"18rem"}} />
                    {error.code && <div className={modalStyles.error_message}>{error.code}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"코드명"}</div>
                    <Input id='codeName' value={codeName} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCodeName(e.target.value)} label="코드 명" style={{width:"18rem"}} />
                    {error.codeName && <div className={modalStyles.error_message}>{error.codeName}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성1"}</div>
                    <Input id='attri1' value={attri1} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setAttri1(e.target.value)} label="속성1" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"속성2"}</div>
                    <Input id='attri2' value={attri2} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setAttri2(e.target.value)} label="속성2" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"노트"}</div>
                    <Input id='note' value={note} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setNote(e.target.value)} label="노트" style={{width:"18rem"}} />
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>수정</button>
            </div>
        </Modal>
        </ConfigProvider>
    )
}

export function EfmAddModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [applyYear, setApplyYear] = useState(new Date().getFullYear());
    const [applyDvs, setApplyDvs] = useState([]);
    const [selectedApplyDvs, setSelectedApplyDvs] = useState([]);
    const [ghgCode, setGhgCode] = useState([]);
    const [selectedGhgCode, setSelectedGhgCode] = useState([]);
    const [coefClassCode, setCoefClassCode] = useState([]);
    const [selectedCoefClassCode, setSelectedCoefClassCode] = useState([]);
    const [afterSelectedCoefClassCode, setAfterSelectedCoefClassCode] = useState([]);
    const [unitCode, setUnitCode] = useState("");
    const [coef, setCoef] = useState(0);
    const [error, setError] = useState({});

    const handleSelect = async() => {
        const formData = {
            actvDataId: rowData.id,
            applyYear,
            applyDvs: selectedApplyDvs,
            ghgCode: selectedGhgCode === null ? null : selectedGhgCode,
            coefClassCode:selectedCoefClassCode,
            unitCode,
            coef,
        };

        let newError = {};
        if(!formData.applyYear) newError.applyYear = '적용년도를 입력해주세요.';
        if(!formData.applyDvs) newError.applyDvs = '적용구분을 입력해주세요.';
        if(!formData.coefClassCode) newError.coefClassCode = '계수구분코드를 선택해주세요.';
        if(!formData.unitCode) newError.unitCode = '계수구분코드를 선택해주세요.';
        if(!formData.coef) newError.coef = '계수를 입력해주세요.';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk(formData);
    };

    useEffect(() => {
        const fetchData = async () => {
            const appDvsResponse = await axiosInstance.get(`/sys/unit?unitType=적용구분`);
            setApplyDvs(appDvsResponse.data);

            const coefResponse = [
                {
                    "code": 2,
                    "name": "순발열량"
                },
                {
                    "code": 1,
                    "name": "배출계수"
                }
            ]
            setCoefClassCode(coefResponse);
            const ghgResponse = await axiosInstance.get(`/sys/coef-unit?inputUnitCode=${rowData.inputUnitCode}`)
            setAfterSelectedCoefClassCode(ghgResponse.data);
        };

        fetchData();
    }, [])

    const handleInputUnitChange = (value) => {
        setSelectedCoefClassCode(value);
        if (value === 2){
            setSelectedGhgCode(null);
        }
        const matchedUnit = afterSelectedCoefClassCode[value === 2 ? 0 : value];
        if (matchedUnit) {
            setGhgCode(matchedUnit.gas);
            setUnitCode(matchedUnit.unit);
        }
        else{
            setGhgCode([]);
            setUnitCode("");
        }
    }

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>배출 계수 추가</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"적용년도"}
                    </div>
                    <Input id='applyYear' value={applyYear} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={e => setApplyYear(e.target.value)} label="적용년도" style={{width:"18rem"}} />
                    {error.applyYear && <div className={modalStyles.error_message}>{error.applyYear}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"적용구분"}</div>
                    <Select value={selectedApplyDvs} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => {setSelectedApplyDvs(value)}} style={{width:"18rem", height:"2rem",fontSize:"4rem"}}>
                    {applyDvs.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.applyDvs && <div className={modalStyles.error_message}>{error.applyDvs}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"계수구분코드"}</div>
                    <Select value={selectedCoefClassCode} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => handleInputUnitChange(value)} style={{width:"18rem", height:"2rem",fontSize:"4rem"}}>
                    {coefClassCode.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.coefClassCode && <div className={modalStyles.error_message}>{error.coefClassCode}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"온실가스코드"}</div>
                    <Select value={selectedGhgCode} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} placeholder="계수구분코드를 선택해주세요." onChange={(value) => {setSelectedGhgCode(value)}} style={{width:"18rem", height:"2rem",fontSize:"4rem"}}>
                    {ghgCode.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"단위"}</div>
                    <Input id='unitCode' allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} value={unitCode} disabled label="단위" style={{width:"18rem"}} />
                    {error.unitCode && <div className={modalStyles.error_message}>{error.unitCode}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"계수"}
                    </div>
                    <Input id='coef' value={coef} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCoef(e.target.value)} label="계수" style={{width:"18rem"}} />
                    {error.coef && <div className={modalStyles.error_message}>{error.coef}</div>}
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
        </Modal>
        </ConfigProvider>
    )
}

export function EfmEditModal({ isModalOpen, handleOk, handleCancel, rowData }) {
    const [applyYear, setApplyYear] = useState(rowData.applyYear);
    const [applyDvs, setApplyDvs] = useState([]);
    const [selectedApplyDvs, setSelectedApplyDvs] = useState(rowData.applyDvs);
    const [ghgCode, setGhgCode] = useState([]);
    const [selectedGhgCode, setSelectedGhgCode] = useState(rowData.ghgCode);
    const [coefClassCode, setCoefClassCode] = useState([]);
    const [selectedCoefClassCode, setSelectedCoefClassCode] = useState(rowData.coefClassCode);
    const [afterSelectedCoefClassCode, setAfterSelectedCoefClassCode] = useState([]);
    const [unitCode, setUnitCode] = useState(rowData.unitCode);
    const [selectedUnitCode, setSelectedUnitCode] = useState(rowData.unitCode);
    const [coef, setCoef] = useState(rowData.coef);
    const [error, setError] = useState({});

    const handleSelect = async() => {
        let swalOptions = {
            confirmButtonText: '확인'
        };

        const formData = {
            id: rowData.id,
            actvDataId: rowData.actvDataId, 
            applyYear,
            applyDvs: selectedApplyDvs,
            ghgCode: selectedGhgCode,
            coefClassCode:selectedCoefClassCode,
            unitCode,
            coef,
        };
        let newError = {};
        if(!formData.applyYear) newError.applyYear = '적용년도를 입력해주세요.';
        if(!formData.applyDvs) newError.applyDvs = '적용구분을 입력해주세요.';
        if(!formData.coefClassCode) newError.coefClassCode = '계수구분코드를 선택해주세요.';
        if(!formData.unitCode) newError.unitCode = '계수구분코드를 선택해주세요.';
        if(!formData.coef) newError.coef = '계수구분코드를 선택해주세요.';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk(formData);
    };

    useEffect(() => {
        const fetchData = async () => {
            const appDvsResponse = await axiosInstance.get(`/sys/unit?unitType=적용구분`);
            setApplyDvs(appDvsResponse.data);
            const matchAppDvs = appDvsResponse.data.find(e => e.name === selectedApplyDvs);
            setSelectedApplyDvs(matchAppDvs.code)
            const coefResponse = [
                {
                    "code": 2,
                    "name": "순발열량"
                },
                {
                    "code": 1,
                    "name": "배출계수"
                }
            ]
            setCoefClassCode(coefResponse);
            const ghgResponse = await axiosInstance.get(`/sys/coef-unit?inputUnitCode=${rowData.inputUnitCode}`)
            setAfterSelectedCoefClassCode(ghgResponse.data);
            const matchCcc = ghgResponse.data.find(e => e.name === selectedCoefClassCode);
            setGhgCode(matchCcc.gas);
            setSelectedCoefClassCode(matchCcc.code ?? null);
            const matchGhg = matchCcc.gas.find(e => e.name === selectedGhgCode);
            if(matchGhg){
                setSelectedGhgCode(matchGhg.code);
            }
            else{
                setSelectedGhgCode("");
            }
            
        };

        fetchData();
    }, [])

    const handleInputUnitChange = (value) => {
        setSelectedCoefClassCode(value);
        if (value === 2) {
            setSelectedGhgCode(null);
        }
        const matchedUnit = afterSelectedCoefClassCode[value === 2 ? 0 : value];
        if (matchedUnit) {
            setGhgCode(matchedUnit.gas);
            setUnitCode(matchedUnit.unit);
        }
        else{
            setGhgCode([]);
            setUnitCode("");
        }
    }

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            {/* 모달제목 */}
            <div className={modalStyles.title}>배출 계수 수정</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"적용년도"}
                    </div>
                    <Input id='applyYear' allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} value={applyYear} onChange={e => setApplyYear(e.target.value)} label="적용 년도" style={{width:"18rem"}} />
                    {error.applyYear && <div className={modalStyles.error_message}>{error.applyYear}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"적용구분"}</div>
                    <Select value={selectedApplyDvs} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => {setSelectedApplyDvs(value)}} style={{width:"18rem", height:"2rem", fontSize:"4rem"}}>
                    {applyDvs.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.applyDvs && <div className={modalStyles.error_message}>{error.applyDvs}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"계수구분코드"}</div>
                    <Select value={selectedCoefClassCode} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => handleInputUnitChange(value)} style={{width:"18rem", height:"2rem",fontSize:"4rem"}}>
                    {coefClassCode.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.coefClassCode && <div className={modalStyles.error_message}>{error.coefClassCode}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"온실가스코드"}</div>
                    <Select value={selectedGhgCode} placeholder="계수구분코드를 선택해주세요." allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => setSelectedGhgCode(value)} style={{width:"18rem", height:"2rem",fontSize:"4rem"}}>
                    {ghgCode.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"단위"}</div>
                    <Input id='unitCode' value={unitCode} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} disabled label="단위" style={{width:"18rem"}} />
                    {error.unitCode && <div className={modalStyles.error_message}>{error.unitCode}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"계수"}</div>
                    <Input id='coef' value={coef} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => setCoef(e.target.value)} label="계수" style={{width:"18rem"}} />
                    {error.coef && <div className={modalStyles.error_message}>{error.coef}</div>}
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>수정</button>
            </div>
        </Modal>
        </ConfigProvider>
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
            swalOptions.text = `${formData.equipName}이(가) 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message,
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
    const [error, setError] = useState({});
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

        let newError = {};
        if (!formData.userName) newError.userName = '이름을 입력해주세요.';
        if (!formData.loginId) newError.loginId = '로그인ID를 입력해주세요.';
        if (!formData.password) newError.password = '비밀번호를 입력해주세요.';
        if (!formData.deptCode) newError.deptCode = '부서를 선택해주세요.';
        if (!formData.role) newError.role = '접근권한을 선택해주세요.';

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});
        
        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk(formData);
    };

    return (
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>사용자 등록</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text} style={{marginTop:"0.5rem"}}><span className={modalStyles.star}>*</span>{"이름"}</div>
                    <Input id='userName' value={userName} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={e => setUserName(e.target.value)} label="이름" style={{width:"18rem"}} />
                    {error.userName && <div className={modalStyles.error_message}>{error.userName}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"로그인ID"}
                    </div>
                    <Input id='loginId' value={loginId} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={e => setLoginId(e.target.value)} label="로그인ID" style={{width:"18rem"}} />
                    {error.loginId && <div className={modalStyles.error_message}>{error.loginId}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"비밀번호"}</div>
                    <Input id='password' value={password} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={e => setPassword(e.target.value)} label="비밀번호" style={{width:"18rem"}} />
                    {error.password && <div className={modalStyles.error_message}>{error.password}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"부서명"}</div>
                    <Select value={selectedDept} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => setSelectedDept(value)} style={{width:"18rem", height:"2rem",fontSize:"4rem"}}>
                    {dept.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.deptCode && <div className={modalStyles.error_message}>{error.deptCode}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"접근권한"}</div>
                    <Select value={selectedRole} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => setSelectedRole(value)} style={{width:"18rem", height:"2rem", fontSize:"4rem"}}>
                    {access.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.role && <div className={modalStyles.error_message}>{error.role}</div>}
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
                <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleInsert}>등록</button>
            </div>
        </Modal>
        </ConfigProvider>
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
    const [error, setError] = useState({});
    
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
        let newError = {};
        if (!formData.menuName) newError.menuName = '메뉴이름을 입력해주세요.';
        if (!formData.rootId) newError.rootId = '상위폴더를 선택해주세요.';
        if (!formData.accessUser) newError.accessUser = '접근권한을 선택해주세요.';
        if (!formData.menuOrder) newError.menuOrder = '메뉴순서를 선택해주세요.';

        if (Object.keys(newError)?.length > 0) {
            setError(newError);
            return;
        }

        setError({});
        
        try {
            // POST 요청으로 서버에 데이터 전송
            const {data} = await axiosInstance.post('/sys/menu', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            handleOk(data);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.menuName}이(가) 성공적으로 등록되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message,
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
        <ConfigProvider
        theme={{token:{fontFamily:"SUITE-Regular"}}}>
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={350}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={modalStyles.title}>메뉴 등록</div>
            <div className={sysStyles.card_box}>
                <div className={sysStyles.text_field} style={{ marginTop: "0.5rem" }}>
                    <div className={sysStyles.text}>
                        <span className={modalStyles.star}>*</span>{"메뉴이름"}
                    </div>
                    <Input id='menuName' value={menuName} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={e => setMenuName(e.target.value)} label="메뉴이름" style={{width:"18rem"}} />
                    {error.menuName && <div className={modalStyles.error_message}>{error.menuName}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"상위폴더"}</div>
                    <Select value={selectedUpperDir} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(e) => {setSelectedUpperDir(e)}} style={{width:"18rem", height:"2rem", fontSize:"4rem"}}>
                    {upperDir.map(option => (
                        <Select.Option key={option.id} value={option.id}>
                            {option.name}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.rootId && <div className={modalStyles.error_message}>{error.rootId}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}>{"Url주소"}</div>
                    <Input id='address' value={url} placeholder='Url주소가 없으면 분류폴더로 인식합니다.' allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={e => setUrl(e.target.value)} label="Url주소" style={{width:"18rem"}} />
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"메뉴순서"}</div>
                    <Select placeholder={"메뉴순서"} value={orderMenu} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => setOrderMenu(value)} style={{width:"18rem", height:"2rem", fontSize:"4rem"}}>
                    {orderMenuList.map(option => (
                        <Select.Option key={option} value={option}>
                            {option}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.menuOrder && <div className={modalStyles.error_message}>{error.menuOrder}</div>}
                </div>
                <div className={sysStyles.text_field}>
                    <div className={sysStyles.text}><span className={modalStyles.star}>*</span>{"접근권한"}</div>
                    <Select placeholder={"접근권한"} value={selectedRole} allowClear={{ clearIcon: <CloseOutlined style={{color: "red"}} /> }} onChange={(value) => setSelectedRole(value)} style={{width:"18rem", height:"2rem", fontSize:"4rem"}}>
                    {access.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                    </Select>
                    {error.accessUser && <div className={modalStyles.error_message}>{error.accessUser}</div>}
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignContent:"center"}}>
            <button style={{width:"18rem"}} className={modalStyles.select_button} onClick={handleSelect}>등록</button>
            </div>
        </Modal>
        </ConfigProvider>
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
        setSelectedEmtnCands(row.row);
    };

    // 등록 버튼 클릭 시 호출될 함수
    const handleSelect = async () => {
        // selectedEmtnCands가 null이거나 비었으면 모달 닫고 함수 종료
        if (!selectedEmtnCands || selectedEmtnCands.length === 0) {
            handleCancel();
            return;
        }

        const requestBody = selectedEmtnCands.map((selectedEmtnCand) => ({
            equipId: selectedEmtnCand.equipId,
            actvDataId: selectedEmtnCand.actvDataId,
        }));

        // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
        handleOk({
            url: "/equip/emission",
            requestBody: requestBody,
            successMsg: `배출원이 성공적으로 등록되었습니다.`,
        });
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            width={1400}
            footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={pjtModalStyles.group_container}>
                <div className={pjtModalStyles.table_head}>
                    <div>
                        <div className={pjtModalStyles.title}>배출원 등록</div>
                    </div>
                    <div style={{ marginTop: '20px'}}>
                        <div className={pjtModalStyles.button_container}>
                            <CustomButton className={pjtModalStyles.select_button} onClick={handleSelect} disabled={selectedEmtnCands.length === 0}>
                                <CheckOutlinedIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                                <span className={pjtModalStyles.button_text}>선택</span>
                            </CustomButton> 
                            <CustomButton className={pjtModalStyles.select_button} onClick={handleCancel}>
                            <CloseIcon className={pjtModalStyles.icon} sx={{ fontSize: '2.5rem' }}/>
                            <span className={pjtModalStyles.button_text}>취소</span>
                            </CustomButton> 
                        </div>
                    </div>
                </div>
                <div className={pjtModalStyles.result_container}>
                    <Table data={emtnCands} variant='checkbox' onRowClick={handleEmtnClick} columns={equipEmissionColumns} modalPagination={true} />
                </div>
            </div>
        </Modal>
    )
}

export function SdAddModal({ isModalOpen, handleOk, handleCancel, rowData }) { 
    const project = useRecoilValue(selectedPjtState);
    const [yearSelectOptions, setYearSelectOptions] = useState([]);
    const [formData, setFormData] = useState({
        actvYear: new Date().getFullYear().toString(),
        actvMth: (new Date().getMonth() + 1).toString(),
        name: '',
        fileList: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const yearOptions = [];
        const currentYear = new Date().getFullYear();
        const ctrtFrYear = project.ctrtFrYear;
        const ctrtToYear = Math.min(project.ctrtToYear, currentYear);

        for (let year = ctrtToYear; year >= ctrtFrYear; year--) {
            yearOptions.push({ value: year.toString(), label: year.toString() });
        }

        setYearSelectOptions(yearOptions);
    }, []);

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFormData(prevData => {
            const existingFileNames = new Set(prevData.fileList.map(file => file.name));
            const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
            return {
                ...prevData,
                fileList: [...prevData.fileList, ...filteredNewFiles]
            };
        });
        // 동일한 파일을 다시 선택할 수 있도록 input의 값을 초기화
        event.target.value = null;
    };

    const handleFileRemove = (fileName) => {
        setFormData(prevData => ({
            ...prevData,
            fileList: prevData.fileList.filter(file => file.name !== fileName)
        }));
    };

    const uploadFiles = async () => {
        let swalOptions = {
            confirmButtonText: '확인'
        };

        try {
            const formDataForUpload = new FormData();
            formData.fileList.forEach(file => {
                formDataForUpload.append('files', file);
            });
            const response = await axiosInstance.post('/s3/upload', formDataForUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data; // 파일 업로드 후 S3에서 반환된 파일 정보 배열
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message,
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    };

    const onSaveClick = async () => {
        // 입력 값 검증
        let newErrors = {};
        if (!formData.actvYear || !formData.actvMth) newErrors.actvYearMth = '대상년월을 선택해 주세요.';
        if (!formData.name) newErrors.name = '필수 항목입니다.';
        if (formData.fileList.length === 0) newErrors.fileList = '파일을 선택해 주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        const uploadedFiles = await uploadFiles();

        const documentData = {
            emissionId: rowData.id,
            actvYear: parseInt(formData.actvYear, 10),
            actvMth: parseInt(formData.actvMth, 10),
            name: formData.name,
            files: uploadedFiles.map(file => ({
                name: file.name,
                url: file.url
            }))
        };

        handleOk({
            url: "/equip/document",
            requestBody: documentData,
            successMsg: `${documentData.name}이 성공적으로 등록되었습니다.`,
        });
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
                        <Select
                            id="actvYear"
                            value={formData.actvYear}
                            onChange={(value) => setFormData(prevData => ({ ...prevData, actvYear: value }))}
                        >
                            {yearSelectOptions.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>년</div>
                        <Select
                            id="actvMth"
                            value={formData.actvMth}
                            onChange={(value) => setFormData(prevData => ({ ...prevData, actvMth: value }))}
                        >
                            {selectMonth.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>월</div>
                    </div>
                    {errors.actvYearMth && <div className={modalStyles.error_message}>{errors.actvYearMth}</div>}
                </div>

                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        자료명
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <input
                        className={sdStyles.search}
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
                    />
                    {errors.name && <div className={modalStyles.error_message}>{errors.name}</div>}
                </div>

                <div className={sdStyles.upload_item}>
                    <div className={sdStyles.upload_header}>
                        <div className={sdStyles.input_title}>
                            첨부파일
                            <span className={sdStyles.requiredAsterisk}>*</span>
                        </div>
                        <div>
                            <input
                                type="file"
                                id="fileList"
                                name="fileList"
                                multiple
                                style={{ display: 'none' }} // 숨김 처리
                                onChange={handleFileChange} // 파일 선택 시 호출
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('fileList').click()}
                                className={ps12Styles.upload_button}
                            >
                                파일선택 <PaperClipOutlined />
                            </button>
                        </div>
                    </div>
                    <div className={sdStyles.file_list_container}>
                        <div className={sdStyles.file_list}>
                            {formData.fileList.length === 0 ? (
                                <></>
                            ) : (
                                formData.fileList.map((file, index) => (
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
                    {errors.fileList && <div className={modalStyles.error_message}>{errors.fileList}</div>}
                </div>
            </div>

            <button className={ps12Styles.select_button} onClick={onSaveClick}>저장</button>
        </Modal>
    )
}

export function SdShowDetailsModal({ isModalOpen, handleOk, handleCancel }) {
    const project = useRecoilValue(selectedPjtState);
    const [selectedSD, setSelectedSD] = useRecoilState(selectedSuppDocState);
    const [yearSelectOptions, setYearSelectOptions] = useState([]);
    const [formData, setFormData] = useState({
        actvYear: '',
        actvMth: '',
        name: '',
        fileList: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const yearOptions = [];
        const currentYear = new Date().getFullYear();
        const ctrtFrYear = project.ctrtFrYear;
        const ctrtToYear = Math.min(project.ctrtToYear, currentYear);

        for (let year = ctrtToYear; year >= ctrtFrYear; year--) {
            yearOptions.push({ value: year.toString(), label: year.toString() });
        }

        setYearSelectOptions(yearOptions);
    }, []);

    useEffect(() => {
        if (selectedSD) {
            setFormData({
                actvYear: String(selectedSD.actvYear || new Date().getFullYear()),
                actvMth: String(selectedSD.actvMth || (new Date().getMonth() + 1)),
                name: selectedSD.name || '',
                fileList: Array.isArray(selectedSD.files) ? selectedSD.files.map(file => ({
                    name: file.name,
                    status: 'done',
                    url: file.url
                })) : []
            });
        }
    }, [selectedSD]);

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).map(file => ({
            name: file.name,
            status: 'new',
            originFileObj: file
        }));

        setFormData(prevData => {
            const existingFileNames = new Set(prevData.fileList.map(file => file.name));
            const filteredNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
            return {
                ...prevData,
                fileList: [...prevData.fileList, ...filteredNewFiles]
            };
        });
        // 동일한 파일을 다시 선택할 수 있도록 input의 값을 초기화
        event.target.value = null;
    };

    const handleFileRemove = (fileName) => {
        setFormData(prevData => ({
            ...prevData,
            fileList: prevData.fileList.filter(file => file.name !== fileName)
        }));
    };

    const uploadFiles = async () => { // 새로 추가된 파일만 업로드
        let swalOptions = {
            confirmButtonText: '확인'
        };

        // formData.fileList가 null이거나 비어있는지 확인
        if (!formData.fileList || formData.fileList.length === 0) {
            swalOptions.title = '실패!';
            swalOptions.text = '첨부된 증빙파일이 없습니다.';
            swalOptions.icon = 'error';
            Swal.fire(swalOptions);
            return []; // 더 이상 진행하지 않도록 함수 종료
        }

        try {
            const formDataForUpload = new FormData();
            formData.fileList.forEach(file => {
                if (file.status === 'new') {
                    formDataForUpload.append('files', file.originFileObj); // 실제 File 객체를 추가
                }
            });
            if (formDataForUpload.getAll('files').length > 0) {
                const response = await axiosInstance.post('/s3/upload', formDataForUpload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                return response.data; // 파일 업로드 후 S3에서 반환된 파일 정보 배열
            }
            return []; // 파일이 없으면 빈 배열 반환
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message,
            swalOptions.icon = 'error';
            Swal.fire(swalOptions);
            return []; // 실패 시 빈 배열 반환
        }
    };

    const onSaveClick = async () => {
        // 입력 값 검증
        let newErrors = {};
        if (!formData.actvYear || !formData.actvMth) newErrors.actvYearMth = '대상년월을 선택해 주세요.';
        if (!formData.name) newErrors.name = '필수 항목입니다.';
        if (formData.fileList.length === 0) newErrors.fileList = '파일을 선택해 주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // 입력값 검증 통과하면 등록 수행
        const uploadedFiles = await uploadFiles() || []; // uploadFiles가 null 또는 undefined일 경우 빈 배열로 처리
        
        const existingFiles = (formData.fileList || []).filter(file => file.status === 'done').map(file => ({
            name: file.name,
            url: file.url
        }));
        const newFiles = uploadedFiles.map(file => ({ // 기존 파일들 + uploadFiles
            name: file.name,
            url: file.url
        }));
        // 최종 파일 목록
        const allFiles = [...existingFiles, ...newFiles];

        const documentData = {
            id: selectedSD.id,
            name: formData.name,
            files: allFiles
        };
        
        setFormData(prevData => ({
            ...prevData,
            fileList: allFiles.map(file => ({
                name: file.name,
                status: 'done',
                url: file.url
            }))
        }));

        handleOk({
            url: "/equip/document",
            requestBody: documentData,
            successMsg: `${documentData.name}(이)가 성공적으로 수정되었습니다.`,
        });

    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel} // 수정 중일 때 닫기 시도 시 경고 알림
            width={400}
            footer={null} //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
        >
            <div className={sdStyles.modal_header}>
                <div className={modalStyles.title}>증빙서류 상세보기</div>
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
                            disabled={true}
                        >
                            {yearSelectOptions.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>년</div>
                        <Select
                            id="actvMth"
                            value={formData.actvMth}
                            onChange={(value) => setFormData(prevData => ({ ...prevData, actvMth: value }))}
                            disabled={true}
                        >
                            {selectMonth.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <div>월</div>
                    </div>
                    {errors.actvYearMth && <div className={modalStyles.error_message}>{errors.actvYearMth}</div>}
                </div>

                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        등록자
                    </div>
                    <input className={sdStyles.search} id="creator"
                        value={selectedSD.creatorDeptCode+" / "+selectedSD.creatorName}
                        onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
                        disabled
                        style={{ color: '#B6B6B6' }}
                    />
                </div>

                <div className={sdStyles.input_item}>
                    <div className={sdStyles.input_title}>
                        자료명
                        <span className={sdStyles.requiredAsterisk}>*</span>
                    </div>
                    <input className={sdStyles.search} id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))}
                    />
                    {errors.name && <div className={modalStyles.error_message}>{errors.name}</div>}
                </div>

                <div className={sdStyles.upload_item}>
                    <div className={sdStyles.upload_header}>
                        <div className={sdStyles.input_title}>
                            첨부파일
                            <span className={sdStyles.requiredAsterisk}>*</span>
                        </div>
                        <div>
                            <input
                                type="file"
                                id="fileList"
                                name="fileList"
                                multiple
                                style={{ display: 'none' }} // 숨김 처리
                                onChange={handleFileChange} // 파일 선택 시 호출
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('fileList').click()}
                                className={ps12Styles.upload_button}
                            >
                                파일선택 <PaperClipOutlined />
                            </button>
                        </div>
                    </div>
                    <div className={sdStyles.file_list_container}>
                        <div className={sdStyles.file_list}>
                            {formData.fileList.length === 0 ? (
                                <></>
                            ) : (
                                formData.fileList.map((file, index) => { // file.name 편집모드 아닐 때는 클릭시 다운
                                    let displayName = file.name;
                                    if (file.status === 'done') {
                                        const underscoreIndex = file.name.indexOf('_');
                                        if (underscoreIndex !== -1) {
                                            displayName = file.name.substring(underscoreIndex + 1);
                                        }
                                    }
                                    
                                    return (
                                        <div key={index} className={sdStyles.file_item}>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                {displayName}
                                            </a>
                                            <button
                                                type="button"
                                                className={sdStyles.remove_button}
                                                onClick={() => handleFileRemove(file.name)}
                                            >
                                                <CloseOutlined />
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                    {errors.fileList && <div className={modalStyles.error_message}>{errors.fileList}</div>}
                </div>
            </div>

            <div className={sdStyles.button_group}>
                <button onClick={handleCancel} className={sdStyles.cancel_button}>취소</button>
                <button onClick={onSaveClick} className={sdStyles.save_button}>저장</button>
            </div>
        </Modal>
    )
}