import React, { useState, useEffect } from "react";
import { useSetRecoilState } from 'recoil';
import {
    managerState, eqState, eqLibState
} from '../../../../atoms/pdsAtoms';
import axiosInstance from '../../../../utils/AxiosInstance';
import Pdc from './Pdc';
import Fd from './Fd';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as pdsStyles from "../../../../assets/css/pds.css";

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