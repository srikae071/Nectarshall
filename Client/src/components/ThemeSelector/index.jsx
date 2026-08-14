import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function ThemeSelector() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "regular";
  });

  const applyTheme = (targetTheme) => {
    if (targetTheme === "green") {
      document.documentElement.setAttribute("data-theme", "green");
      document.body.classList.add("theme-green");
      document.body.classList.remove("theme-white");
    } else if (targetTheme === "white") {
      document.documentElement.setAttribute("data-theme", "white");
      document.body.classList.add("theme-white");
      document.body.classList.remove("theme-green");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("theme-green", "theme-white");
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleChange = (e) => {
    const val = e.target.value;
    setTheme(val);
    localStorage.setItem("app_theme", val);
    applyTheme(val);
  };

  return (
    <div className="themeSelectContainer" style={{ display: "inline-flex", alignItems: "center", margin: "0 8px" }}>
      <select
        value={theme}
        onChange={handleChange}
        style={{
          padding: "5px 12px",
          borderRadius: "20px",
          border: "1.5px solid #0284c7",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          backgroundColor: "#ffffff",
          color: "#0284c7",
          outline: "none",
          boxShadow: "0 2px 4px rgba(2, 132, 199, 0.15)",
          transition: "all 0.2s ease",
        }}
      >
        <option value="regular">Regular</option>
        <option value="green">Green</option>
        <option value="white">White</option>
      </select>
    </div>
  );
}

export default ThemeSelector;
