export type Filter = 'all' | 'active' | 'completed';

export function FilterTabs({
  filter,
  setFilter
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
}) {
  return (
    <div className="filters">
      {(['all', 'active', 'completed'] as const).map(f => (
        <button
          key={f}
          className={filter === f ? 'selected' : ''}
          onClick={() => setFilter(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}
