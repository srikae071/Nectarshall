import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const USER_CREDENTIALS = {
  sumith: {
    username: "Sumith",
    passwordMatches: [
      "ENHANCE123",
      "Enhance123",
      "enhance123",
      "ENHANCE 123",
      "ENHANCE",
    ],
    role: "ADMIN",
    displayName: "Sumith (Admin)",
    allowedModules: ["ALL"],
  },
  srikar: {
    username: "Srikar",
    passwordMatches: [
      "ENHANCE123",
      "Enhance123",
      "enhance123",
      "ENHANCE 123",
      "ENHANCE",
    ],
    role: "HRMS",
    displayName: "Srikar (HRMS)",
    allowedModules: ["HRMS", "MY_TASK", "MY_TICKETS"],
  },
  karan: {
    username: "Karan",
    passwordMatches: [
      "ENHANCE123",
      "Enhance123",
      "enhance123",
      "ENHANCE 123",
      "ENHANCE",
    ],
    role: "IT_OPERATIONS",
    displayName: "Karan (IT & Operations)",
    allowedModules: ["IT", "OPERATIONS", "MY_TASK", "MY_TICKETS"],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("authUser");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const login = (inputUsername, inputPassword) => {
    const cleanUser = (inputUsername || "").trim().toLowerCase();
    const cleanPass = (inputPassword || "").trim();

    const matchedKey = Object.keys(USER_CREDENTIALS).find(
      (key) => key === cleanUser,
    );

    if (!matchedKey) {
      return { success: false, message: "Invalid Username" };
    }

    const account = USER_CREDENTIALS[matchedKey];
    const isPassValid = account.passwordMatches.some(
      (p) => p.toLowerCase() === cleanPass.toLowerCase(),
    );

    if (!isPassValid) {
      return { success: false, message: "Invalid Password" };
    }

    const userData = {
      username: account.username,
      role: account.role,
      displayName: account.displayName,
      allowedModules: account.allowedModules,
    };

    setUser(userData);
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  const hasModuleAccess = (moduleName) => {
    if (!user) return false;
    if (user.allowedModules.includes("ALL")) return true;
    return user.allowedModules.includes(moduleName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasModuleAccess,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
