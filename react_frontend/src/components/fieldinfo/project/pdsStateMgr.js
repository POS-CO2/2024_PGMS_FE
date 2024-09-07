import React, { useState, useEffect } from "react";
import { useRecoilCallback, useSetRecoilState, useRecoilState } from 'recoil';
import { atom, selector } from 'recoil';
import axiosInstance from '../../../utils/AxiosInstance';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as pdsStyles from "../../../assets/css/pds.css";
import Pdc from './Pdc';

// ### 상태 ###
// 조회 결과(담당자 목록)
export const managerState = atom({
    key: 'managerState',
    default: [],
});

// 선택된 담당자
export const selectedManagerState = atom({
    key: 'selectedManagerState',
    default: {},
});

// 조회 결과(사원 목록)
export const empState = atom({
    key: 'empState',
    default: [],
});

// 선택된 사원의 loginId list
export const selectedEmpState = atom({
    key: 'selectedEmpState',
    default: [],
});

// 모달 상태
export const modalState = atom({
    key: 'modalState',
    default: {
      SdMgr: false,
      Delete: false,
    },
});

// ### 액션 ###
// 모달 액션
export const useModalActions = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalState); // Recoil 상태

  // 모달 열기
  const showModal = (modalType) => {
    setIsModalOpen((prevState) => ({ ...prevState, [modalType]: true }));
  };

  // 모달 닫기
  const handleCancel = (modalType) => () => {
    setIsModalOpen((prevState) => ({ ...prevState, [modalType]: false }));
  };

  // 삭제 모달 열기
  const onDeleteClick = () => {
    showModal('Delete');
  };

  return {
    handleCancel,
    onDeleteClick,
    isModalOpen, // 모달의 상태를 반환하여 컴포넌트에서 사용할 수 있도록 함
  };
};

// 조회 액션
export const useSearchAction = () => {
    return useRecoilCallback(() => async ({ url, setter }) => {
      try {
        const response = await axiosInstance.get(url);
        setter(response.data);
      } catch (error) {
        console.error(error);
      }
    });
};

export const useHandleSubmitAction = () => {
  return useRecoilCallback(() => async({data, setterReg, setterNotReg, setterSelectedNotReg, requestBody, url, successMsg}) => {
    let swalOptions = {
      confirmButtonText: '확인'
    };

    // selected 상태 초기화
    Array.isArray(data) ? setterSelectedNotReg(data) : setterSelectedNotReg(data);

    try {
      console.log("url", url);
      console.log("data", data);
      console.log("requestBody", requestBody);
      const response = await axiosInstance.post(url, requestBody);
      console.log("response", response);

      // 기존 데이터에 등록된 데이터를 병합
      setterReg(prevRegs => [
        ...response.data,
        ...prevRegs
      ]);

      // 등록 가능한 목록에서 등록한 데이터를 제거
      setterNotReg(prevNotRegs => {
        if (Array.isArray(data)) {
          const newRegIds = data.map(newReg => newReg.id);
          const cleanedNotRegs = prevNotRegs.filter(notReg => !newRegIds.includes(notReg.id));

          return [...cleanedNotRegs];
        } else {
          const newRegId = data.id;
          const cleanedNotRegs = prevNotRegs.filter(notReg => notReg.id !== newRegId);

          return [...prevNotRegs, cleanedNotRegs];
        }
      });

      swalOptions.title = '성공!',
      swalOptions.text = successMsg;
      swalOptions.icon = 'success';
    } catch (error) {
      console.log(error);

      swalOptions.title = '실패!',
      //swalOptions.text = response;
      swalOptions.icon = 'error';
    }
  });
};

// 모달 내의 버튼(등록, 수정, 삭제) 액션
export const useHandleOkAction = () => {
  return useRecoilCallback(({ set }) => (modalType) => async ({data, setter, setterSelected}) => {

    // 모달 닫기
    set(modalState, prevState => ({ ...prevState, [modalType]: false }));

    if (modalType === 'Delete') {
      // 삭제할 데이터를 목록에서 제거
      setter(originData => originData.filter(row => row.id !== data.id));
      setterSelected({});
    }
  });
};

