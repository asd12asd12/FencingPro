import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { theme, setTheme } = useAuth();
  
  // Определяем, какой логотип показывать
  const logoSrc = theme === "Тёмная тема" ? "/log.png" : "/Logo.png";

  return (
    <header className="flex items-center justify-between p-4 border-b transition-colors duration-300">
      <div className="flex items-center gap-4">
        <img src={logoSrc} alt="Fencing Logo" className="h-12 w-auto" />
        <h1 className="text-xl font-bold">Fencing Calculator</h1>
      </div>

      <button
        onClick={() => setTheme(theme === "Светлая тема" ? "Тёмная тема" : "Светлая тема")}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-all"
      >
        {theme === "Светлая тема" ? "🌙 Ночь" : "☀️ День"}
      </button>
    </header>
  );
};

export default Header;