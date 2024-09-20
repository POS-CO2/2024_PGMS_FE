import { atom } from 'recoil';

export const openTabsState = atom({
  key: 'openTabsState',
  default: [],
});

export const activeTabState = atom({
    key: 'activeTabState',
    default: '',  // 현재 활성화된 탭의 경로
  });