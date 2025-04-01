import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { RootLayout } from "./components/RootLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Customer from "./pages/Customer.tsx";
import Car from "./pages/Car.tsx";
import Booking from "./pages/Booking.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/signin" />;
    }

    return children;
};

function App() {
    const routes = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            children: [
                {
                    index: true,
                    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
                },
                {
                    path: "customer",
                    element: <ProtectedRoute><Customer /></ProtectedRoute>
                },
                {
                    path: "car",
                    element: <ProtectedRoute><Car /></ProtectedRoute>
                },
                {
                    path: "booking",
                    element: <ProtectedRoute><Booking /></ProtectedRoute>
                },
                { path: "signin", element: <SignIn /> },
                { path: "signup", element: <SignUp /> }
            ]
        }
    ]);

    return (
        <>
            <RouterProvider router={routes} />
        </>
    )
}

export default App
