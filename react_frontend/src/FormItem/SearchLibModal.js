import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import * as pjtModalStyles from "../assets/css/pjtModal.css";
import Table from "../Table";
import axiosInstance from '../utils/AxiosInstance.js';

export default function ModalComponent({ isModalOpen, handleOk, handleCancel }) {
  const [searchedEqLibs, setSearchedEqLibs] = useState([]);         // 검색 결과
  const [selectedEqLib, setSelectedEqLib] = useState({});           // 선택된 프로젝트
  const [inputValue, setInputValue] = useState('');               // 입력한 설비라이브러리명

  useEffect(() => {
    const fetchEqLib = async () => {
      try {
          const response = await axiosInstance.get("/equip/lib");

          const filteredEqLibs = response.data.map(eqLib => ({
            id: eqLib.id,
            설비라이브러리명: eqLib.equipLibName,
            설비구분: eqLib.equipDvs,
            설비유형: eqLib.equipType,
            설비사양단위: eqLib.equipSpecUnit
          }));

          setSearchedEqLibs(filteredEqLibs);
      } catch (error) {
          console.log(error);
      }
    };
    fetchEqLib(); // 컴포넌트 마운트 될 때 데이터불러옴
  }, [])

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
        const response = await axiosInstance.get(`/equip/lib?equipLibName=${inputValue}`);

        // 필요한 필드만 추출하여 managers에 설정
        const filteredEqLibs = response.data.map(eqLib => ({
          id: eqLib.id,
          설비라이브러리명: eqLib.equipLibName,
          설비구분: eqLib.equipDvs,
          설비유형: eqLib.equipType,
          설비사양단위: eqLib.equipSpecUnit
        }));

        setSearchedEqLibs(filteredEqLibs);
    } catch (error) {
        console.log(error);
    }
  };

  // 설비 row 클릭 시 호출될 함수
  const handleEqClick = (eqLib) => {
    setSelectedEqLib(eqLib ?? {});
  };

  // 선택 버튼 클릭 시 호출될 함수
  const handleSelect = () => {
    handleOk(selectedEqLib);
  };
  
  return (
    <Modal 
      open={isModalOpen} 
      width={680}
      onCancel={handleCancel}
      footer={null}             //Ant Design의 기본 footer 제거(Cancel, OK 버튼)
    >
      <div className={pjtModalStyles.title}>설비LIB 찾기</div>
      <div className={pjtModalStyles.search_container}>
        <div className={pjtModalStyles.search_item}>
          <div className={pjtModalStyles.search_title}>설비LIB명</div>
          <div className={pjtModalStyles.search_container}>
            <input 
              value={inputValue}
              className={pjtModalStyles.search_name} 
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={pjtModalStyles.search_button} onClick={handleSearch}>찾기</button>
          </div>
        </div>
      </div>

      <div className={pjtModalStyles.result_container}>
          <Table data={searchedEqLibs} onRowClick={handleEqClick} />
      </div>

      <button className={pjtModalStyles.select_button} onClick={handleSelect}>선택</button>
    </Modal>
  )
}
