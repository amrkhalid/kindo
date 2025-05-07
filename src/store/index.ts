import { configureStore, combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  // Add other reducers here as needed
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 