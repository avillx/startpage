const DB_NAME = 'startpage_blobs';
const STORE_NAME = 'blobs';
const KEY = 'background';

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('IndexedDB not available'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      try { req.result.createObjectStore(STORE_NAME); } catch { /* already exists */ }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const withFallback = async (fn) => {
  try {
    return await fn();
  } catch (e) {
    console.warn('blobStorage error, falling back to empty result:', e);
    return null;
  }
};

export const saveBackground = (blob) => withFallback(async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
});

export const loadBackground = () => withFallback(async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(KEY);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
});

export const removeBackground = () => withFallback(async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
});
