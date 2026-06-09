import { useAppDispatch, useAppSelector } from "../store.js";
import {
  setSearch,
  setRoleFilter,
  type RoleFilter,
} from "../features/users/filtersSlice.js";

const OPTIONS: RoleFilter[] = ["all", "admin", "editor", "viewer"];

export function FiltersBar() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((s) => s.filters.search);
  const role = useAppSelector((s) => s.filters.role);

  return (
    <div className="filters">
      <label htmlFor="search">Search</label>
      <input
        id="search"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Name or email…"
      />
      <label htmlFor="role-filter">Filter role</label>
      <select
        id="role-filter"
        value={role}
        onChange={(e) => dispatch(setRoleFilter(e.target.value as RoleFilter))}
      >
        {OPTIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}
