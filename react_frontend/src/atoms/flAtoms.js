import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

// 선택된 설비LIB
export const selectedEqLibState = atom({
    key: 'selectedEqLibState',
    default: {},
    effects: [
        localStorageEffect('selectedEqLibState'), // 로컬 스토리지와 동기화
    ],
});
