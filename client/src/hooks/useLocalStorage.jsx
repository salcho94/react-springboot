import { useState } from 'react';

function useLocalStorage(key, initialValue) {
    // 로컬 스토리지에서 데이터를 가져오고, 없으면 초기값을 사용
    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? JSON.parse(storedValue) : initialValue;

    const [value, setValue] = useState(initial);

    // value가 변경될 때마다 로컬 스토리지에 저장
    const setStoredValue = (newValue) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setStoredValue];
}

export default useLocalStorage;
