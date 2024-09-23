import { atom } from 'recoil';

// 프로젝트별 조회 메뉴의 선택된 버튼 탭(사용량/사용관리)
export const psqSelectedBtnState = atom({
    key: 'psqSelectedBtnState',
    default: 'chart',
});

// 활동량 관리 메뉴의 선택된 버튼 탭(차트/표)
export const ps12SelectedBtnState = atom({
    key: 'ps12SelectedBtnState',
    default: 'actvQty',
});

// 총량실적 조회 메뉴의 선택된 버튼 탭(차트/표)
export const tepSelectedBtnState = atom({
    key: 'tepSelectedBtnState',
    default: 'chart',
});