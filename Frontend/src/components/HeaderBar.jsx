export default function HeaderBar({ currentUser, isAdmin, onLogout }) {
  const initials =
    currentUser?.name
      ?.split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'

  return (
    <header className="card header">
      <div className="brand">
        <div className="brand-mark" aria-hidden>
          ✓
        </div>
        <div className="brand-text">
          <p className="eyebrow">TaskFlow</p>
          <h1>Workspace</h1>
          <p className="subhead">Plan, assign, and collaborate on tasks with role-based access.</p>
        </div>
      </div>
      <div className="user-bar">
        <div className="avatar" title={currentUser?.name}>
          {initials}
        </div>
        <div>
          <p className="meta" style={{ margin: 0 }}>
            Signed in as <strong>{currentUser?.name}</strong>
          </p>
        </div>
        <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>{isAdmin ? 'Administrator' : 'Member'}</span>
        <button type="button" className="btn-secondary btn-sm" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}
