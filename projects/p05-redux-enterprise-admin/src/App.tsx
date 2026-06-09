import { useAppSelector, selectCurrentUser } from "./store.js";
import { FiltersBar } from "./components/FiltersBar.js";
import { AddUserForm } from "./components/AddUserForm.js";
import { UsersTable } from "./components/UsersTable.js";
import "./index.css";

export function App() {
  const currentUser = useAppSelector(selectCurrentUser);
  return (
    <main className="app">
      <header className="app-header">
        <h1>👥 Admin · Users</h1>
        <span>Signed in as {currentUser ? currentUser.name : "nobody"}</span>
      </header>
      <FiltersBar />
      <AddUserForm />
      <UsersTable />
    </main>
  );
}
