import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 모달 상태
export const modalState = atom({
  key: 'modalState',
  default: {
    EsmAdd: false, // 배출원 등록
    SdAdd: false, // 증빙자료 등록
    SdShowDetails: false, // 증빙자료 상세보기
    DeleteA: false,
    DeleteB: false,
  },
  effects: [
    localStorageEffect('modalState'), // 로컬 스토리지와 동기화
],
});

// 선택된 프로젝트
export const selectedPjtState = atom({
  key: 'selectedPjtState',
  default: {},
  effects: [
    localStorageEffect('selectedPjtState'), // 로컬 스토리지와 동기화
],
});

// 선택된 버튼
export const selectedButtonState = atom({
  key: 'selectedButtonState',
  default: '담당자 관리',
  effects: [
    localStorageEffect('selectedButtonState'), // 로컬 스토리지와 동기화
],
});

// 담당자 목록
export const managerState = atom({
    key: 'managerState',
    default: [],
    effects: [
      localStorageEffect('managerState'), // 로컬 스토리지와 동기화
  ],
});

// 선택된 담당자
export const selectedManagerState = atom({
    key: 'selectedManagerState',
    default: {},
    effects: [
      localStorageEffect('selectedManagerState'), // 로컬 스토리지와 동기화
  ],
});

// (프로젝트에 지정되지 않은)사원 목록
export const empState = atom({
    key: 'empState',
    default: [],
    effects: [
      localStorageEffect('empState'), // 로컬 스토리지와 동기화
  ],
});

// 선택된 사원들
export const selectedEmpState = atom({
    key: 'selectedEmpState',
    default: [],
    effects: [
      localStorageEffect('selectedEmpState'), // 로컬 스토리지와 동기화
  ],
});

// 설비 목록
export const eqState = atom({
  key: 'eqState',
  default: [],
  effects: [
    localStorageEffect('eqState'), // 로컬 스토리지와 동기화
],
});

// 선택된 설비
export const selectedEqState = atom({
  key: 'selectedEqState',
  default: {},
  effects: [
    localStorageEffect('selectedEqState'), // 로컬 스토리지와 동기화
],
});

// 설비LIB 목록
export const eqLibState = atom({
  key: 'eqLibState',
  default: [],
  effects: [
    localStorageEffect('eqLibState'), // 로컬 스토리지와 동기화
],
});

// 선택된 설비LIB
export const selectedEqLibState = atom({
  key: 'selectedEqLibState',
  default: {},
  effects: [
    localStorageEffect('selectedEqLibState'), // 로컬 스토리지와 동기화
],
});

// 배출원 목록
export const emSourceState = atom({
  key: 'emSourceState',
  default: [],
  effects: [
    localStorageEffect('emSourceState'), // 로컬 스토리지와 동기화
],
});

// 선택된 배출원
export const selectedESState = atom({
  key: 'selectedESState',
  default: {},
  effects: [
    localStorageEffect('selectedESState'), // 로컬 스토리지와 동기화
],
});

// 증빙자료 목록
export const suppDocState = atom({
  key: 'suppDocState',
  default: [],
  effects: [
    localStorageEffect('suppDocState'), // 로컬 스토리지와 동기화
],
});

// (연도 필터링된) 증빙자료 목록
export const filteredSDState = atom({
  key: 'filteredSDState',
  default: [],
  effects: [
    localStorageEffect('filteredSDState'), // 로컬 스토리지와 동기화
],
});

// 선택된 증빙자료
export const selectedSuppDocState = atom({
  key: 'selectedSuppDocState',
  default: {},
  effects: [
    localStorageEffect('selectedSuppDocState'), // 로컬 스토리지와 동기화
],
});

// 매출액 목록
export const revState = atom({
  key: 'revState',
  default: [],
  effects: [
    localStorageEffect('revState'), // 로컬 스토리지와 동기화
],
});

// 선택된 매출액
export const selectedRevState = atom({
  key: 'selectedRevState',
  default: {},
  effects: [
    localStorageEffect('selectedRevState'), // 로컬 스토리지와 동기화
],
});