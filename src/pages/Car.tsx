import React, { useEffect, useState } from "react";
import { deleteCar, getCar, saveCar, updateCar } from "../reducers/CarReducer.ts";
import { AppDispatch } from "../store/store.tsx";
import { Car as CarModel } from "../models/Car.ts";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, PlusCircle, Edit2, Search, XCircle } from "react-feather";

function Car() {
    const dispatch = useDispatch<AppDispatch>();
    const cars = useSelector((state) => state.car);

    useEffect(() => {
        if (cars.length === 0) {
            dispatch(getCar());
        }
    }, [dispatch, cars.length]);

    useEffect(() => {
        if (cars.length > 0) {
            const maxId = Math.max(...cars.map((car) => Number(car.CarID)));
            setCarID(String(maxId + 1));
        } else {
            setCarID("1");
        }
    }, [cars]);

    const [carID, setCarID] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
    const [availability, setAvailability] = useState("");
    const [price, setPrice] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const types = ["Sedan", "SUV", "Couple", "Wagon","Crossover","Sports car"];
    const brands = ["Toyota", "Ford", "Honda", "BMW","Audi","GMC"];
    const availabilities = ["Available", "Not Available", "Booked"];

    function handleAdd() {
        if (!carID || !licensePlate || !type || !brand || !availability || !price) {
            alert("All fields are required!");
            return;
        }
        const newCar = new CarModel(Number(carID), licensePlate, type, brand, availability, Number(price));
        dispatch(saveCar(newCar));
        resetForm();
    }

    function handleEdit(car) {
        setCarID(car.CarID);
        setLicensePlate(car.LicensePlateNum);
        setType(car.Type);
        setBrand(car.Brand);
        setAvailability(car.Availability);
        setPrice(car.Price);
        setIsEditing(true);
    }

    function handleUpdate() {
        if (!carID || !licensePlate || !type || !brand || !availability || !price) {
            alert("All fields are required!");
            return;
        }
        const updatedCar = new CarModel(Number(carID), licensePlate, type, brand, availability, Number(price));
        dispatch(updateCar(updatedCar));
        resetForm();
    }

    function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this car?")) {
            dispatch(deleteCar(id));
        }
    }

    function handleSearch(event) {
        if (event.key === "Enter" && carID) {
            const foundCar = cars.find((car) => car.CarID === Number(carID));
            if (foundCar) {
                handleEdit(foundCar);
            } else {
                alert("Car not found!");
            }
        }
    }

    function resetForm() {
        setCarID("");
        setLicensePlate("");
        setType("");
        setBrand("");
        setAvailability("");
        setPrice("");
        setIsEditing(false);
    }

    return (
        <div className="p-6 bg-rose-100 min-h-screen">
            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-xl">
                <input
                    type="text"
                    placeholder="Search Car ID"
                    value={carID}
                    onChange={(e) => setCarID(e.target.value)}
                    onKeyDown={handleSearch}
                    className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-600">
                    <XCircle size={18} /> Clear
                </button>
                <input
                    type="text"
                    placeholder="License Plate"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                    <option value="">Select Type</option>
                    {types.map((typeOption, index) => (
                        <option key={index} value={typeOption}>
                            {typeOption}
                        </option>
                    ))}
                </select>
                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                    <option value="">Select Brand</option>
                    {brands.map((brandOption, index) => (
                        <option key={index} value={brandOption}>
                            {brandOption}
                        </option>
                    ))}
                </select>
                <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                    <option value="">Select Availability</option>
                    {availabilities.map((availabilityOption, index) => (
                        <option key={index} value={availabilityOption}>
                            {availabilityOption}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={handleAdd} className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-rose-600">
                    <PlusCircle size={18} /> Add
                </button>
                {isEditing && (
                    <button onClick={handleUpdate} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-800">
                        <Edit2 size={18} /> Update
                    </button>
                )}
            </div>
            <div className="mt-6 grid grid-cols-6 gap-3">
                {cars.map((car) => (
                    <div key={car.CarID} className="bg-white p-4 rounded-xl shadow-lg w-48 h-56 relative">
                        <h3 className="text-lg font-bold text-black mb-2">{car.Brand}</h3>
                        <p className="text-gray-700">Plate: {car.LicensePlateNum}</p>
                        <p className="text-gray-700">Type: {car.Type}</p>
                        <p className="text-gray-700">Price: ${car.Price}</p>
                        <p className="text-gray-700">Status: {car.Availability}</p>
                        <button onClick={() => handleDelete(car.CarID)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                        </button>
                        <button onClick={() => handleEdit(car)} className="mt-4 bg-black text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-800">
                            <Edit2 size={16} /> Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Car;
