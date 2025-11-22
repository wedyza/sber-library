import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";
import type { GenreItem } from "../genres/genresSlice";
import type { AuthorItem } from "../authors/authorsSlice";

export interface BookItem {
  id: number;
  title: string;
  description: string;
  authors: AuthorItem[];
  genres: GenreItem[];
}

interface BooksState {
  books: BookItem[];
  booksCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  booksCount: 0,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/books/");
      return res.data as { count: number; results: BookItem[] };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка загрузки книг"
      );
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearBooks(state) {
      state.books = [];
      state.booksCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.results;
        state.booksCount = action.payload.count;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBooks } = booksSlice.actions;
export default booksSlice.reducer;
