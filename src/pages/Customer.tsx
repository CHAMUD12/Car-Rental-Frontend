import React, { useEffect, useState } from "react";
import { deleteCustomer, getCustomer, saveCustomer, updateCustomer } from "../reducers/CustomerReducer.ts";
import { AppDispatch } from "../store/store.tsx";
import { Customers } from "../models/Customers.ts";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, PlusCircle, Edit2 } from "react-feather";

function Customer() {
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state) => state.customer);

  useEffect(() => {
    if (customers.length === 0) {
      dispatch(getCustomer());
    }
  }, [dispatch, customers.length]);

  useEffect(() => {
    if (customers.length > 0) {
      const maxId = Math.max(...customers.map((customer) => Number(customer.CustomerID)));
      setId(String(maxId + 1));
    } else {
      setId("1");
    }
  }, [customers]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  function handleAdd() {
    if (!id || !name || !email || !address || !phone) {
      alert("All fields are required!");
      return;
    }
    const newCustomer = new Customers(id, name, email, address, phone);
    dispatch(saveCustomer(newCustomer));
    resetForm();
  }

  const handleEdit = (customer) => {
    setId(customer.CustomerID);
    setName(customer.Name);
    setEmail(customer.Email);
    setAddress(customer.Address);
    setPhone(customer.Phone);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (!id || !name || !email || !address || !phone) {
      alert("All fields are required!");
      return;
    }
    const updatedCustomer = new Customers(id, name, email, address, phone);
    dispatch(updateCustomer(updatedCustomer));
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      dispatch(deleteCustomer(id));
    }
  };

  const resetForm = () => {
    setId("");
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setIsEditing(false);
  };

  return (
      <div className="p-6 bg-rose-100 min-h-screen">
        <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-xl">
          {[{ placeholder: "Customer ID", value: id, setter: setId },
            { placeholder: "Name", value: name, setter: setName },
            { placeholder: "Email", value: email, setter: setEmail },
            { placeholder: "Address", value: address, setter: setAddress },
            { placeholder: "Phone", value: phone, setter: setPhone }].map((field, index) => (
              <input
                  key={index}
                  type="text"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
          ))}
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
        <div className="mt-6 grid grid-cols-3 gap-6">
          {customers.map((customer) => (
              <div key={customer.CustomerID} className="bg-white p-6 rounded-xl shadow-lg relative">
                <h3 className="text-xl font-bold text-black mb-2">{customer.Name}</h3>
                <p className="text-gray-700">Email: {customer.Email}</p>
                <p className="text-gray-700">Address: {customer.Address}</p>
                <p className="text-gray-700">Phone: {customer.Phone}</p>
                <button onClick={() => handleDelete(customer.CustomerID)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => handleEdit(customer)} className="mt-4 bg-black text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-800">
                  <Edit2 size={16} /> Edit
                </button>
              </div>
          ))}
        </div>
      </div>
  );
}

export default Customer;
