'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// SSR-safe localStorage hook
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initial);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setStoredValue(initial);
    }
  }, [key, initial]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

// Filter and search hook
export function useFilter<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[]
): {
  filtered: T[];
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
} {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const filtered = items.filter((item) => {
    const matchesSearch = search === '' || fields.some((field) =>
      String(item[field]).toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus = status === '' || (item.status && String(item.status).toLowerCase() === status.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return { filtered, search, setSearch, status, setStatus };
}

// Generic modal control hook
export function useModal<T = unknown>(): {
  isOpen: boolean;
  open: (item?: T) => void;
  close: () => void;
  activeItem: T | null;
} {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const open = useCallback((item?: T) => {
    setActiveItem(item || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveItem(null);
  }, []);

  return { isOpen, open, close, activeItem };
}

// Demo toast notification hook
export function useDemoToast(): {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  show: (msg: string, type?: 'success' | 'error' | 'info') => void;
} {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    setType(toastType);
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setMessage('');
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { message, type, visible, show };
}