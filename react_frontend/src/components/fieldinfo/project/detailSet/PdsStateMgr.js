import React, { useState, useEffect } from "react";
import { useRecoilCallback, useSetRecoilState, useRecoilState } from 'recoil';
import { atom } from 'recoil';
import axiosInstance from '../../../../utils/AxiosInstance';
import Swal from 'sweetalert2'
import Pdc from './Pdc';
import Fd from './Fd';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as pdsStyles from "../../../../assets/css/pds.css";

// ### 상태 ###

// 모달 상태
export const modalState = atom({
  key: 'modalState',
  default: {
    Delete: false,
  },
});

// 담당자 목록
export const managerState = atom({
    key: 'managerState',
    default: [],
});

// 선택된 담당자
export const selectedManagerState = atom({
    key: 'selectedManagerState',
    default: {},
});

// (프로젝트에 지정되지 않은)사원 목록
export const empState = atom({
    key: 'empState',
    default: [],
});

// 선택된 사원들
export const selectedEmpState = atom({
    key: 'selectedEmpState',
    default: [],
});

// 설비 목록
export const eqState = atom({
  key: 'eqState',
  default: [],
});

// 선택된 설비
export const selectedEqState = atom({
  key: 'selectedEqState',
  default: {},
});

// 설비LIB 목록
export const eqLibState = atom({
  key: 'eqLibState',
  default: [],
});

// 선택된 설비LIB
export const selectedEqLibState = atom({
  key: 'selectedEqLibState',
  default: {},
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
    return useRecoilCallback(() => async ({ url, setter, params }) => {
      try {
        const response = await axiosInstance.get(url, {params});
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
      const response = await axiosInstance.post(url, requestBody);

      // 기존 데이터에 등록된 데이터를 병합
      setterReg(prevRegs => [
        ...(Array.isArray(response.data) ? response.data : [response.data]),  //배열이면 ...response.data, 배열이 아니면 배열로 강제변환
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

    Swal.fire(swalOptions);
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
    const setEquips = useSetRecoilState(eqState);
    const setEqLibs = useSetRecoilState(eqLibState);

    // 프로젝트를 다시 선택하거나 다른 버튼을 클릭했을때 호출
    useEffect(() => {
      const triggerButtonClick = async () => {
        if (selectedButton === '담당자 지정') {
          await handleOptionBtnClick([{
            button: selectedButton,
            url: `/pjt/manager?pjtId=${pjtId}`,
            setter: setManagers
          }]);
        } else if (selectedButton === '설비 지정') {
          await handleOptionBtnClick([
            {
              button: selectedButton,
              url: `/equip?pjtId=${pjtId}`,
              setter: setEquips
            },
            {
              url: "/equip/lib",
              setter: setEqLibs
            },
          ]);
        }
        
      };
    
      if (pjtId) {
        triggerButtonClick();
      }
    }, [pjtId, selectedButton]);

    const handleOptionBtnClick = async (actions) => {
      for (const action of actions) {   // api 호출을 하나 이상 할 수 있음
        const { button, url, setter } = action;
    
        if (button) {
          setSelectedButton(button); // 버튼이 있을 때만 상태 변경
        }
    
        try {
          // 각 API 호출 후 setter로 데이터 설정
          const response = await axiosInstance.get(url);
          setter(response.data);
        } catch (error) {
          console.error(`Error occurred while fetching data from ${url}:`, error);
        }
      }
    };

    return (
        <>
            <div className={pdsStyles.button_container}>
                <CustomButton
                    variant="outlined"
                    selected={selectedButton === '담당자 지정'}
                    onClick={() => setSelectedButton('담당자 지정')}
                >
                    담당자 지정
                </CustomButton>
                <CustomButton
                    variant="outlined"
                    selected={selectedButton === '설비 지정'}
                    onClick={() => setSelectedButton('설비 지정')}
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
                {selectedButton === '설비 지정' && (
                    <Fd pjtId={pjtId} selectedButton={selectedButton}/>
                )}
            </div>
        </>
    )
};

export default PdsStateMgr;