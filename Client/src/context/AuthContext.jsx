import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApiData } from "../utils/apiClient";

const AuthContext = createContext(null);

export const DEFAULT_PASSWORDS = [
  "ENHANCE123",
  "Enhance123",
  "enhance123",
  "ENHANCE 123",
  "ENHANCE",
];

export const USER_CREDENTIALS = {
  sumit: {
    username: "Sumit",
    passwordMatches: DEFAULT_PASSWORDS,
    role: "ADMIN",
    displayName: "Sumit (Admin)",
    allowedModules: ["ALL"],
  },
  sumith: {
    username: "Sumit",
    passwordMatches: DEFAULT_PASSWORDS,
    role: "ADMIN",
    displayName: "Sumit (Admin)",
    allowedModules: ["ALL"],
  },
  srikar: {
    username: "Srikar",
    passwordMatches: DEFAULT_PASSWORDS,
    role: "HRMS",
    displayName: "Srikar (HRMS)",
    allowedModules: ["HRMS", "MY_TASK", "MY_TICKETS", "ALL"],
  },
  karan: {
    username: "Karan",
    passwordMatches: DEFAULT_PASSWORDS,
    role: "IT_OPERATIONS",
    displayName: "Karan (IT & Operations)",
    allowedModules: ["IT", "OPERATIONS", "MY_TASK", "MY_TICKETS", "ALL"],
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

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetchApiData("/api/employees");
      if (res && res.data && Array.isArray(res.data)) {
        setEmployees(res.data);
      }
    } catch (err) {
      console.error("Error loading employee profiles in AuthContext:", err);
    }
  };

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

    // 1. Check static Admin/Role accounts (Sumit, Srikar, Karan)
    const matchedKey = Object.keys(USER_CREDENTIALS).find(
      (key) => key === cleanUser,
    );

    if (matchedKey) {
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
    }

    // 2. Check dynamic Employee profiles (Rahul, etc.)
    const matchedEmp = employees.find((emp) => {
      const dName = (emp.displayName || "").trim().toLowerCase();
      const eName = (emp.employeeName || "").trim().toLowerCase();
      return dName === cleanUser || eName === cleanUser;
    });

    if (matchedEmp) {
      const isPassValid = DEFAULT_PASSWORDS.some(
        (p) => p.toLowerCase() === cleanPass.toLowerCase(),
      );

      if (!isPassValid) {
        return { success: false, message: "Invalid Password (Default: enhance123)" };
      }

      const empName = matchedEmp.displayName || matchedEmp.employeeName || inputUsername;
      const userData = {
        username: empName,
        role: matchedEmp.designation || matchedEmp.jobTitle || "EMPLOYEE",
        displayName: empName,
        allowedModules: ["ALL"],
      };

      setUser(userData);
      return { success: true, user: userData };
    }

    // 3. Fallback: If user enters any name with password enhance123, allow login as Employee
    const isPassValid = DEFAULT_PASSWORDS.some(
      (p) => p.toLowerCase() === cleanPass.toLowerCase(),
    );

    if (isPassValid && inputUsername.trim()) {
      const formattedName = inputUsername.trim();
      const userData = {
        username: formattedName,
        role: "EMPLOYEE",
        displayName: formattedName,
        allowedModules: ["ALL"],
      };

      setUser(userData);
      return { success: true, user: userData };
    }

    return { success: false, message: "Invalid Username or Password." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  const hasModuleAccess = (moduleName) => {
    if (!user) return false;
    if (!user.allowedModules || user.allowedModules.includes("ALL")) return true;
    return user.allowedModules.includes(moduleName);
  };

  // Compile list of all available profile options
  const allProfiles = [
    { username: "Sumit", displayName: "Sumit (Admin)", role: "ADMIN" },
    { username: "Srikar", displayName: "Srikar (HRMS)", role: "HRMS" },
    { username: "Karan", displayName: "Karan (IT & Operations)", role: "IT_OPERATIONS" },
    ...employees.map((emp) => ({
      username: emp.displayName || emp.employeeName,
      displayName: `${emp.displayName || emp.employeeName} (Employee)`,
      role: emp.designation || emp.jobTitle || "EMPLOYEE",
    })),
  ];

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasModuleAccess,
        isAuthenticated: !!user,
        employees,
        allProfiles,
        reloadEmployees: loadEmployees,
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
