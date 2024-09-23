import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 선택된 프로젝트(프로젝트 관리)
export const selectedPjtMgrState = atom({
    key: 'selectedPjtMgrState',
    default: {},
    effects: [
        localStorageEffect('selectedPjtMgrState'), // 로컬 스토리지와 동기화
    ],
});

// 선택된 설비LIB(설비LIB 관리)
export const selectedEqLibState = atom({
    key: 'selectedEqLibState',
    default: {},
    effects: [
        localStorageEffect('selectedEqLibState'), // 로컬 스토리지와 동기화
    ],
});

// 선택된 활동자료(활동자료 관리)
export const selectedActvState = atom({
    key: 'selectedActvState',
    default: {},
    effects: [
        localStorageEffect('selectedActvState'), // 로컬 스토리지와 동기화
    ],
});

// 선택된 배출계수(활동자료 관리)
export const selectedEFState = atom({
    key: 'selectedEFState',
    default: {},
    effects: [
        localStorageEffect('selectedEFState'), // 로컬 스토리지와 동기화
    ],
});

// 확장된 행
export const expandedRowState = atom({
    key: 'expandedRowState',
    default: null,
    effects: [
        localStorageEffect('expandedRowState'), // 로컬 스토리지와 동기화
    ],
});