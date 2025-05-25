import { useState } from 'react';

const UseLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.error(`localstorage reading error: ${error}`);
            return initialValue;
        }
    })

    const setValue = (value) => {
        try {
            const item = value instanceof Function ? value(storedValue) : value;
            setStoredValue(item);
            localStorage.setItem(key, JSON.stringify(item));
        }
        catch (error) {
            console.error(`localstorage writing error: ${error}`);
        }
    }

    return [storedValue, setValue];
}

export default UseLocalStorage;