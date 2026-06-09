import { useState } from "react";
import { useAppDispatch } from "../store.js";
import { addUser, type Role } from "../features/users/usersSlice.js";

const ROLES: Role[] = ["admin", "editor", "viewer"];

export function AddUserForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");

  const valid = name.trim().length > 0 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    dispatch(addUser({ name: name.trim(), email: email.trim(), role }));
    setName("");
    setEmail("");
    setRole("viewer");
  };

  return (
    <form onSubmit={handleSubmit} className="add-user">
      <label htmlFor="new-name">Name</label>
      <input id="new-name" value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="new-email">Email</label>
      <input id="new-email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="new-role">Role</label>
      <select id="new-role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <button type="submit" disabled={!valid}>
        Add user
      </button>
    </form>
  );
}
