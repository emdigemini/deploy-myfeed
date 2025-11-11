const DB_NAME = 'MyFeedDB';
const STORE_NAME = 'UserPosts';
const DB_VERSION = 1;

export function openDB(){
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event){
      const db = event.target.result;

      if(!db.objectStoreNames.contains(STORE_NAME)){
        const store = db.createObjectStore(STORE_NAME, {keyPath: 'id', autoIncrement: false});
        store.createIndex('timestamp_idx', 'timestamp', {unique: false});
      }
    };
    request.onsuccess = function(event){
      resolve(event.target.result);
    };
    request.onerror = function(event){
      reject(event.target.error);
    };
  })
}

export async function savePost(data){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction =  db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => {
      alert('Failed to save post, please try again.', e.target.error);
      reject(e.target.error);
    };

    transaction.oncomplete = () => console.log('Posted successfuly!');;
  })
} 

export async function getAllPosts(){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      const sortedData = request.result.sort((a, b) => b.timestamp - a.timestamp);
      resolve(sortedData);
    };
    request.onerror = (e) => {
      alert('Failed to load your posts from database.', e.target.error);
      reject(e.target.error);
    }

    transaction.oncomplete = () => db.close();
  })
}