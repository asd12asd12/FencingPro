import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any | null;
  setUser: (user: any) => void; // Добавляем это
  jwt: string | null;
  theme: string;
  login: (data: { jwt: string; user: any }) => void;
  signIn: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  setTheme: (theme: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [theme, setThemeState] = useState("Светлая тема");

  useEffect(() => {
    const savedJwt = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedTheme = localStorage.getItem("currentThemeName");

    if (savedJwt && savedUser) {
      setJwt(savedJwt);
      setUser(JSON.parse(savedUser));
    }
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  // Функция для сохранения данных (уже есть у тебя)
  const login = (data: { jwt: string; user: any }) => {
    localStorage.setItem("token", data.jwt); // Ключ "token"
    localStorage.setItem("user", JSON.stringify(data.user));
    setJwt(data.jwt);
    setUser(data.user);
  };

  // НОВАЯ ФУНКЦИЯ: Сама идет на сервер Strapi
  const signIn = async (identifier: string, password: string) => {
    const res = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (res.ok && data.jwt) {
      login({ jwt: data.jwt, user: data.user });
    } else {
      throw new Error(data.error?.message || "Ошибка входа");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setJwt(null);
    setUser(null);
    window.location.href = "/";
  };

  const setTheme = (name: string) => {
    localStorage.setItem("currentThemeName", name);
    setThemeState(name);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, jwt, theme, login, signIn, logout, setTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
