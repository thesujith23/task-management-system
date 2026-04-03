export default function LoginScreen({ credentials, setCredentials, onLogin, error }) {
  return (
    <div className="login-wrap">
      <div className="login-bg-grid" aria-hidden />
      <div className="login-glow" aria-hidden />
      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark" aria-hidden>
            ✓
          </div>
          <div>
            <p className="eyebrow">TaskFlow</p>
            <h1>Welcome back</h1>
          </div>
        </div>
        <p className="subhead">Sign in with a demo account to explore role-based task management.</p>

        <form className="login-form" onSubmit={onLogin}>
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              placeholder="e.g. admin"
              value={credentials.username}
              onChange={(e) => setCredentials((p) => ({ ...p, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 18px' }}>
            Continue to workspace
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="demo-box">
          <p>
            <strong>Admin</strong> — <code>admin</code> / <code>admin123</code>
          </p>
          <p>
            <strong>Team member 1</strong> — <code>user1</code> / <code>user123</code>
          </p>
          <p>
            <strong>Team member 2</strong> — <code>user2</code> / <code>user123</code>
          </p>
        </div>
      </section>
    </div>
  )
}
