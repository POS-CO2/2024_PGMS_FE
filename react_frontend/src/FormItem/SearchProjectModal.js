import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import axiosInstance from '../utils/AxiosInstance.js';
 
export default function ModalComponent({ isModalOpen, handleOk, handleCancel}) {
  const [formData, setFormData] = useState({});           // 검색 데이터
  const [selectedPjt, setSelectedPjt] = useState([]);     // 선택된 프로젝트
  const [allProjects, setAllProjects] = useState([]);     // 전체 프로젝트
  const [project, setProject] = useState([]);

  const pjtColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'pjtCode', label: '프로젝트 코드', hidden: false },
    { key: 'pjtName', label: '프로젝트 이름', hidden: false },
    { key: 'pjtType', label: '프로젝트 유형', hidden: false },
    { key: 'regCode', label: '지역 코드', hidden: false },
    { key: 'ctrtFrYear', label: '계약 시작 년', hidden: false },
    { key: 'ctrtFrMth', label: '계약 시작 월', hidden: false },
    { key: 'ctrtToYear', label: '계약 종료 년', hidden: false },
    { key: 'ctrtToMnt', label: '계약 종료 월', hidden: false },
    { key: 'divCode', label: '본부 코드', hidden: false },
    { key: 'bldArea', label: '연면적(m²)', hidden: false },
    { key: 'pjtProgStus', label: '프로젝트진행 상태', hidden: false },
    { key: 'pgmsYn', label: 'Y/N', hidden: false },
    { key: 'userLoginId', label: '로그인 아이디', hidden: true },
    { key: 'userName', label: '유저 명', hidden: true },
    { key: 'startDate', label: '시작 일', hidden: true },
    { key: 'endDate', label: '종료 일', hidden: true },
]

  useEffect(() => {
      const fetchProject = async () => {
          try {
              const {data} = await axiosInstance.get(`/pjt?pgmsYn=y`);
              console.log(data);
              // const filteredPjts = response.data.map(project => ({
              //   id: project.id,
              //   프로젝트코드: project.pjtCode,
              //   프로젝트명: project.pjtName,
              //   프로젝트유형: project.pjtType,
              //   지역: project.regCode,
              //   프로젝트시작년: project.ctrtFrYear,
              //   프로젝트시작월: project.ctrtFrMth,
              //   프로젝트종료년: project.ctrtToYear,
              //   프로젝트종료월: project.ctrtToMth,
              //   본부: project.divCode,
              //   '연면적(m²)': project.bldArea,
              //   프로젝트진행상태: project.pjtProgStus
              // }));

              setAllProjects(data);
              setProject(data);
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
      console.log("pjt", pjt);
      const matchesCode = formData.projectCode ? pjt.pjtCode?.includes(formData.projectCode) : true;
      const matchesName = formData.projectName ? pjt.pjtName?.includes(formData.projectName) : true;
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
    setSelectedPjt(pjt ?? {});   // 클릭된 프로젝트의 코드로 상태를 설정
  };

  // 선택 버튼 클릭 시 호출될 함수
  const handleSelect = () => {
    handleOk(selectedPjt);                        // 선택된 프로젝트 데이터를 handleOk로 전달
  };

  return (
    <Modal 
      open={isModalOpen} 
      width={1300}
      onCancel={handleCancel} 
      footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    >
      <div className={pjtModalStyles.title}>프로젝트 찾기</div>
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
        <Table columns={pjtColumns} data={project} onRowClick={handlePjtClick} />
      </div>

      <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button>
    </Modal>
  )
}