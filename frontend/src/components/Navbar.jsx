import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const navItems = [
        { name: 'Single Report', path: '/report' },
        { name: 'Bulk Upload', path: '/upload' },
        { name: 'Admin Dashboard', path: '/dashboard' },
    ];

    return (
        <header className="bg-[#96483C] shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="text-xl font-bold text-gray-1000">
                    Impact Tracker
                </div>
                <nav>
                    <ul className="flex space-x-2 sm:space-x-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `font-medium transition duration-150 ease-in-out ${
                                            isActive
                                                ? 'text-gray-1000 border-b-2 border-white-600 py-1 text-xs sm:text-sm'
                                                : 'text-gray-700 hover:text-gray-900 text-xs sm:text-sm'
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