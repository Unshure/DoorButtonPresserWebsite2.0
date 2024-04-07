import { useState } from 'react';
import './App.css';

function App() {
  const [passcode, setPasscode] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/open-door', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });
      const data = await response.json();
      setResponse(data);
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
          <div>
            <h3>Response:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
    </div>
  );
};

export default App;
