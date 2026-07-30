import React, { useState, useEffect } from "react";

function ThemeSelector() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "regular";
  });

  const applyTheme = (targetTheme) => {
    if (targetTheme === "green") {
      document.documentElement.setAttribute("data-theme", "green");
      document.body.classList.add("theme-green");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("theme-green");
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
          border: "1.5px solid #008075",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          backgroundColor: "#ffffff",
          color: "#008075",
          outline: "none",
          boxShadow: "0 2px 4px rgba(0, 128, 117, 0.15)",
          transition: "all 0.2s ease",
        }}
      >
        <option value="regular">Regular</option>
        <option value="green">Green</option>
      </select>
    </div>
  );
}

export default ThemeSelector;
