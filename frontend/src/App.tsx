import { useState, useEffect } from 'react';
import { appApi, secretsApi } from './services/api';
import type { App, Secret } from './types';
import './App.css';

function App() {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newAppId, setNewAppId] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    if (selectedApp) {
      loadSecrets(selectedApp.id);
    }
  }, [selectedApp]);

  const loadApps = async () => {
    try {
      const data = await appApi.getAll();
      setApps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps');
    }
  };

  const loadSecrets = async (appId: string) => {
    try {
      const data = await secretsApi.getAll(appId);
      setSecrets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load secrets');
    }
  };

  const createApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppId.trim() || !newAppName.trim()) return;
    try {
      await appApi.create(newAppId.trim(), newAppName.trim());
      setNewAppId('');
      setNewAppName('');
      loadApps();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create app');
    }
  };

  const deleteApp = async (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete app "${appId}" and all its secrets?`)) return;
    try {
      await appApi.delete(appId);
      setSelectedApp(null);
      setSecrets([]);
      loadApps();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete app');
    }
  };

  const addSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !newSecretKey.trim() || !newSecretValue.trim()) return;
    try {
      await secretsApi.add(selectedApp.id, newSecretKey.trim(), newSecretValue.trim());
      setNewSecretKey('');
      setNewSecretValue('');
      loadSecrets(selectedApp.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add secret');
    }
  };

  const deleteSecret = async (key: string) => {
    if (!selectedApp || !confirm(`Delete secret "${key}"?`)) return;
    try {
      await secretsApi.delete(selectedApp.id, key);
      loadSecrets(selectedApp.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete secret');
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Dev Secrets</h1>
          <p>Environment Variables</p>
          <form className="create-app-form" onSubmit={createApp}>
            <input
              type="text"
              placeholder="App ID (e.g. my-app)"
              value={newAppId}
              onChange={(e) => setNewAppId(e.target.value)}
            />
            <input
              type="text"
              placeholder="App Name"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
            />
            <button type="submit">Create App</button>
          </form>
        </div>
        <div className="app-list">
          {apps.map((app) => (
            <div
              key={app.id}
              className={`app-item ${selectedApp?.id === app.id ? 'selected' : ''}`}
              onClick={() => setSelectedApp(app)}
            >
              <div className="app-item-info">
                <span className="app-item-name">{app.name}</span>
                <span className="app-item-id">{app.id}</span>
              </div>
              <span className="app-item-count">{app.secretCount}</span>
              <button
                className="delete-btn"
                onClick={(e) => deleteApp(app.id, e)}
                title="Delete app"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        {!selectedApp ? (
          <div className="empty-state">
            <h2>Select an app</h2>
            <p>Choose from sidebar or create new</p>
          </div>
        ) : (
          <>
            <div className="secrets-header">
              <h2>{selectedApp.name}</h2>
              <form className="add-secret-form" onSubmit={addSecret}>
                <input
                  type="text"
                  placeholder="Secret key"
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Secret value"
                  value={newSecretValue}
                  onChange={(e) => setNewSecretValue(e.target.value)}
                />
                <button type="submit">Add Secret</button>
              </form>
            </div>
            <div className="secrets-grid">
              {secrets.map((secret) => (
                <div key={secret.key} className="secret-card">
                  <div className="secret-card-header">
                    <span className="secret-key">{secret.key}</span>
                    <div className="secret-actions">
                      <button
                        className={`copy-btn ${copiedKey === secret.key ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(secret.value, secret.key)}
                      >
                        {copiedKey === secret.key ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        className="delete-secret-btn"
                        onClick={() => deleteSecret(secret.key)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="secret-value">{secret.value}</div>
                  <div className="secret-meta">
                    <span>Created: {new Date(secret.createdAt).toLocaleString()}</span>
                    <span>Updated: {new Date(secret.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {secrets.length === 0 && (
                <div className="empty-secrets">
                  <p>No secrets yet // add one above</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
