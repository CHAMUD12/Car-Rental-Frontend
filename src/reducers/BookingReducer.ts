import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Booking, { BookingDetails, CartItem, Customer } from "../models/Booking";
import { Car } from "../models/Car";

interface BookingState {
    bookings: Booking[];
    customers: Customer[];
    cart: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    customers: [],
    cart: [],
    loading: false,
    error: null
};

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// Thunks for API calls
export const getBookings = createAsyncThunk(
    'booking/getBookings',
    async () => {
        try {
            const response = await api.get('/booking/view');
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const getCustomers = createAsyncThunk(
    'booking/getCustomers',
    async () => {
        try {
            const response = await api.get('/customer/view');
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (booking: Booking, { dispatch }) => {
        try {
            const response = await api.post('/booking/add', booking);

            // Update all cars in the booking to "Booked"
            for (const detail of booking.BookingDetails) {
                await api.put(`/car/update/${detail.CarID}`, { Availability: "Booked" });
            }

            // Refresh car list after updating
            dispatch({ type: 'car/getCars' });

            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            // Check if car is already in cart
            const exists = state.cart.find(item => item.CarID === action.payload.CarID);
            if (!exists) {
                state.cart.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.cart = state.cart.filter(item => item.CarID !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Bookings
            .addCase(getBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch bookings";
            })

            // Get Customers
            .addCase(getCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.customers = action.payload;
                state.loading = false;
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch customers";
            })

            // Create Booking
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.push(action.payload);
                state.cart = []; // Clear cart after successful booking
                state.loading = false;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create booking";
            });
    }
});

export const { addToCart, removeFromCart, clearCart } = bookingSlice.actions;
export default bookingSlice.reducer;