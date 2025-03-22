import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Car } from "../models/Car.ts";

export const initialState: Car[] = [];

const api = axios.create({
    baseURL: 'http://localhost:3000/car'
});

export const saveCar = createAsyncThunk(
    'car/saveCar',
    async (car: Car) => {
        try {
            const response = await api.post('/add', car);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const getCar = createAsyncThunk(
    'car/getCars',
    async () => {
        try {
            const response = await api.get('/view');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const deleteCar = createAsyncThunk(
    'car/deleteCar',
    async (id: number) => {
        try {
            const response = await api.delete(`/delete/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const updateCar = createAsyncThunk(
    'car/updateCar',
    async (car: Car) => {
        try {
            const response = await api.put(`/update/${car.CarID}`, car);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(saveCar.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(getCar.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                return state.map((car: Car) =>
                    car.CarID === action.payload.CarID ? { ...car, ...action.payload } : car
                );
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                return state.filter((car: Car) => car.CarID !== action.meta.arg);
            });
    }
});

export default carSlice.reducer;
