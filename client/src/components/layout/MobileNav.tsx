import { Link, useLocation } from "wouter";

interface MobileNavProps {
  closeMobileMenu?: () => void;
}

export default function MobileNav({ closeMobileMenu }: MobileNavProps = {}) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleNavClick = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const navItems = [
    { path: "/", icon: "fas fa-chart-line", label: "Dashboard" },
    { path: "/predictions", icon: "fas fa-robot", label: "AI" },
    { path: "/portfolio", icon: "fas fa-wallet", label: "Portfolio" },
    { path: "/community", icon: "fas fa-users", label: "Community" },
    { path: "/more", icon: "fas fa-bars", label: "More" },
  ];

  // Mobile Menu Items (shown when menu button is clicked)
  if (closeMobileMenu) {
    return (
      <>
        <Link 
          href="/"
          className={`flex items-center px-4 py-2 ${isActive("/") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-chart-line mr-3"></i>
          Dashboard
        </Link>
        <Link 
          href="/predictions"
          className={`flex items-center px-4 py-2 ${isActive("/predictions") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-robot mr-3"></i>
          AI Predictions
        </Link>
        <Link 
          href="/portfolio"
          className={`flex items-center px-4 py-2 ${isActive("/portfolio") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-wallet mr-3"></i>
          Portfolio
        </Link>
        <Link 
          href="/community"
          className={`flex items-center px-4 py-2 ${isActive("/community") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-users mr-3"></i>
          Community
        </Link>
        <Link 
          href="/learn"
          className={`flex items-center px-4 py-2 ${isActive("/learn") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-graduation-cap mr-3"></i>
          Learn
        </Link>
        <Link 
          href="/alerts"
          className={`flex items-center px-4 py-2 ${isActive("/alerts") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-bell mr-3"></i>
          Alerts
        </Link>
        <Link 
          href="/settings"
          className={`flex items-center px-4 py-2 ${isActive("/settings") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          <i className="fas fa-cog mr-3"></i>
          Settings
        </Link>
      </>
    );
  }

  // Mobile Bottom Navigation
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex flex-col items-center justify-center ${
              isActive(item.path)
                ? "text-primary dark:text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
