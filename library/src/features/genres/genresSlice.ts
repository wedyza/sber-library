import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";
import type { BookItem } from "../books/booksSlice";

export interface GenreItem {
  id: number;
  title: string;
  description: string;
}

// export interface BookItem {
//   id: number;
//   title: string;
//   author: string;
//   cover?: string;
// }

interface GenresState {
  genres: GenreItem[];
  genresCount: number;

  genreBooks: BookItem[];

  loading: boolean;
  error: string | null;
}

const initialState: GenresState = {
  genres: [],
  genresCount: 0,
  genreBooks: [],
  loading: false,
  error: null,
};

export const fetchGenres = createAsyncThunk(
  "genres/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/genres/");
      return res.data as { count: number; results: GenreItem[] };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка загрузки жанров"
      );
    }
  }
);

export const fetchGenreBooks = createAsyncThunk(
  "genres/fetchGenreBooks",
  async (genreId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/genres/${genreId}/books/`);
      return res.data as BookItem[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка загрузки книг жанра"
      );
    }
  }
);

const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    clearGenreBooks(state) {
      state.genreBooks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload.results;
        state.genresCount = action.payload.count;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchGenreBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenreBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.genreBooks = action.payload;
      })
      .addCase(fetchGenreBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGenreBooks } = genresSlice.actions;
export default genresSlice.reducer;
