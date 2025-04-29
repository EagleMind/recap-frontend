type StorageType = "local" | "session";

interface StorageHandler {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

class StorageService {
  private storage: StorageHandler;

  constructor(type: StorageType = "local") {
    this.storage = type === "local" ? localStorage : sessionStorage;
  }

  get<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return item as unknown as T;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof value === "string") {
      this.storage.setItem(key, value);
    } else {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const storage = new StorageService();
export const sessionStorageService = new StorageService("session");
