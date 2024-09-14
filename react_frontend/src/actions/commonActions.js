import { useRecoilCallback, useRecoilState } from 'recoil';
import { modalState } from '../atoms/pdsAtoms'
import axiosInstance from '../utils/AxiosInstance';
import Swal from 'sweetalert2';
import { ContinuousColorLegend } from '@mui/x-charts';

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

// 모달 밖의 버튼(등록, 수정, 삭제) 액션
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
      swalOptions.text = error.response.data.message;
      swalOptions.icon = 'error';
    }

    Swal.fire(swalOptions);
  });
};

// 모달 액션
export const useModalActions = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalState); // Recoil 상태

  // 모달 열기
  const showModal = (modalType) => {
    setIsModalOpen((prevState) => ({ ...prevState, [modalType]: true }));
  };

  // 모달 닫기
  const closeModal = (modalType) => () => {
    setIsModalOpen((prevState) => ({ ...prevState, [modalType]: false }));
  };

  return {
    showModal,
    closeModal,
    isModalOpen, // 모달의 상태를 반환하여 컴포넌트에서 사용할 수 있도록 함
  };
};

// 모달 내의 버튼(등록, 수정, 삭제) 액션
export const useHandleOkAction = () => {
  return useRecoilCallback(({ set }) => (modalType) => async ({data, setter, setterSelected, url, requestBody, successMsg, aa}) => {
    let swalOptions = {
      confirmButtonText: '확인'
    };

    // 모달 닫기
    set(modalState, prevState => ({ ...prevState, [modalType]: false }));

    if (modalType.includes('Add')) {
      try {
        //const response = await axiosInstance.post(url, requestBody);

        // 등록한 데이터를 목록에 추가
        // setter(prevRegs => [
        //   ...(Array.isArray(response.data) ? response.data : [response.data]),  //배열이면 ...response.data, 배열이 아니면 배열로 강제변환
        //   ...prevRegs
        // ]);

        swalOptions.title = '성공!',
        swalOptions.text = successMsg;
        swalOptions.icon = 'success';
      } catch (error) {
        console.log(error);

        swalOptions.title = '실패!',
        swalOptions.text = error.response.data.message;
        swalOptions.icon = 'error';
      }
      
    } else if (modalType.includes('Edit')) {
      try {
        //const response = await axiosInstance.patch(url, requestBody);

        // 수정한 데이터를 목록에 업데이트
        setter(originData => 
          originData.map(od => 
            od.id === data.id ? response.data : od
          )
        );

        swalOptions.title = '성공!',
        swalOptions.text = successMsg;
        swalOptions.icon = 'success';
      } catch (error) {
        console.log(error);

        swalOptions.title = '실패!',
        swalOptions.text = error.response.data.message;
        swalOptions.icon = 'error';
      }
    } else if (modalType === 'Delete') {
      // 삭제한 데이터를 목록에서 제거
      setter(originData => originData.filter(row => row.id !== data.id));
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