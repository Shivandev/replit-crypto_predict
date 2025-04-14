import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { path: "/", icon: "fas fa-chart-line", label: "Dashboard" },
    { path: "/predictions", icon: "fas fa-robot", label: "AI Predictions" },
    { path: "/portfolio", icon: "fas fa-wallet", label: "Portfolio" },
    { path: "/community", icon: "fas fa-users", label: "Community" },
    { path: "/learn", icon: "fas fa-graduation-cap", label: "Learn" },
    { path: "/alerts", icon: "fas fa-bell", label: "Alerts" },
    { path: "/settings", icon: "fas fa-cog", label: "Settings" },
  ];

  return (
    <aside className="w-60 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed md:relative">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <div className="text-lg font-bold text-primary dark:text-primary">
          <i className="fas fa-brain mr-2"></i>Cryptedict
        </div>
      </div>
      
      {/* Nav Items */}
      <nav className="py-4">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center px-4 py-2 ${
              isActive(item.path)
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
          </Link>
        ))}
      </nav>
      
      {/* User Profile Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <img 
            className="h-8 w-8 rounded-full" 
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80&q=80" 
            alt="User profile" 
          />
          <div className="ml-3">
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
