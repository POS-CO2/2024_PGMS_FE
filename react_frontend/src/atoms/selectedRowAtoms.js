import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 선택된 프로젝트(프로젝트 관리)
export const selectedPjtMgrState = atom({
    key: 'selectedPjtMgrState',
    default: {},
});

// 선택된 설비LIB(설비LIB 관리)
export const selectedEqLibState = atom({
    key: 'selectedEqLibState',
    default: {},
});

// 선택된 활동자료(활동자료 관리)
export const selectedActvState = atom({
    key: 'selectedActvState',
    default: {},
});

// 선택된 배출계수(활동자료 관리)
export const selectedEFState = atom({
    key: 'selectedEFState',
    default: {},
});

// 선택된 코드그룹(코드 관리)
export const selectedCGState = atom({
    key: 'selectedCGState',
    default: {},
});

// 선택된 코드리스트(코드 관리)
export const selectedCLState = atom({
    key: 'selectedCLState',
    default: {},
});

// 선택된 사용자(사용자 관리)
export const selectedUserState = atom({
    key: 'selectedUserState',
    default: {},
});

// 확장된 행
export const expandedRowState = atom({
    key: 'expandedRowState',
    default: null,
});