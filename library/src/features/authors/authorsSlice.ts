import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";

export interface AuthorItem {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

interface AuthorsState {
  authors: AuthorItem[];
  authorsCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  authorsCount: 0,
  loading: false,
  error: null,
};

export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/authors/");
      return res.data as { count: number; results: AuthorItem[] };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка загрузки авторов"
      );
    }
  }
);

const authorsSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    clearAuthors(state) {
      state.authors = [];
      state.authorsCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.results;
        state.authorsCount = action.payload.count;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthors } = authorsSlice.actions;
export default authorsSlice.reducer;
