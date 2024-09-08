import { atom } from 'recoil';

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