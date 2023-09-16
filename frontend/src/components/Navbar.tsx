import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-green-500 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 md:p-2">
          <Link to="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white hover:-translate-y-1 transform transition duration-3">
              ASLTranslator</span>
          </Link>
          <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`w-full md:block p-2 md:p-0 md:w-auto ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-4 text-white md:bg-transparent md:text-white hover:bg-green-300 rounded-full"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link to="asl_translator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-4 text-white md:bg-transparent md:text-white hover:bg-green-300 rounded-full"
                >
                  ASL Translator
                </Link>
              </li>
              <li>
                <Link to="https://github.com/noahpro99/private-vt-hacks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-4 text-white md:bg-transparent md:text-white hover:bg-green-300 rounded-full"
                >
                  Repo
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav >
    </>
  );
}

export default Navbar;