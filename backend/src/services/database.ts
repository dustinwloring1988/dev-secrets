import sqlite3 from 'sqlite3';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '..', 'data', 'apps');

function ensureDir(): void {
  const fs = require('fs');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDbPath(appId: string): string {
  return path.join(DATA_DIR, `${appId}.db`);
}

function dbGet<T>(db: sqlite3.Database, sql: string, params?: unknown[]): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get<T>(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll<T>(db: sqlite3.Database, sql: string, params?: unknown[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all<T>(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function dbRun(db: sqlite3.Database, sql: string, params?: unknown[]): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export const databaseService = {
  createDatabase(appId: string, name: string): void {
    ensureDir();
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS secrets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS apps_meta (name TEXT)`);
      db.run(`INSERT OR IGNORE INTO apps_meta (rowid, name) VALUES (1, ?)`, [name]);
    });

    db.close();
  },

  deleteDatabase(appId: string): void {
    const dbPath = getDbPath(appId);
    const fs = require('fs');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  },

  exists(appId: string): boolean {
    const dbPath = getDbPath(appId);
    const fs = require('fs');
    return fs.existsSync(dbPath);
  },

  async getAllApps(): Promise<{ id: string; name: string; createdAt: string }[]> {
    ensureDir();
    const fs = require('fs');
    const apps: { id: string; name: string; createdAt: string }[] = [];

    if (fs.existsSync(DATA_DIR)) {
      const files = fs.readdirSync(DATA_DIR).filter((f: string) => f.endsWith('.db'));

      for (const file of files) {
        const appId = file.replace('.db', '');
        const dbPath = path.join(DATA_DIR, file);
        const db = new sqlite3.Database(dbPath);
        const row = await dbGet<{ name: string }>(db, 'SELECT name FROM apps_meta');
        const stats = fs.statSync(dbPath);
        apps.push({
          id: appId,
          name: row?.name || appId,
          createdAt: stats.birthtime.toISOString()
        });
        db.close();
      }
    }

    return apps;
  },

  async getSecrets(appId: string): Promise<{ key: string; value: string; created_at: string; updated_at: string }[]> {
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);
    const secrets = await dbAll<{ key: string; value: string; created_at: string; updated_at: string }>(db, 'SELECT key, value, created_at, updated_at FROM secrets');
    db.close();
    return secrets;
  },

  addSecret(appId: string, key: string, value: string): void {
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);

    db.run(`INSERT INTO secrets (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
      [key, value]);

    db.close();
  },

  deleteSecret(appId: string, key: string): void {
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);
    db.run('DELETE FROM secrets WHERE key = ?', [key]);
    db.close();
  },

  async getSecret(appId: string, key: string): Promise<{ key: string; value: string; created_at: string; updated_at: string } | null> {
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);
    const row = await dbGet<{ key: string; value: string; created_at: string; updated_at: string }>(db, 'SELECT key, value, created_at, updated_at FROM secrets WHERE key = ?', [key]);
    db.close();
    return row || null;
  },

  upsertSecret(appId: string, key: string, value: string): void {
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);
    db.run(`INSERT INTO secrets (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
      [key, value]);
    db.close();
  },

  async getSecretCount(appId: string): Promise<number> {
    const dbPath = getDbPath(appId);
    const db = new sqlite3.Database(dbPath);
    const row = await dbGet<{ count: number }>(db, 'SELECT COUNT(*) as count FROM secrets');
    db.close();
    return row?.count || 0;
  }
};
