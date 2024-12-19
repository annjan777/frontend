import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch('http://65.1.92.135:8001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_number: username, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user info if needed
      localStorage.setItem('user_id', username); // Store contact number as user_id

      // Pass user info including role to the parent component
      onLogin(data.user.role); 

    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    }
  };

  // Trigger login on "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className='login'>
      <h1>Login</h1>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username (Contact Number)"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          onKeyDown={handleKeyDown} // Add event listener here
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
