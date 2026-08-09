
export function setLocalStorageJson<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorageJson<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) as T : null;
}
