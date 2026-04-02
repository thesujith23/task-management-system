export default function FiltersPanel({ filters, setFilters }) {
  return (
    <div className="card">
      <h2>Filters & Sorting</h2>
      <input
        placeholder="Search title / description / assignee"
        value={filters.search}
        onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
      />
      <div className="two-col">
        <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <select value={filters.sortBy} onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}>
        <option value="title">Sort: Title (A-Z)</option>
        <option value="priority">Sort: Priority (High-Low)</option>
        <option value="assignedTo">Sort: Assigned User</option>
      </select>
    </div>
  )
}
