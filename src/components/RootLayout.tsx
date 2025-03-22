import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar.tsx";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";

export function RootLayout() {
    const location = useLocation();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const routeTitles: Record<string, string> = {
        "/": "HOME",
        "/customer": "WELCOME TO CUSTOMER MANAGE",
        "/car": "WELCOME TO CAR MANAGE",
        "/booking": "WELCOME TO BOOKING MANAGE",
    };

    const title = routeTitles[location?.pathname] || "Shop";

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-300">
                <header className="bg-white text-black p-4 flex items-center shadow-md">
                    <h1 className="text-xl font-semibold text-rose-500 drop-shadow-[1px_1px_2px_white]">
                        {title}
                    </h1>
                    <span className="ml-auto text-sm text-rose-500 drop-shadow-[1px_1px_2px_white]">
            {dateTime.toLocaleString()}
          </span>
                </header>
                <main className="p-4 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
