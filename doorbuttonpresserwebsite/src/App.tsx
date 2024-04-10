import { useState } from 'react';
import './App.css';

function App() {
  const [passcode, setPasscode] = useState('');
  const [response, setResponse] = useState<Response | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const openDoorResponse: Response = await fetch('/open-door', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });
      setResponse(openDoorResponse);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Open Door</h2>
        <form onSubmit={handleSubmit} style={{ margin: '20px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '10px' }} htmlFor="username">Passcode:</label>
          <input
            style={{ marginBottom: '20px', padding: '8px' }}
            type="text"
            id="username"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} style={{ padding: '8px', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        {response && (
          <div style={{ textAlign: 'center' }}>
            <h3>{response.ok ? "Opening Door" : "Incorrect Passcode"}</h3>
          </div>
        )}
    </div>
  );
};

export default App;
