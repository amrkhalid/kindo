import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  stats: {
    activeKindergartens: number;
    totalChildren: number;
    totalTeachers: number;
    totalClasses: number;
    monthlyGrowth: string;
    attendanceRate: string;
    totalPayments: number;
    averageAttendance: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    activeKindergartens: 12,
    totalChildren: 245,
    totalTeachers: 45,
    totalClasses: 24,
    monthlyGrowth: '+15%',
    attendanceRate: '95%',
    totalPayments: 52500,
    averageAttendance: '92%'
  },
  isLoading: false,
  error: null
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardState['stats']>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setStats, setLoading, setError } = dashboardSlice.actions;

export default dashboardSlice.reducer; 