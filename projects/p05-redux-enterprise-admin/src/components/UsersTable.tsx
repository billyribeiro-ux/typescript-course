import { useAppDispatch, useAppSelector, selectVisibleUsers } from "../store.js";
import { removeUser, setRole, toggleActive, type Role } from "../features/users/usersSlice.js";

const ROLES: Role[] = ["admin", "editor", "viewer"];

export function UsersTable() {
  const users = useAppSelector(selectVisibleUsers);
  const dispatch = useAppDispatch();

  if (users.length === 0) return <p>No users match the current filters.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} data-testid="user-row">
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <label className="sr-only" htmlFor={`role-${user.id}`}>
                Role for {user.name}
              </label>
              <select
                id={`role-${user.id}`}
                value={user.role}
                onChange={(e) => dispatch(setRole({ id: user.id, role: e.target.value as Role }))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <button type="button" onClick={() => dispatch(toggleActive(user.id))}>
                {user.active ? "Active" : "Inactive"}
              </button>
            </td>
            <td>
              <button
                type="button"
                aria-label={`Remove ${user.name}`}
                onClick={() => dispatch(removeUser(user.id))}
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
