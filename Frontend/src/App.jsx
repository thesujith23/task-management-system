import { useEffect, useMemo, useRef, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import LoginScreen from './components/LoginScreen'
import StatsCards from './components/StatsCards'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { PRIORITY_WEIGHT, USERS } from './constants/users'

const emptyTaskForm = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  assignedTo: USERS[1].id,
  linkedTaskId: '',
}

const emptyCommentForm = { text: '', replyToId: '' }
const SESSION_KEY = 'task_app_logged_in_user'
const STORAGE_KEY = 'task_app_tasks_v1'

const createId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`

function App() {
  const formSectionRef = useRef(null)
  const [currentUserId, setCurrentUserId] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyTaskForm)
  const [editingTaskId, setEditingTaskId] = useState('')
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    sortBy: 'title',
    search: '',
  })
  const [commentFormByTask, setCommentFormByTask] = useState({})
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const currentUser = USERS.find((u) => u.id === currentUserId)
  const isAuthenticated = Boolean(currentUser)
  const isAdmin = currentUser?.role === 'admin'

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setTasks(Array.isArray(parsed) ? parsed : [])
    } catch (_e) {
      setTasks([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const base = isAdmin ? tasks : tasks.filter((t) => t.assignedTo === currentUserId)
    return base
      .filter((task) => (filters.status === 'All' ? true : task.status === filters.status))
      .filter((task) => (filters.priority === 'All' ? true : task.priority === filters.priority))
      .filter((task) => {
        const q = filters.search.trim().toLowerCase()
        if (!q) return true
        return (
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q) ||
          (USERS.find((u) => u.id === task.assignedTo)?.name || '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        if (filters.sortBy === 'title') return a.title.localeCompare(b.title)
        if (filters.sortBy === 'priority') return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
        return (USERS.find((u) => u.id === a.assignedTo)?.name || '').localeCompare(USERS.find((u) => u.id === b.assignedTo)?.name || '')
      })
  }, [tasks, isAdmin, currentUserId, filters])

  // Admin can assign to any user (including self); members only to themselves
  const assignableUsers = isAdmin ? USERS : [currentUser]

  const resetForm = () => {
    setForm({
      ...emptyTaskForm,
      assignedTo: isAdmin ? USERS[1].id : currentUserId,
    })
    setEditingTaskId('')
  }

  const validateTask = () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.')
      return false
    }
    if (!isAdmin && form.assignedTo !== currentUserId) {
      setError('Normal users cannot assign tasks to other users.')
      return false
    }
    if (form.linkedTaskId) {
      const linked = tasks.find((t) => t.id === form.linkedTaskId)
      if (!linked) {
        setError('Selected linked task does not exist.')
        return false
      }
      if (linked.assignedTo !== form.assignedTo) {
        setError('Tasks can only be linked when both are assigned to the same user.')
        return false
      }
      if (editingTaskId && linked.id === editingTaskId) {
        setError('Task cannot be linked to itself.')
        return false
      }
    }
    return true
  }

  const handleSaveTask = (e) => {
    e.preventDefault()
    setError('')
    if (!isAdmin) {
      setError('Only admin can create/edit tasks.')
      return
    }
    if (!validateTask()) return

    if (editingTaskId) {
      const updated = {
        ...form,
        id: editingTaskId,
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: isAdmin ? form.assignedTo : currentUserId,
        updatedAt: new Date().toISOString(),
      }
      setTasks((prev) => prev.map((task) => (task.id === editingTaskId ? { ...task, ...updated } : task)))
    } else {
      const created = {
        ...form,
        id: createId('task'),
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: isAdmin ? form.assignedTo : currentUserId,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTasks((prev) => [created, ...prev])
    }
    resetForm()
  }

  const handleEditTask = (task) => {
    if (!isAdmin) {
      setError('Only admin can edit tasks.')
      return
    }
    setError('')
    setEditingTaskId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      linkedTaskId: task.linkedTaskId || '',
    })
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleDeleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    if (!isAdmin) {
      setError('Only admin can delete tasks.')
      return
    }
    setError('')
    setTasks((prev) => prev.filter((t) => t.id !== taskId).map((t) => (t.linkedTaskId === taskId ? { ...t, linkedTaskId: '' } : t)))
  }

  const updateCommentForm = (taskId, patch) => {
    setCommentFormByTask((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || emptyCommentForm), ...patch },
    }))
  }

  const handleAddComment = (taskId) => {
    const value = commentFormByTask[taskId] || emptyCommentForm
    const text = value.text.trim()
    if (!text) {
      setError('Comment text cannot be empty.')
      return
    }
    setError('')
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        if (value.replyToId) {
          return {
            ...task,
            comments: (task.comments || []).map((comment) =>
              comment.id !== value.replyToId
                ? comment
                : {
                    ...comment,
                    replies: [
                      ...(comment.replies || []),
                      { id: createId('reply'), text, authorId: currentUserId, createdAt: new Date().toISOString() },
                    ],
                  }
            ),
            updatedAt: new Date().toISOString(),
          }
        }
        return {
          ...task,
          comments: [
            ...(task.comments || []),
            { id: createId('comment'), text, authorId: currentUserId, createdAt: new Date().toISOString(), replies: [] },
          ],
          updatedAt: new Date().toISOString(),
        }
      })
    )
    updateCommentForm(taskId, { text: '', replyToId: '' })
  }

  const handleDeleteComment = (taskId, commentId, replyId = '') => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        const comments = (task.comments || [])
          .map((comment) => {
            if (comment.id !== commentId) return comment
            if (!replyId) return comment
            return { ...comment, replies: (comment.replies || []).filter((reply) => reply.id !== replyId) }
          })
          .filter((comment) => comment.id !== commentId || replyId)
        return { ...task, comments, updatedAt: new Date().toISOString() }
      })
    )
  }

  const linkedOptions = tasks.filter((task) => task.id !== editingTaskId && task.assignedTo === form.assignedTo)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const username = credentials.username.trim().toLowerCase()
    const password = credentials.password
    if (!username || !password) {
      setError('Username and password are required.')
      return
    }
    const user = USERS.find((u) => u.username === username && u.password === password)
    if (!user) {
      setError('Invalid credentials. Use demo credentials shown below.')
      return
    }
    sessionStorage.setItem(SESSION_KEY, user.id)
    setCurrentUserId(user.id)
    setCredentials({ username: '', password: '' })
    setError('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setCurrentUserId('')
    // Do NOT clear tasks — that would overwrite localStorage with [] and wipe all data
    setEditingTaskId('')
    setCommentFormByTask({})
    setForm({ ...emptyTaskForm, assignedTo: USERS[1].id })
    setFilters({ status: 'All', priority: 'All', sortBy: 'title', search: '' })
    setCredentials({ username: '', password: '' })
    setError('')
  }

  if (!isAuthenticated) {
    return <LoginScreen credentials={credentials} setCredentials={setCredentials} onLogin={handleLogin} error={error} />
  }

  return (
    <div className="app-shell">
      <HeaderBar
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {error && <p className="error">{error}</p>}

      <StatsCards visibleTasks={visibleTasks} />

      {isAdmin ? (
        <section className="form-row" ref={formSectionRef}>
          <TaskForm
            editingTaskId={editingTaskId}
            form={form}
            setForm={setForm}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            assignableUsers={assignableUsers}
            linkedOptions={linkedOptions}
            onSubmit={handleSaveTask}
            onCancel={resetForm}
          />
        </section>
      ) : (
        <section className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ marginBottom: 6 }}>View only</h2>
          <p className="meta" style={{ margin: 0 }}>
            Members can view tasks and participate in comments, but cannot create, edit, or delete tasks.
          </p>
        </section>
      )}

      <TaskList
        filters={filters}
        setFilters={setFilters}
        visibleTasks={visibleTasks}
        tasks={tasks}
        users={USERS}
        isAdmin={isAdmin}
        commentFormByTask={commentFormByTask}
        updateCommentForm={updateCommentForm}
        handleAddComment={handleAddComment}
        handleDeleteComment={handleDeleteComment}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
      />
    </div>
  )
}

export default App
