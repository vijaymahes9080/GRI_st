export async function setItemAsync(key: string, value: string) {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
}
export function getItem(key: string) {
  if (typeof window !== 'undefined') return window.localStorage.getItem(key);
  return null;
}
export async function getItemAsync(key: string) {
  if (typeof window !== 'undefined') return window.localStorage.getItem(key);
  return null;
}
export async function deleteItemAsync(key: string) {
  if (typeof window !== 'undefined') window.localStorage.removeItem(key);
}
