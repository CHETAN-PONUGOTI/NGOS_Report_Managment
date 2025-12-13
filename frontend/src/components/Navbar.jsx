import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const navItems = [
        { name: 'Single Report', path: '/report' },
        { name: 'Bulk Upload', path: '/upload' },
        { name: 'Admin Dashboard', path: '/dashboard' },
    ];

    return (
        <header className="bg-[#753A2F] shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="text-sm lg:text-3xl font-bold text-black-800">
                    Impact Tracker
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `font-medium transition duration-150 ease-in-out ${
                                            isActive
                                                ? 'text-black-600 border-b-2 border-black-600 py-1'
                                                : 'text-[#1C1313]-500 hover:text-black-600'
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;