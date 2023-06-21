import { configureStore } from "@reduxjs/toolkit";
import tripsReducer from './tripsSlice';
import activityReducer from './activitySlice';

export default configureStore({
  reducer: {
    trips: tripsReducer,
    activities: activityReducer
  },
});
