import { Customers } from "../models/Customers.ts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import authService from "../reducers/AuthenticationService";
export const initialState: Customers[] = [];

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
        baseURL: 'http://localhost:3000/customer',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });
};

export const saveCustomer = createAsyncThunk(
    'customer/saveCustomer',
    async(customer: Customers, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.post('/add', customer);
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to save customer');
        }
    }
);

export const getCustomer = createAsyncThunk(
    'customer/getCustomer',
    async(_, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.get('/view');
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to get customers');
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async(id: string, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.delete(`/delete/${id}`);
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to delete customer');
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customer/updateCustomer',
    async(customer: Customers, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.put(`/update/${customer.CustomerID}`, customer);
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to update customer');
        }
    }
);

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        clearCustomers: () => {
            return [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(saveCustomer.pending, (state, action) => {
                console.log("Save customer pending");
            })
            .addCase(saveCustomer.fulfilled, (state, action) => {
                console.log("Save customer fulfilled");
                state.push(action.payload);
            })
            .addCase(saveCustomer.rejected, (state, action) => {
                console.error('Save customer rejected', action.payload);
            });
        builder
            .addCase(getCustomer.pending, (state, action) => {
                console.log("Get customer pending");
            })
            .addCase(getCustomer.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(getCustomer.rejected, (state, action) => {
                console.error('Get customer rejected', action.payload);
            });
        builder
            .addCase(updateCustomer.pending, (state, action) => {
                console.log("Update customer pending");
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                return state.map((customer: Customers) =>
                    customer.CustomerID === action.payload.CustomerID ? { ...customer, ...action.payload } : customer
                );
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                console.error('Update customer rejected', action.payload);
            });
        builder
            .addCase(deleteCustomer.pending, (state, action) => {
                console.log("Delete customer pending");
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                return state.filter((customer: Customers) => customer.CustomerID !== action.meta.arg);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                console.error('Delete customer rejected', action.payload);
            });
    }
});

export const { clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;
