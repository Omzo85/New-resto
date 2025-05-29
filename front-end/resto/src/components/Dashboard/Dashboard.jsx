import { NavLink, Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-800 p-6">
        <h1 className="text-white text-xl font-bold mb-8">Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `block p-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Profil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `block p-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Paramètres
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;