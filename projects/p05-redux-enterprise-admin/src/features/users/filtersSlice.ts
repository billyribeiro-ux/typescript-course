import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "./usersSlice.js";

export type RoleFilter = Role | "all";

export interface FiltersState {
  search: string;
  role: RoleFilter;
}

const initialState: FiltersState = { search: "", role: "all" };

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setRoleFilter: (state, action: PayloadAction<RoleFilter>) => {
      state.role = action.payload;
    },
    clearFilters: () => initialState,
  },
});

export const { setSearch, setRoleFilter, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
