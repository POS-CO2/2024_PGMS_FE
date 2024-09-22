// 로컬 스토리지에 상태 저장 및 불러오는 효과 정의
export const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  // 컴포넌트가 마운트되면 로컬 스토리지에서 값을 불러옴
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  // 상태가 변경될 때 로컬 스토리지에 저장
  onSet((newValue, _, isReset) => {
    if (isReset) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};