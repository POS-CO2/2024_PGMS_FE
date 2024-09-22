import { atom } from 'recoil';

// 활동량 관리 메뉴의 서치폼
export const emissionSourceForm = atom({
    key: 'emissionSourceForm',
    default: {},
});

// 프로젝트별 조회 메뉴의 서치폼
export const projectPerfForm = atom({
    key: 'projectScopeForm',
    default: {},
});

// 총량실적 조회 메뉴의 서치폼
export const totalPerfScpForm = atom({
    key: 'totalPerfScpForm',
    default: {},
});

// 프로젝트 관리 메뉴의 서치폼
export const pjtMgrSearchForm = atom({
    key: 'pjtMgrSearchForm',
    default: {},
});

// 설비LIB 관리 메뉴의 서치폼
export const eqLibSearchForm = atom({
    key: 'eqLibSearchForm',
    default: {},
});

// 활동자료 관리 메뉴의 서치폼
export const actvSearchForm = atom({
    key: 'actvSearchForm',
    default: {},
});

// 코드 관리 메뉴의 서치폼
export const codeMgrSearchForm = atom({
    key: 'codeMgrSearchForm',
    default: {},
});

// 사용자 관리 메뉴의 서치폼
export const userMgrSearchForm = atom({
    key: 'userMgrSearchForm',
    default: {},
});

// 접속로그 조회 메뉴의 서치폼
export const accessLogSearchForm = atom({
    key: 'accessLogSearchForm',
    default: {},
});
