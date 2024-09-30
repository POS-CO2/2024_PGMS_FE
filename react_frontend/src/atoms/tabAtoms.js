import { atom } from 'recoil';

// 열려있는 탭 목록
export const openTabsState = atom({
  key: 'openTabsState',
  default: [],
});

// 현재 탭
export const activeTabState = atom({
    key: 'activeTabState',
    default: '',
});

// 즐겨찾기 목록
export const favState = atom({
    key: 'favState',
    default: [],
});

// 포맷된 메뉴 목록
export const itemsState = atom({
  key: 'itemsState',
  default: [],
});

// 선택된 메뉴 항목 키
export const selectedKeyState = atom({
  key: 'selectedKeyState',
  default: null, // 기본값: 선택된 항목 없음
});

// 열려 있는 대분류 키 상태
export const openKeysState = atom({
  key: 'openKeysState',
  default: [],
});