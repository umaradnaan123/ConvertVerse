// Promise-based IndexedDB wrapper for ConvertVerse binary file persistence.
// Since blob URLs are strictly session-bound and vanish on page reload,
// we cache the actual blobs here so history redownloads work indefinitely.

export function openHistoryDb() {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        throw new Error('IndexedDB is not supported or access is denied in this context.');
      }
      const request = window.indexedDB.open('ConvertVerseDB', 1);
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}


/**
 * Saves a Blob in IndexedDB keyed by history ID.
 * @param {string} id Unique history identifier
 * @param {Blob} blob Binary file data
 * @returns {Promise<boolean>} Success state
 */
export async function saveHistoryFile(id, blob) {
  if (!id || !(blob instanceof Blob)) {
    console.warn("Invalid parameters for saveHistoryFile", { id, blob });
    return false;
  }
  try {
    const db = await openHistoryDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.put({ id, blob });
      
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to save file to IndexedDB', err);
    return false;
  }
}

/**
 * Retrieves a Blob from IndexedDB by history ID.
 * @param {string} id Unique history identifier
 * @returns {Promise<Blob|null>} Binary file data or null
 */
export async function getHistoryFile(id) {
  if (!id) return null;
  try {
    const db = await openHistoryDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result ? request.result.blob : null);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to get file from IndexedDB', err);
    return null;
  }
}

/**
 * Deletes a cached Blob from IndexedDB by history ID.
 * @param {string} id Unique history identifier
 * @returns {Promise<boolean>} Success state
 */
export async function deleteHistoryFile(id) {
  if (!id) return false;
  try {
    const db = await openHistoryDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to delete file from IndexedDB', err);
    return false;
  }
}

/**
 * Clears all cached files from IndexedDB.
 * @returns {Promise<boolean>} Success state
 */
export async function clearHistoryFiles() {
  try {
    const db = await openHistoryDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to clear IndexedDB files', err);
    return false;
  }
}
