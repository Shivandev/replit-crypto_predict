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
          className={`block px-3 py-2 rounded-md ${isActive("/") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          Dashboard
        </Link>
        <Link 
          href="/predictions"
          className={`block px-3 py-2 rounded-md ${isActive("/predictions") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          AI Predictions
        </Link>
        <Link 
          href="/portfolio"
          className={`block px-3 py-2 rounded-md ${isActive("/portfolio") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          Portfolio
        </Link>
        <Link 
          href="/community"
          className={`block px-3 py-2 rounded-md ${isActive("/community") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          Community
        </Link>
        <Link 
          href="/learn"
          className={`block px-3 py-2 rounded-md ${isActive("/learn") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          Learn
        </Link>
        <Link 
          href="/alerts"
          className={`block px-3 py-2 rounded-md ${isActive("/alerts") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
          Alerts
        </Link>
        <Link 
          href="/settings"
          className={`block px-3 py-2 rounded-md ${isActive("/settings") ? "bg-primary bg-opacity-10 text-primary dark:text-primary" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}`}
          onClick={handleNavClick}
        >
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
