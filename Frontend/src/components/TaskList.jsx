export default function TaskList({
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
    <section className="card">
      <h2>Tasks ({visibleTasks.length})</h2>
      {visibleTasks.length === 0 && <p>No tasks found for selected filters/user.</p>}
      <div className="task-list">
        {visibleTasks.map((task) => {
          const assignee = users.find((u) => u.id === task.assignedTo)
          const linked = tasks.find((t) => t.id === task.linkedTaskId)
          return (
            <article key={task.id} className="task">
              <div className="task-head">
                <h3>{task.title}</h3>
                <div className="row">
                  <span className={`chip ${task.status === 'Completed' ? 'ok' : 'warn'}`}>{task.status}</span>
                  <span className="chip">{task.priority}</span>
                </div>
              </div>
              <p>{task.description}</p>
              <p className="meta">Assigned to: {assignee?.name || 'Unknown'}</p>
              <p className="meta">Linked task: {linked ? linked.title : 'None'}</p>
              <p className="meta">Updated: {new Date(task.updatedAt).toLocaleString()}</p>

              <div className="row">
                <button type="button" onClick={() => handleEditTask(task)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>

              <div className="comments">
                <h4>Comments</h4>
                {(task.comments || []).map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="row-between">
                      <p>
                        <strong>{users.find((u) => u.id === comment.authorId)?.name}:</strong> {comment.text}
                      </p>
                      <div className="row">
                        <button type="button" className="link" onClick={() => updateCommentForm(task.id, { replyToId: comment.id })}>
                          Reply
                        </button>
                        <button type="button" className="link danger-text" onClick={() => handleDeleteComment(task.id, comment.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    {(comment.replies || []).map((reply) => (
                      <div key={reply.id} className="reply">
                        <div className="row-between">
                          <p>
                            <strong>{users.find((u) => u.id === reply.authorId)?.name}:</strong> {reply.text}
                          </p>
                          <button type="button" className="link danger-text" onClick={() => handleDeleteComment(task.id, comment.id, reply.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="row">
                  <input
                    placeholder={commentFormByTask[task.id]?.replyToId ? 'Reply to comment' : 'Add a comment'}
                    value={commentFormByTask[task.id]?.text || ''}
                    onChange={(e) => updateCommentForm(task.id, { text: e.target.value })}
                  />
                  <button type="button" onClick={() => handleAddComment(task.id)}>
                    Add
                  </button>
                </div>
                {commentFormByTask[task.id]?.replyToId && (
                  <button type="button" className="link" onClick={() => updateCommentForm(task.id, { replyToId: '' })}>
                    Cancel Reply
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
