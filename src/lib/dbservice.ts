import { IDBPDatabase, openDB } from "idb";

class IndexedDb {
  private database: string;
  private db: IDBPDatabase<unknown> | null;

  constructor(database: string) {
    this.database = database;
    this.db = null;
  }

  public async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            db.createObjectStore(tableName);
          }
        },
      });
    } catch (error) {
      return false;
    }
  }

  public async getValue<T>(tableName: string, id: IDBKeyRange | IDBValidKey): Promise<T> {
    if (!this.db) throw new Error("Tried to fetch from non-existing IDB");
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    return store.get(id);
  }

  public async getAllValue(tableName: string) {
    if (!this.db) throw new Error("Tried to fetch from non-existing IDB");
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    return store.getAll();
  }

  public async putValue(tableName: string, value: object, key?: IDBKeyRange | IDBValidKey) {
    if (!this.db) throw new Error("Tried to fetch from non-existing IDB");
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    return store.put(value, key);
  }

  public async putBulkValue(tableName: string, values: object[]) {
    if (!this.db) throw new Error("Tried to fetch from non-existing IDB");
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    for (const value of values) {
      await store.put(value);
    }
    return this.getAllValue(tableName);
  }

  public async deleteValue(tableName: string, id: IDBKeyRange | IDBValidKey) {
    if (!this.db) throw new Error("Tried to fetch from non-existing IDB");
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      return result;
    }
    await store.delete(id);
    return id;
  }
}

export default IndexedDb;
