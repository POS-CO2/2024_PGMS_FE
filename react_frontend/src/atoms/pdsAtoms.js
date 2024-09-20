import { atom } from 'recoil';

// ### 상태 ###

// 모달 상태
export const modalState = atom({
  key: 'modalState',
  default: {
    EsmAdd: false, // 배출원 등록
    SdAdd: false, // 증빙자료 등록
    SdShowDetails: false, // 증빙자료 상세보기
    Delete: false,
  },
});

// 담당자 목록
export const pjtState = atom({
  key: 'pjtState',
  default: {},
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

// 배출원 목록
export const emSourceState = atom({
  key: 'emSourceState',
  default: [],
});

// 선택된 배출원
export const selectedESState = atom({
  key: 'selectedESState',
  default: {},
});

// 증빙자료 목록
export const suppDocState = atom({
  key: 'suppDocState',
  default: [],
});

// (연도 필터링된) 증빙자료 목록
export const filteredSDState = atom({
  key: 'filteredSDState',
  default: [],
});

// 선택된 증빙자료
export const selectedSuppDocState = atom({
  key: 'selectedSuppDocState',
  default: {},
});

// 매출액 목록
export const revState = atom({
  key: 'revState',
  default: [],
});

// 선택된 매출액
export const selectedRevState = atom({
  key: 'selectedRevState',
  default: {},
});