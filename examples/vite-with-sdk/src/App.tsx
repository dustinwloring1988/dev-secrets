import { useEffect, useState } from 'react';
import { DevSecretsClient } from 'dev-secrets-sdk';
import type { AppInfo, Secret } from 'dev-secrets-sdk';
import './App.css';

const client = new DevSecretsClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

function App() {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [newAppId, setNewAppId] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const apps = await client.apps.list();
      setApps(apps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const loadSecrets = async (appId: string) => {
    try {
      setLoading(true);
      setError(null);
      const secrets = await client.secrets.list(appId);
      setSecrets(secrets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load secrets');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApp = (appId: string) => {
    setSelectedApp(appId);
    loadSecrets(appId);
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppId || !newAppName) return;
    
    try {
      setLoading(true);
      setError(null);
      await client.apps.create(newAppId, newAppName);
      setNewAppId('');
      setNewAppName('');
      await loadApps();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create app');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !newSecretKey || !newSecretValue) return;
    
    try {
      setLoading(true);
      setError(null);
      await client.secrets.add(selectedApp, newSecretKey, newSecretValue);
      setNewSecretKey('');
      setNewSecretValue('');
      await loadSecrets(selectedApp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add secret');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSecret = async (key: string) => {
    if (!selectedApp) return;
    
    try {
      setLoading(true);
      setError(null);
      await client.secrets.delete(selectedApp, key);
      await loadSecrets(selectedApp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete secret');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  return (
    <div className="container">
      <h1>Dev Secrets SDK Demo</h1>
      
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <section className="apps-section">
        <h2>Apps</h2>
        <button onClick={loadApps}>Refresh Apps</button>
        
        <form onSubmit={handleCreateApp} className="create-form">
          <input
            type="text"
            placeholder="App ID"
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

        <ul className="app-list">
          {apps.map((app) => (
            <li
              key={app.id}
              className={selectedApp === app.id ? 'selected' : ''}
              onClick={() => handleSelectApp(app.id)}
            >
              <strong>{app.name}</strong>
              <span>ID: {app.id}</span>
              <span>Secrets: {app.secretCount}</span>
            </li>
          ))}
        </ul>
      </section>

      {selectedApp && (
        <section className="secrets-section">
          <h2>Secrets for {selectedApp}</h2>
          
          <form onSubmit={handleAddSecret} className="create-form">
            <input
              type="text"
              placeholder="Secret Key"
              value={newSecretKey}
              onChange={(e) => setNewSecretKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Secret Value"
              value={newSecretValue}
              onChange={(e) => setNewSecretValue(e.target.value)}
            />
            <button type="submit">Add Secret</button>
          </form>

          <ul className="secret-list">
            {secrets.map((secret) => (
              <li key={secret.key}>
                <span><strong>{secret.key}</strong>: {secret.value}</span>
                <button onClick={() => handleDeleteSecret(secret.key)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
