export default function LoginScreen({ credentials, setCredentials, onLogin, error }) {
  return (
    <div className="login-wrap">
      <div className="login-glow" />
      <section className="login-card">
        <p className="eyebrow">Premium Task Suite</p>
        <h1>Welcome Back</h1>
        <p className="subhead">Sign in with one of the demo accounts to continue.</p>

        <form className="login-form" onSubmit={onLogin}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="admin or user"
            value={credentials.username}
            onChange={(e) => setCredentials((p) => ({ ...p, username: e.target.value }))}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
          />

          <button type="submit">Sign In</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="demo-box">
          <p><strong>Admin:</strong> `admin` / `admin123`</p>
          <p><strong>User:</strong> `user` / `user123`</p>
        </div>
      </section>
    </div>
  )
}
