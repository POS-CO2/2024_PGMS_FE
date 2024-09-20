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