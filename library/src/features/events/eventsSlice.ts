import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/axiosInstance';

export interface EventItem {
  id: string;
  title: string;
  spots: number;
  spots_left: number;
  description: string;
  time: string;
  user_signed_up: boolean;
  address?: string;
}

interface EventsState {
  actualEvents: EventItem[];
  passedEvents: EventItem[];
  userActualEvents: EventItem[];
  userPassedEvents: EventItem[];
  loading: boolean;
  error: string | null;
  selectedEvent: EventItem | null;
}

const initialState: EventsState = {
  actualEvents: [],
  passedEvents: [],
  userActualEvents: [],
  userPassedEvents: [],
  loading: false,
  error: null,
  selectedEvent: null,
};

export const fetchActualEvents = createAsyncThunk(
  'events/fetchActualEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/events/actual/');
      return res.data as EventItem[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Ошибка загрузки актуальных событий'
      );
    }
  }
);

export const fetchPassedEvents = createAsyncThunk(
  'events/fetchPassedEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/events/passed/');
      return res.data as EventItem[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Ошибка загрузки прошедших событий'
      );
    }
  }
);

export const fetchUserActualEvents = createAsyncThunk(
  'events/fetchUserActualEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/me/events/actual/');
      return res.data as EventItem[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки актуальных событий пользователя');
    }
  }
);

export const fetchUserPassedEvents = createAsyncThunk(
  'events/fetchUserPassedEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/me/events/passed/');
      return res.data as EventItem[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки прошедших событий пользователя');
    }
  }
);

export const toggleEventSignup = createAsyncThunk(
  'events/toggleEventSignup',
  async (eventId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { events: EventsState };
      
      const event = state.events.selectedEvent || 
                   [...state.events.actualEvents, ...state.events.passedEvents].find(e => e.id === eventId);
      
      if (!event) throw new Error("Событие не найдено");

      const enable = !event.user_signed_up;
      const res = await api.post(`/events/${eventId}/switch_signup/`, { enable });

      return { id: eventId, user_signed_up: enable, ...res.data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Ошибка записи на событие'
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/events/${eventId}/`);
      return res.data as EventItem;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Ошибка загрузки события'
      );
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents(state) {
      state.actualEvents = [];
      state.passedEvents = [];
      state.userActualEvents = [];
      state.userPassedEvents = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActualEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActualEvents.fulfilled, (state, action) => {
        state.actualEvents = action.payload;
        state.loading = false;
      })
      .addCase(fetchActualEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPassedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassedEvents.fulfilled, (state, action) => {
        state.passedEvents = action.payload;
        state.loading = false;
      })
      .addCase(fetchPassedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserActualEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActualEvents.fulfilled, (state, action) => {
        state.userActualEvents = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserActualEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserPassedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPassedEvents.fulfilled, (state, action) => {
        state.userPassedEvents = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPassedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(toggleEventSignup.fulfilled, (state, action) => {
        const { id, user_signed_up } = action.payload;

        const updateSignupStatus = (arr: EventItem[]) => {
          const event = arr.find(e => e.id === id);
          if (event) {
            event.user_signed_up = user_signed_up;
          }
        };

        const removeFromUserEvents = (arr: EventItem[]) => {
          return arr.filter(event => event.id !== id);
        };

        updateSignupStatus(state.actualEvents);
        updateSignupStatus(state.passedEvents);

        if (state.userActualEvents) {
          state.userActualEvents = removeFromUserEvents(state.userActualEvents);
        }
        
        if (state.userPassedEvents) {
          state.userPassedEvents = removeFromUserEvents(state.userPassedEvents);
        }

        if (state.selectedEvent && state.selectedEvent.id === id) {
          state.selectedEvent.user_signed_up = user_signed_up;
        }
      })
      .addCase(toggleEventSignup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
        state.loading = false;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
