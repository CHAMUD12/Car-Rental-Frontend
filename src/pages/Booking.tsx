import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getBookings, getCustomers, createBooking, addToCart, removeFromCart, clearCart } from "../reducers/BookingReducer";
import { getCar, updateCar } from "../reducers/CarReducer";
import Booking, { BookingDetails, CartItem } from "../models/Booking";
import { PlusCircle, Trash2, ShoppingCart, CheckCircle, XCircle } from "react-feather";

function BookingPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { customers, cart, loading, error } = useSelector((state: RootState) => state.booking);
    const cars = useSelector((state: RootState) => state.car);

    const [customerID, setCustomerID] = useState<number | "">("");
    const [customerName, setCustomerName] = useState("");
    const [carID, setCarID] = useState<number | "">("");
    const [selectedCar, setSelectedCar] = useState<any>(null);
    const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const totalAmount = cart.reduce((sum, item) => sum + item.Price, 0);

    useEffect(() => {
        dispatch(getCustomers());
        dispatch(getCar());
        dispatch(getBookings());
    }, [dispatch]);

    useEffect(() => {
        if (customerID) {
            const customer = customers.find(c => c.CustomerID === +customerID);
            if (customer) {
                setCustomerName(customer.Name);
            } else {
                setCustomerName("");
            }
        } else {
            setCustomerName("");
        }
    }, [customerID, customers]);

    useEffect(() => {
        if (carID) {
            const car = cars.find(c => c.CarID === +carID);
            if (car) {
                setSelectedCar(car);
            } else {
                setSelectedCar(null);
            }
        } else {
            setSelectedCar(null);
        }
    }, [carID, cars]);

    const handleAddToCart = () => {
        if (!carID || !selectedCar) {
            alert("Please select a car first!");
            return;
        }

        if (selectedCar.Availability !== "Available") {
            alert("This car is not available for booking!");
            return;
        }

        const cartItem = new CartItem(
            selectedCar.CarID,
            selectedCar.LicensePlateNum,
            selectedCar.Type,
            selectedCar.Brand,
            selectedCar.Price
        );

        dispatch(addToCart(cartItem));
        setCarID("");
        setSelectedCar(null);
    };

    const handleRemoveFromCart = (carId: number) => {
        dispatch(removeFromCart(carId));
    };

    const handleCreateBooking = () => {
        if (!customerID) {
            alert("Please select a customer!");
            return;
        }

        if (cart.length === 0) {
            alert("Please add at least one car to your booking!");
            return;
        }

        const newBooking: Booking = {
            BookingID: 0,
            CustomerID: +customerID,
            BookingDate: new Date(bookingDate),
            BookingDetails: cart.map(item => ({
                BookingDetailsID: 0,
                BookingID: 0,
                CarID: item.CarID,
                Price: item.Price
            })),
            TotalAmount: totalAmount
        };

        dispatch(createBooking(newBooking))
            .unwrap()
            .then(() => {
                cart.forEach(item => {
                    const carToUpdate = cars.find(c => c.CarID === item.CarID);
                    if (carToUpdate) {
                        const updatedCar = { ...carToUpdate, Availability: "Booked" };
                        dispatch(updateCar(updatedCar));
                    }
                });

                alert("Booking created successfully!");
                resetForm();
            })
            .catch(err => {
                alert(`Error creating booking: ${err.message}`);
            });
    };

    const resetForm = () => {
        setCustomerID("");
        setCustomerName("");
        setCarID("");
        setSelectedCar(null);
        setBookingDate(new Date().toISOString().split('T')[0]);
        dispatch(clearCart());
    };

    const availableCars = cars.filter(car => car.Availability === "Available");

    return (
        <div className="p-6 bg-rose-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-rose-400">Car Booking System</h1>

            <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer
                        </label>
                        <select
                            value={customerID}
                            onChange={(e) => setCustomerID(e.target.value ? +e.target.value : "")}
                            className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 w-full"
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer.CustomerID} value={customer.CustomerID}>
                                    {customer.CustomerID} - {customer.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            value={customerName}
                            readOnly
                            className="p-3 bg-gray-100 rounded-lg shadow-sm w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Booking Date
                        </label>
                        <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 w-full"
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                    <h3 className="text-lg font-medium mb-3">Add Cars to Booking</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Available Cars
                            </label>
                            <select
                                value={carID}
                                onChange={(e) => setCarID(e.target.value ? +e.target.value : "")}
                                className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 w-full"
                            >
                                <option value="">Select Car</option>
                                {availableCars.map((car) => (
                                    <option key={car.CarID} value={car.CarID}>
                                        {car.CarID} - {car.Brand} ({car.LicensePlateNum})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedCar && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Car Details
                                    </label>
                                    <div className="p-3 bg-gray-100 rounded-lg shadow-sm">
                                        <p>{selectedCar.Brand} {selectedCar.Type}</p>
                                        <p>Plate: {selectedCar.LicensePlateNum}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <div className="p-3 bg-gray-100 rounded-lg shadow-sm">
                                        ${selectedCar.Price}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedCar || selectedCar.Availability !== "Available"}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-rose-600 disabled:bg-gray-400"
                    >
                        <PlusCircle size={18} /> Add to Cart
                    </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <ShoppingCart size={20} /> Cart Items ({cart.length})
                    </h3>

                    {cart.length === 0 ? (
                        <p className="text-gray-500 italic">No cars added to booking yet.</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {cart.map((item) => (
                                        <tr key={item.CarID}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.CarID}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.LicensePlateNum}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.Brand}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.Type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${item.Price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.CarID)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-right font-bold">Total:</td>
                                        <td className="px-6 py-4 font-bold">${totalAmount}</td>
                                        <td></td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="mt-4 flex gap-4">
                                <button
                                    onClick={handleCreateBooking}
                                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-800"
                                >
                                    <CheckCircle size={18} /> Confirm Booking
                                </button>

                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-rose-600"
                                >
                                    <XCircle size={18} /> Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {loading && <p className="text-rose-500 font-medium">Loading...</p>}
            {error && <p className="text-red-500 font-medium">Error: {error}</p>}
        </div>
    );
}

export default BookingPage;