import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 프로젝트별 조회 메뉴의 선택된 버튼 탭(사용량/사용관리)
export const psqSelectedBtnState = atom({
    key: 'psqSelectedBtnState',
    default: 'chart',
    effects: [
        localStorageEffect('psqSelectedBtnState'), // 로컬 스토리지와 동기화
    ],
});

// 활동량 관리 메뉴의 선택된 버튼 탭(차트/표)
export const ps12SelectedBtnState = atom({
    key: 'ps12SelectedBtnState',
    default: 'actvQty',
    effects: [
        localStorageEffect('ps12SelectedBtnState'), // 로컬 스토리지와 동기화
    ],
});

// 총량실적 조회 메뉴의 선택된 버튼 탭(차트/표)
export const tepSelectedBtnState = atom({
    key: 'tepSelectedBtnState',
    default: 'chart',
    effects: [
        localStorageEffect('tepSelectedBtnState'), // 로컬 스토리지와 동기화
    ],
});