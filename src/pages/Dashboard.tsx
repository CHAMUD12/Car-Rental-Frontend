import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getBookings } from "../reducers/BookingReducer";
import { getCar } from "../reducers/CarReducer";
import { getCustomers } from "../reducers/BookingReducer";
import { Calendar, User, ShoppingBag, Package, DollarSign } from "react-feather";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { bookings, customers } = useSelector((state: RootState) => state.booking);
    const cars = useSelector((state: RootState) => state.car);

    useEffect(() => {
        dispatch(getBookings());
        dispatch(getCar());
        dispatch(getCustomers());
    }, [dispatch]);

    const getCustomerName = (customerId: number) => {
        const customer = customers.find(c => c.CustomerID === customerId);
        return customer ? customer.Name : "Unknown Customer";
    };

    const getCarDetails = (carId: number) => {
        const car = cars.find(c => c.CarID === carId);
        return car ? car : null;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6 bg-rose-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-rose-500">Bookings Dashboard</h1>
                <div className="bg-rose-500 text-white px-4 py-2 rounded-lg shadow-md">
                    <span className="font-bold">{bookings.length}</span> Total Bookings
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-xl text-center">
                    <ShoppingBag size={48} className="mx-auto text-rose-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Bookings Yet</h2>
                    <p className="text-gray-500">Your bookings will appear here once created.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.BookingID} className="bg-white rounded-xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
                            <div className="bg-rose-400 p-4 text-white">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Booking #{booking.BookingID}</h2>
                                    <div className="bg-black bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                        LKR {booking.TotalAmount}
                                    </div>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{formatDate(booking.BookingDate.toString())}</span>
                                </div>
                            </div>

                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <User size={18} className="text-rose-400 mr-2" />
                                    <h3 className="font-semibold text-gray-700">
                                        {getCustomerName(booking.CustomerID)}
                                    </h3>
                                </div>
                                <div className="text-sm text-gray-500 ml-6">
                                    Customer ID: {booking.CustomerID}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                    <Package size={18} className="text-rose-400 mr-2" />
                                    Booked Cars ({booking.BookingDetails.length})
                                </h3>

                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {booking.BookingDetails.map((detail) => {
                                        const car = getCarDetails(detail.CarID);
                                        return (
                                            <div key={detail.BookingDetailsID} className="bg-rose-50 p-3 rounded-lg">
                                                <div className="font-medium">{car?.Brand} {car?.Type}</div>
                                                <div className="text-sm text-gray-600">
                                                    {car?.LicensePlateNum}
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-sm text-gray-500">Car ID: {detail.CarID}</span>
                                                    <span className="flex items-center text-rose-600 font-semibold">
                                                        <DollarSign size={14} />
                                                        LKR {detail.Price}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}