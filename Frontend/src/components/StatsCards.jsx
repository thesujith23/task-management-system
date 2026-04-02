export default function StatsCards({ visibleTasks }) {
  const completedCount = visibleTasks.filter((t) => t.status === 'Completed').length
  const pendingCount = visibleTasks.filter((t) => t.status === 'Pending').length

  return (
    <section className="stats-grid">
      <article className="card stat">
        <p className="meta">Visible Tasks</p>
        <h3>{visibleTasks.length}</h3>
      </article>
      <article className="card stat">
        <p className="meta">Pending</p>
        <h3>{pendingCount}</h3>
      </article>
      <article className="card stat">
        <p className="meta">Completed</p>
        <h3>{completedCount}</h3>
      </article>
    </section>
  )
}
