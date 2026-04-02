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
    <form className="card" onSubmit={onSubmit}>
      <h2>{editingTaskId ? 'Edit Task' : 'Create Task'}</h2>
      <input placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} />
      <div className="two-col">
        <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option>Pending</option>
          <option>Completed</option>
        </select>
        <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div className="two-col">
        <select
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
        <select value={form.linkedTaskId} onChange={(e) => setForm((p) => ({ ...p, linkedTaskId: e.target.value }))}>
          <option value="">No Linked Task</option>
          {linkedOptions.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <button type="submit">{editingTaskId ? 'Update Task' : 'Create Task'}</button>
        {editingTaskId && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