// 키 입력 이벤트 핸들러
export const useHandleKeyDownAction = () => {
    return useRecoilCallback(() => (e, handleSearch) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
};

const CustomButton = styled(Button)(({ selected }) => ({
    color: selected ? '#000' : '#B6B6B6',
    border: selected ? '0.1rem solid #0A7800' : 'none',
    backgroundColor: selected ? '#fff' : 'transparent',
    fontWeight: selected ? 'bolder' : 'normal',
    borderRadius: '1.3rem',
    fontSize: '1rem',
    paddingTop: '0.1rem',
    paddingBottom: '0.1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',

    '&:hover': {
        color: '#000',
        backgroundColor: '#fff',
        border: '0.1rem solid #0A7800',
        borderRadius: '1.3rem',
        fontWeight: 'bolder',
    },
}));


export const PdsStateMgr = ({pjtId}) => {
    const [selectedButton, setSelectedButton] = useState('담당자 지정');

    const setManagers = useSetRecoilState(managerState);
    //const setEquips = useSetRecoilState(empState);

    // 설비 지정 탭을 위한 상태관리
    const [equips, setEquips] = useState([]);                                   
    const [selectedEq, setSelectedEq] = useState({});                           
    const [notEqs, setNotEqs] = useState([]);                                   
    const [selectedNotEq, setSelectedNotEq] = useState({});
    const [eqTypeList, setEqTypeList] = useState([]);            // 설비유형 드롭다운 리스트
    const [eqDvsList, setEqDvsList] = useState([]);              // 설비구분 드롭다운 리스트
    
    useEffect(() => {
      handleOptionBtnClick(`/pjt/manager?pjtId=${pjtId}`, setManagers);
    }, [pjtId]);


    // // 설비유형 및 설비구분 데이터를 불러오는 함수
    // const fetchDropdownOptions = async () => {
    //     try {
    //         const typeResponse = await axiosInstance.get(`/sys/unit?unitType=설비유형`);
    //         const dvsResponse = await axiosInstance.get(`/sys/unit?unitType=설비구분`);
            
    //         const optionsType = typeResponse.data.map(item => ({
    //             value: item.code,
    //             label: item.name,
    //         }));

    //         const optionsDvs = dvsResponse.data.map(item => ({
    //             value: item.code,
    //             label: item.name,
    //         }));

    //         setEqTypeList(optionsType);  // 설비유형 리스트 설정
    //         setEqDvsList(optionsDvs);    // 설비구분 리스트 설정
    //     } catch (error) {
    //         console.error("Error fetching dropdown data: ", error);
    //     }
    // };

    // useEffect(async() => {
    //     fetchDropdownOptions();  // 컴포넌트가 마운트될 때 드롭다운 리스트 데이터를 가져옴

    //     const totalEqLib = await axiosInstance.get(`/equip/lib`);
    //     setNotEqs(totalEqLib.data);
    // }, []);

    // useEffect(() => {
    //     if(Object.keys(selectedNotEq).length === 0) {
    //         setInputEqName('');
    //     } else {
    //         setInputEqName(selectedNotEq.equipLibName);
    //     }
    // }, [selectedNotEq]);

    const handleOptionBtnClick = async (url, setter) => {
        setSelectedButton(selectedButton); // 클릭된 버튼의 상태를 변경
        
        // 조회 api 호출
        const response = await axiosInstance.get(url);
        setter(response.data);
    };

    // // 설비 row 클릭 시 호출될 함수
    // const handleEqClick = (eq) => {
    //     setSelectedEq(eq ?? {});
    // };

    // // 지정되지 않은 설비 row 클릭 시 호출될 함수
    // const handleNotEqClick = (eq) => {
    //     setSelectedNotEq(eq ?? {});
    // };

    return (
        <>
            <div className={pdsStyles.button_container}>
                <CustomButton
                    variant="outlined"
                    selected={selectedButton === '담당자 지정'}
                    onClick={() => handleOptionBtnClick(`/pjt/manager?pjtId=${pjtId}`, setManagers)}
                >
                    담당자 지정
                </CustomButton>
                <CustomButton
                    variant="outlined"
                    selected={selectedButton === '설비 지정'}
                    //onClick={() => handleOptionBtnClick(`/equip?pjtId=${pjtId}`, setEquips)}
                >
                    설비 지정
                </CustomButton>
                <CustomButton
                    variant="outlined"
                    selected={selectedButton === '배출원 관리'}
                    //onClick={() => handleOptionBtnClick(`/equip/emission?projectId=${pjtId}`, setEmissions)}
                >
                    배출원 관리
                </CustomButton>
            </div>

            <div className={pdsStyles.contents_container}>
                {selectedButton === '담당자 지정' && (
                    <Pdc pjtId={pjtId} selectedButton={selectedButton}/>
                )}
            </div>
        </>
    )
};

export default PdsStateMgr;