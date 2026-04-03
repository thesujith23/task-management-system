export default function StatsCards({ visibleTasks }) {
  const completedCount = visibleTasks.filter((t) => t.status === 'Completed').length
  const pendingCount = visibleTasks.filter((t) => t.status === 'Pending').length

  return (
    <section className="stats-grid" aria-label="Task summary">
      <article className="card stat">
        <span className="stat-icon" aria-hidden>
          ◎
        </span>
        <p className="stat-label">In view</p>
        <p className="stat-value">{visibleTasks.length}</p>
      </article>
      <article className="card stat">
        <span className="stat-icon" aria-hidden>
          ◐
        </span>
        <p className="stat-label">Pending</p>
        <p className="stat-value">{pendingCount}</p>
      </article>
      <article className="card stat">
        <span className="stat-icon" aria-hidden>
          ✓
        </span>
        <p className="stat-label">Done</p>
        <p className="stat-value">{completedCount}</p>
      </article>
    </section>
  )
}
