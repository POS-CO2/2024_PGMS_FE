import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 활동량 관리 메뉴의 서치폼
export const emissionSourceForm = atom({
    key: 'emissionSourceForm',
    default: {},
    effects: [
        localStorageEffect('emissionSourceForm'), // 로컬 스토리지와 동기화
    ],
});

// 프로젝트별 조회 메뉴의 서치폼
export const projectPerfForm = atom({
    key: 'projectScopeForm',
    default: {},
    effects: [
        localStorageEffect('projectScopeForm'), // 로컬 스토리지와 동기화
    ],
});

// 총량실적 조회 메뉴의 서치폼
export const totalPerfScpForm = atom({
    key: 'totalPerfScpForm',
    default: {},
    effects: [
        localStorageEffect('totalPerfScpForm'), // 로컬 스토리지와 동기화
    ],
});

// 프로젝트 관리 메뉴의 서치폼
export const pjtMgrSearchForm = atom({
    key: 'pjtMgrSearchForm',
    default: {},
    effects: [
        localStorageEffect('pjtMgrSearchForm'), // 로컬 스토리지와 동기화
    ],
});

// 설비LIB 관리 메뉴의 서치폼
export const eqLibSearchForm = atom({
    key: 'eqLibSearchForm',
    default: {},
    effects: [
        localStorageEffect('eqLibSearchForm'), // 로컬 스토리지와 동기화
    ],
});

// 활동자료 관리 메뉴의 서치폼
export const actvSearchForm = atom({
    key: 'actvSearchForm',
    default: {},
    effects: [
        localStorageEffect('actvSearchForm'), // 로컬 스토리지와 동기화
    ],
});

// 코드 관리 메뉴의 서치폼
export const codeMgrSearchForm = atom({
    key: 'codeMgrSearchForm',
    default: {},
    effects: [
        localStorageEffect('codeMgrSearchForm'), // 로컬 스토리지와 동기화
    ],
});

// 사용자 관리 메뉴의 서치폼
export const userMgrSearchForm = atom({
    key: 'userMgrSearchForm',
    default: {},
    effects: [
        localStorageEffect('userMgrSearchForm'), // 로컬 스토리지와 동기화
    ],
});

// 접속로그 조회 메뉴의 서치폼
export const accessLogSearchForm = atom({
    key: 'accessLogSearchForm',
    default: {},
    effects: [
        localStorageEffect('accessLogSearchForm'), // 로컬 스토리지와 동기화
    ],
});
