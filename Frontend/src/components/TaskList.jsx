function priorityBarClass(priority) {
  if (priority === 'High') return 'high'
  if (priority === 'Medium') return 'medium'
  return 'low'
}

function priorityChipClass(priority) {
  if (priority === 'High') return 'chip chip-priority-high'
  if (priority === 'Medium') return 'chip chip-priority-med'
  return 'chip chip-priority-low'
}

export default function TaskList({
  filters,
  setFilters,
  isAdmin,
  visibleTasks,
  tasks,
  users,
  commentFormByTask,
  updateCommentForm,
  handleAddComment,
  handleDeleteComment,
  handleEditTask,
  handleDeleteTask,
}) {
  return (
    <section className="card tasks-combined">
      <div className="tasks-section-header">
        <div>
          <h2>Search &amp; tasks</h2>
          <p className="meta" style={{ margin: '6px 0 0', maxWidth: '48ch' }}>
            Search your backlog, filter by status or priority, and sort the list — then manage each task below.
          </p>
        </div>
        <span className="tasks-count">{visibleTasks.length} shown</span>
      </div>

      <div className="search-toolbar">
        <p className="section-label">Search</p>
        <div className="search-wrap">
          <input
            type="search"
            placeholder="Search by title, description, or assignee…"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            aria-label="Search tasks"
          />
        </div>
        <div className="two-col search-toolbar-filters">
          <div>
            <label className="label" htmlFor="filter-status">
              Status
            </label>
            <select id="filter-status" value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="filter-priority">
              Priority
            </label>
            <select id="filter-priority" value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))}>
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="filter-sort">
            Sort by
          </label>
          <select id="filter-sort" value={filters.sortBy} onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}>
            <option value="title">Title (A–Z)</option>
            <option value="priority">Priority (high first)</option>
            <option value="assignedTo">Assignee name</option>
          </select>
        </div>
      </div>

      <div className="tasks-divider" role="presentation" />

      <p className="section-label" style={{ marginBottom: 12 }}>
        Task list
      </p>

      {visibleTasks.length === 0 && (
        <div className="empty-state">
          <strong>No tasks match</strong>
          Try adjusting search or filters, or create a new task from the form above.
        </div>
      )}

      <div className="task-list">
        {visibleTasks.map((task) => {
          const assignee = users.find((u) => u.id === task.assignedTo)
          const linked = tasks.find((t) => t.id === task.linkedTaskId)
          const barClass = priorityBarClass(task.priority)

          return (
            <article key={task.id} className="task">
              <div className={`task-priority-bar ${barClass}`} aria-hidden />
              <div className="task-inner">
                <div className="task-head">
                  <h3>{task.title}</h3>
                  <div className="row">
                    <span className={task.status === 'Completed' ? 'chip ok' : 'chip warn'}>{task.status}</span>
                    <span className={priorityChipClass(task.priority)}>{task.priority}</span>
                  </div>
                </div>
                <p className="task-desc">{task.description}</p>

                <div className="task-meta-grid">
                  <div className="task-meta-item">
                    <span>Assignee</span>
                    <span>{assignee?.name || '—'}</span>
                  </div>
                  <div className="task-meta-item">
                    <span>Linked</span>
                    <span>{linked ? linked.title : '—'}</span>
                  </div>
                  <div className="task-meta-item">
                    <span>Updated</span>
                    <span>{new Date(task.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="btn-group" style={{ marginTop: 0 }}>
                    <button type="button" className="btn-secondary btn-sm" onClick={() => handleEditTask(task)}>
                      Edit
                    </button>
                    <button type="button" className="btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                )}

                <div className="comments">
                  <h4>Discussion</h4>
                  <div className="comment-thread">
                    {(task.comments || []).map((comment) => (
                      <div key={comment.id} className="comment">
                        <p className="comment-body">
                          <strong>{users.find((u) => u.id === comment.authorId)?.name}</strong> {comment.text}
                        </p>
                        <div className="comment-actions">
                          <button type="button" className="link" onClick={() => updateCommentForm(task.id, { replyToId: comment.id })}>
                            Reply
                          </button>
                          <button type="button" className="link danger-text" onClick={() => handleDeleteComment(task.id, comment.id)}>
                            Remove
                          </button>
                        </div>
                        {(comment.replies || []).map((reply) => (
                          <div key={reply.id} className="reply">
                            <p className="comment-body">
                              <strong>{users.find((u) => u.id === reply.authorId)?.name}</strong> {reply.text}
                            </p>
                            <div className="comment-actions">
                              <button type="button" className="link danger-text" onClick={() => handleDeleteComment(task.id, comment.id, reply.id)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="comment-input-row">
                    <input
                      placeholder={commentFormByTask[task.id]?.replyToId ? 'Write a reply…' : 'Add a comment…'}
                      value={commentFormByTask[task.id]?.text || ''}
                      onChange={(e) => updateCommentForm(task.id, { text: e.target.value })}
                    />
                    <button type="button" className="btn-primary btn-sm" onClick={() => handleAddComment(task.id)}>
                      Post
                    </button>
                  </div>
                  {commentFormByTask[task.id]?.replyToId && (
                    <button type="button" className="link" style={{ marginTop: 6 }} onClick={() => updateCommentForm(task.id, { replyToId: '' })}>
                      Cancel reply
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
