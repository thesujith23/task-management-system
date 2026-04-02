export default function HeaderBar({ currentUser, isAdmin, onLogout }) {
  return (
    <header className="card header">
      <div>
        <h1>Task Management System</h1>
        <p className="subhead">Role-based task workspace with links, comments, filtering, and search.</p>
      </div>
      <div className="row">
        <p className="meta">Signed in as <strong>{currentUser?.name}</strong></p>
        <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>{isAdmin ? 'Admin Access' : 'User Access'}</span>
        <button type="button" className="secondary" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}
