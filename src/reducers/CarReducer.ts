import { Car } from "../models/Car.ts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import authService from "../reducers/AuthenticationService";
export const initialState: Car[] = [];

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
        baseURL: 'http://localhost:3000/car',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });
};

export const saveCar = createAsyncThunk(
    'car/saveCar',
    async(car: Car, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.post('/add', car);
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to save car');
        }
    }
);

export const getCar = createAsyncThunk(
    'car/getCars',
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
            return rejectWithValue(axiosError.response?.data || 'Failed to get cars');
        }
    }
);

export const deleteCar = createAsyncThunk(
    'car/deleteCar',
    async(id: number, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.delete(`/delete/${id}`);
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to delete car');
        }
    }
);

export const updateCar = createAsyncThunk(
    'car/updateCar',
    async(car: Car, { rejectWithValue }) => {
        try {
            return await securedApiCall(async () => {
                const api = createSecuredApi();
                const response = await api.put(`/update/${car.CarID}`, car);
                return response.data;
            });
        } catch(error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            return rejectWithValue(axiosError.response?.data || 'Failed to update car');
        }
    }
);

const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {
        clearCars: () => {
            return [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(saveCar.pending, (state, action) => {
                console.log("Save car pending");
            })
            .addCase(saveCar.fulfilled, (state, action) => {
                console.log("Save car fulfilled");
                state.push(action.payload);
            })
            .addCase(saveCar.rejected, (state, action) => {
                console.error('Save car rejected', action.payload);
            });
        builder
            .addCase(getCar.pending, (state, action) => {
                console.log("Get cars pending");
            })
            .addCase(getCar.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(getCar.rejected, (state, action) => {
                console.error('Get cars rejected', action.payload);
            });
        builder
            .addCase(updateCar.pending, (state, action) => {
                console.log("Update car pending");
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                return state.map((car: Car) =>
                    car.CarID === action.payload.CarID ? { ...car, ...action.payload } : car
                );
            })
            .addCase(updateCar.rejected, (state, action) => {
                console.error('Update car rejected', action.payload);
            });
        builder
            .addCase(deleteCar.pending, (state, action) => {
                console.log("Delete car pending");
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                return state.filter((car: Car) => car.CarID !== action.meta.arg);
            })
            .addCase(deleteCar.rejected, (state, action) => {
                console.error('Delete car rejected', action.payload);
            });
    }
});

export const { clearCars } = carSlice.actions;
export default carSlice.reducer;
