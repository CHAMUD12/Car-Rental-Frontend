import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Booking, { BookingDetails, CartItem, Customer } from "../models/Booking";
import { Car } from "../models/Car";
import authService from "../reducers/AuthenticationService";

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

const securedApiCall = async (apiCall: () => Promise<any>) => {
    try {
        return await apiCall();
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
            try {
                await authService.refreshToken();
                return await apiCall();
            } catch (refreshError) {
                authService.logout();
                throw refreshError;
            }
        }

        throw error;
    }
};

const createSecuredApi = () => {
    const token = localStorage.getItem('accessToken');

    return axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });
};

export const getBookings = createAsyncThunk(
    'booking/getBookings',
    async (_, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.get('/booking/view');
                return response.data;
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to fetch bookings');
        }
    }
);

export const getCustomers = createAsyncThunk(
    'booking/getCustomers',
    async (_, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.get('/customer/view');
                return response.data;
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to fetch customers');
        }
    }
);

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (booking: Booking, { dispatch, rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.post('/booking/add', booking);

                for (const detail of booking.BookingDetails) {
                    await api.put(`/car/update/${detail.CarID}`, { Availability: "Booked" });
                }

                dispatch({ type: 'car/getCars' });

                return response.data;
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to create booking');
        }
    }
);

export const getUserBookings = createAsyncThunk(
    'booking/getUserBookings',
    async (userId: string, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.get(`/booking/user/${userId}`);
                return response.data;
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to fetch user bookings');
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
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
                state.error = action.payload as string || "Failed to fetch bookings";
            })

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
                state.error = action.payload as string || "Failed to fetch customers";
            })

            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.push(action.payload);
                state.cart = [];
                state.loading = false;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create booking";
            })

            .addCase(getUserBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch your bookings";
            });
    }
});

export const { addToCart, removeFromCart, clearCart } = bookingSlice.actions;
export default bookingSlice.reducer;
