import React, { useState, useEffect } from 'react';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ contact_number: "", name: "", address: "", password: "", role: "user", enable: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://65.1.92.135:8001/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    setError("");
    const { contact_number, name, address, password, role } = newUser;

    if (!/^\d{10}$/.test(contact_number)) {
      setError("Invalid 10-digit contact number.");
      return;
    }
    if (!name || !address || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch('http://65.1.92.135:8001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to add user');
      const addedUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setNewUser({ contact_number: "", name: "", address: "", password: "", role: "user", enable: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveUser = async (contact_number) => {
    try {
      const response = await fetch(`http://65.1.92.135:8001/users/${contact_number}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove user');
      setUsers((prevUsers) => prevUsers.filter((user) => user.contact_number !== contact_number));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleEnable = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://65.1.92.135:8001/users/${userId}/enable`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: !currentStatus }),  // Toggling enable status
      });
      if (!response.ok) throw new Error('Failed to update enable status');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === userId ? { ...user, enable: !currentStatus } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <input type="text" value={newUser.contact_number} onChange={(e) => setNewUser({ ...newUser, contact_number: e.target.value })} placeholder="Contact Number" />
        <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Name" />
        <input type="text" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} placeholder="Address" />
        <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAddUser}>Add User</button>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Users</h2>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Role</th>
            <th>Enable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.contact_number}>
              <td>{user.name}</td>
              <td>{user.contact_number}</td>
              <td>{user.role}</td>
              <td>{user.enable ? 'Enabled' : 'Disabled'}</td>
              <td>
                <button onClick={() => handleToggleEnable(user.user_id, user.enable)}>{user.enable ? 'Disable' : 'Enable'}</button>
                <button onClick={() => handleRemoveUser(user.contact_number)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
