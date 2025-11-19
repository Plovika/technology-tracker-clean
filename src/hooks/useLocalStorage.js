import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // 🔥 Получаем значение из localStorage или используем initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`❌ Ошибка чтения из localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  // 🔥 Обновляем localStorage при изменении значения
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`💾 Сохранено в localStorage (${key}):`, valueToStore);
    } catch (error) {
      console.error(`❌ Ошибка записи в localStorage ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}