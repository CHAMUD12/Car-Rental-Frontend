import {configureStore} from "@reduxjs/toolkit";
import customerReducer from "../reducers/CustomerReducer";
import carReducer from "../reducers/CarReducer.ts";
import bookingReducer from "../reducers/BookingReducer.ts";

export const store = configureStore({
    reducer :{
        customer : customerReducer,
        car : carReducer,
        booking : bookingReducer
    }
})

export type AppDispatch = typeof store.dispatch;