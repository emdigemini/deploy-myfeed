

export function openDB(DB_NAME, STORE_NAME, DB_VERSION){
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

export async function managePost(data, action){
  const DB_NAME = 'MyFeedDB';
  const STORE_NAME = 'UserPosts';
  const DB_VERSION = 1;
  const db = await openDB(DB_NAME, STORE_NAME, DB_VERSION);
  return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let request;

      switch(action){
      case 'save':
      case 'interact':
        request = store.put(data);
        break;
      case 'delete':
        request = store.delete(data);
        break;
      default:
        return reject("Invalid action parameter. Use 'save', 'interact', or 'delete'.");
    }
      
      request.onsuccess = () => resolve(true); 
      request.onerror = (e) => {
        console.error("Action failed.", e.target.error);
        reject(e.target.error);
      };

      transaction.oncomplete = () => db.close();
  });
}

export async function getAllPosts(){
  const DB_NAME = 'MyFeedDB';
  const STORE_NAME = 'UserPosts';
  const DB_VERSION = 1;
  const db = await openDB(DB_NAME, STORE_NAME, DB_VERSION);
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

export async function openUserDB(DB_NAME, STORE_NAME, DB_VERSION){
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains(STORE_NAME)){
        const store = db.createObjectStore(STORE_NAME, {keyPath: 'id', autoIncrement: true});
        store.createIndex('dateCreated_idx', 'dateCreated', {unique: false});
      };
    }

    request.onsuccess = (e) => resolve(e.target.result); 
    request.onerror = (e) => reject(e.target.error); 
  })
}

export async function manageUserProfile(data){
  const DB_NAME = 'MyProfileDB';
  const STORE_NAME = 'UserProfile';
  const DB_VERSION = 2;
  const db = await openDB(DB_NAME, STORE_NAME, DB_VERSION);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data);

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  })
}