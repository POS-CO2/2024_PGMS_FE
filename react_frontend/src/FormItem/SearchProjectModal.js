import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import axiosInstance from '../utils/AxiosInstance.js';
 
export default function ModalComponent({ isModalOpen, handleOk, handleCancel}) {
  const [searchedPjts, setSearchedPjts] = useState([]);   // 검색 결과
  const [selectedPjt, setSelectedPjt] = useState({});     // 선택된 프로젝트
  const [inputPjtCode, setInputPjtCode] = useState('');   // 입력한 프로젝트 코드
  const [inputPjtName, setInputPjtName] = useState('');   // 입력한 프로젝트 명

  useEffect(() => {
      const fetchProject = async () => {
          try {
              const response = await axiosInstance.get(`/pjt?pgmsYn=y`);

              const filteredPjts = response.data.map(project => ({
                id: project.id,
                프로젝트코드: project.pjtCode,
                프로젝트명: project.pjtName,
                프로젝트유형: project.pjtType,
                지역: project.regCode,
                프로젝트시작년: project.ctrtFrYear,
                프로젝트시작월: project.ctrtFrMth,
                프로젝트종료년: project.ctrtToYear,
                프로젝트종료월: project.ctrtToMth,
                본부: project.divCode,
                '연면적(m²)': project.bldArea,
                프로젝트진행상태: project.pjtProgStus
              }));

              setSearchedPjts(filteredPjts);
          } catch (error) {
              console.log(error);
          }
          
      };
      fetchProject(); // 컴포넌트 마운트 될 때 데이터불러옴
  }, [])

  // 엔터 키 입력 시 handleFormSubmit 호출
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // 폼의 기본 제출 동작 방지
      handleSearch();
    }
  };
  
  // 찾기 버튼 클릭 시 호출될 함수
  const handleSearch = async() => {
    try {
      const response = await axiosInstance.get(`/pjt?pgmsYn=y&pjtCode=${inputPjtCode}&pjtName=${inputPjtName}`);

      const filteredPjts = response.data.map(project => ({
        id: project.id,
        프로젝트코드: project.pjtCode,
        프로젝트명: project.pjtName,
        프로젝트유형: project.pjtType,
        지역: project.regCode,
        프로젝트시작년: project.ctrtFrYear,
        프로젝트시작월: project.ctrtFrMth,
        프로젝트종료년: project.ctrtToYear,
        프로젝트종료월: project.ctrtToMth,
        본부: project.divCode,
        '연면적(m²)': project.bldArea,
        프로젝트진행상태: project.pjtProgStus
      }));

      setSearchedPjts(filteredPjts);
    } catch (error) {
        console.log(error);
    }
  };

  // 프로젝트 row 클릭 시 호출될 함수
  const handlePjtClick = (pjt) => {
    setSelectedPjt(pjt ?? {});   // 클릭된 프로젝트의 코드로 상태를 설정
  };

  // 선택 버튼 클릭 시 호출될 함수
  const handleSelect = () => {
    handleOk(selectedPjt);
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
            value={inputPjtCode}
            className={pjtModalStyles.search_name} 
            onChange={(e) => setInputPjtCode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={pjtModalStyles.search_item}>
          <div className={pjtModalStyles.search_title}>프로젝트명</div>
          <div className={pjtModalStyles.search_container}>
            <input 
              value={inputPjtName}
              className={pjtModalStyles.search_name} 
              onChange={(e) => setInputPjtName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={pjtModalStyles.search_button} onClick={handleSearch}>찾기</button>
          </div>
        </div>
      </div>

      <div className={pjtModalStyles.result_container}>
        <Table data={searchedPjts} onRowClick={handlePjtClick} />
      </div>

      <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button>
    </Modal>
  )
}