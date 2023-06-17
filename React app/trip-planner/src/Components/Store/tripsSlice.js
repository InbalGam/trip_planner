import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const tripsSlice = createSlice({
    name: 'trips',
    initialState: {
        trips: [],
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: {
        // [loadTrips.pending]: (state, action) => {
        //     state.isLoading = true;
        //     state.hasError = false;
        // },
        // [loadTrips.fulfilled]: (state, action) => {
        //     const data = fetchData(action.payload);
        //     state.posts = data;
        //     state.subReddit = action.payload.term;
        //     state.type = action.payload.type;
        //     state.isLoading = false;
        //     state.hasError = false;
        // },
        // [loadTrips.rejected]: (state, action) => {
        //     state.isLoading = false;
        //     state.hasError = true;
        // }
    }
});

export const selectTrips = state => state.trips.trips;
export const { fetchTrips } = tripsSlice.actions;
export default tripsSlice.reducer;