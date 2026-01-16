// src/routes/__root.tsx
import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { Theme } from "../shared/types/Themes";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Хук используется ВНУТРИ компонента - это правильно
  const { theme } = useAuth();
  
  const currentTheme = React.useMemo(() => 
    Theme.find((t) => t.name === theme)?.config || Theme[0].config, 
  [theme]);

  return (
    <div className={`min-h-screen ${currentTheme.mainContentBg} ${currentTheme.mainContentText} transition-colors duration-300`}>
      <Outlet />
    </div>
  );
}