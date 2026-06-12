import React from "react";
import Sidebar from "../Components/Sidebar.jsx";
import Navbar  from "../Components/Navbar.jsx";

// Tailwind-first layout (original styling) with AppShell navigation props
const PersonLayout = ({ children, currentPage, navigateTo, onLogout, pageTitle }) => {
  return (
    <div className="cs-app-layout min-h-screen flex text-gray-800">
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onLogout={onLogout}
          pageTitle={pageTitle}
          currentPage={currentPage}
          navigateTo={navigateTo}
        />

        <main className="cs-main-stage flex-1 px-4 md:px-6 py-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PersonLayout;
