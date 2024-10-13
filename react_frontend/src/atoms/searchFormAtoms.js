import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 선택한 프로젝트(SearchAtModal)
export const selectedPjtState = atom({
    key: 'selectedPjtState',
    default: {},
    effects: [
        localStorageEffect('selectedPjtState'), // 로컬 스토리지와 동기화
    ],
});

// 선택한 프로젝트(현장담당자 페이지)
export const selectedPjtFPState = atom({
    key: 'selectedPjtFPState',
    default: {},
    effects: [
        localStorageEffect('selectedPjtFPState'), // 로컬 스토리지와 동기화
    ],
});

// 선택한 분석기간(분석 페이지)
export const selectedPeriodState = atom({
    key: 'selectedPeriodState',
    default: [],
});

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
    key: 'projectPerfForm',
    default: {},
    effects: [
        localStorageEffect('projectPerfForm'), // 로컬 스토리지와 동기화
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


/* 현장 페이지 */

// 배출원 관리(프로젝트 상세설정) 메뉴의 서치폼
export const emissionSrcSearchForm = atom({
    key: 'emissionSrcSearchForm',
    default: {},
    effects: [
        localStorageEffect('emissionSrcSearchForm'), // 로컬 스토리지와 동기화
    ],
});

/* 분석 페이지 */
// 매출액별 분석 메뉴의 서치폼
export const revAnaSearchForm = atom({
    key: 'revAnaSearchForm',
    default: {},
});

// 설비별 분석 메뉴의 서치폼
export const eqLibAnaSearchForm = atom({
    key: 'eqLibAnaSearchForm',
    default: {},
});

// 기후별 분석 메뉴의 서치폼
export const clAnaSearchForm = atom({
    key: 'clAnaSearchForm',
    default: {},
});
