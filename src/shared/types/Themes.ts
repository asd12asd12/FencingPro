// src/shared/types/Themes.ts (или соответствующий файл)

export interface MainThemes {

  sidebarBg: string;
  sidebarText: string;
  mainContentBg: string;
  mainContentText: string;
  mainContentBorder: string;
  buttonBg: string;
  buttonHoverBg: string;
  buttonTextColor: string;
  priceColor: string;
  //Категории
  CategoryButtonText: string;
  CategoryButtonBg: string;
  CategoryText: string;
  CategoryBg: string;
  accentColor: string;          // <--- ДОБАВЛЕНО
  checkboxBorderColor: string;  // <--- ДОБАВЛЕНО
  checkboxBg: string;           // <--- ДОБАВЛЕНО
}

export const Theme = [
  {
    name: "Светлая тема",
    config: {
      sidebarBg: "bg-white",
      sidebarText: "text-gray-800",
      mainContentBg: "bg-gray-50",
      mainContentText: "text-gray-900",
      mainContentBorder: "border-black",
      buttonBg: "bg-green-500",
      buttonHoverBg: "hover:bg-green-600",
      buttonTextColor: "text-white",
      priceColor: "text-emerald-600",
      CategoryButtonText: "",
      CategoryButtonBg: "",
      CategoryText: "text-black",
      CategoryBg: "bg-blue-500",
      accentColor: "#3b82f6", // Пример акцентного цвета для светлой темы (Tailwind blue-500)
      checkboxBorderColor: "border-gray-300", // Цвет рамки чекбокса
      checkboxBg: "bg-white", // Цвет фона чекбокса
    },
  },
  {
    name: "Тёмная тема",
    config: {
      sidebarBg: "bg-gray-900",
      sidebarText: "text-gray-200",
      mainContentBg: "bg-gray-800",
      mainContentText: "text-gray-100",
      mainContentBorder: "border-white",
      buttonBg: "bg-green-700",
      buttonHoverBg: "hover:bg-green-800",
      buttonTextColor: "text-white",
      priceColor: "text-emerald-400",
      CategoryButtonText: "text-white",
      CategoryButtonBg: "bg-gray-950",
      CategoryText: "text-white",
      CategoryBg: "bg-gray-950",
      accentColor: "#82e9de",
      checkboxBorderColor: "border-gray-600", 
      checkboxBg: "bg-gray-700",
    }
  }
];