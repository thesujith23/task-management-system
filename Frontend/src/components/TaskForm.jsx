export default function TaskForm({
  editingTaskId,
  form,
  setForm,
  isAdmin,
  currentUserId,
  assignableUsers,
  linkedOptions,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="form-head">
        <h2>{editingTaskId ? 'Edit task' : 'New task'}</h2>
        <p className="meta" style={{ margin: '6px 0 0' }}>
          {editingTaskId ? 'Update details and save changes.' : 'Create a task and optionally link it to a related one.'}
        </p>
      </div>

      <div className="form-stack">
        <div>
          <label className="label" htmlFor="task-title">
            Title
          </label>
          <input
            id="task-title"
            placeholder="e.g. Ship onboarding flow"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="task-desc">
            Description
          </label>
          <textarea
            id="task-desc"
            placeholder="What needs to be done? Add context for your team."
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={4}
          />
        </div>

        <p className="form-section-title">Status & priority</p>
        <div className="two-col">
          <div>
            <label className="label" htmlFor="task-status">
              Status
            </label>
            <select id="task-status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="task-priority">
              Priority
            </label>
            <select id="task-priority" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <p className="form-section-title">Assignment & links</p>
        <div className="two-col">
          <div>
            <label className="label" htmlFor="task-assignee">
              Assign to
            </label>
            <select
              id="task-assignee"
              value={isAdmin ? form.assignedTo : currentUserId}
              onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value, linkedTaskId: '' }))}
              disabled={!isAdmin}
            >
              {assignableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {isAdmin && <p className="meta" style={{ marginTop: 6 }}>Assign to any teammate or yourself.</p>}
            {!isAdmin && <p className="meta" style={{ marginTop: 6 }}>Members can only assign to themselves.</p>}
          </div>
          <div>
            <label className="label" htmlFor="task-link">
              Related task
            </label>
            <select id="task-link" value={form.linkedTaskId} onChange={(e) => setForm((p) => ({ ...p, linkedTaskId: e.target.value }))}>
              <option value="">None — standalone task</option>
              {linkedOptions.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="btn-group">
        <button type="submit" className="btn-primary">
          {editingTaskId ? 'Save changes' : 'Create task'}
        </button>
        {editingTaskId && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
