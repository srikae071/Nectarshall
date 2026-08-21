import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchApiData } from "../utils/apiClient";

const AuthContext = createContext(null);

export const DEFAULT_PASSWORDS = [
  "ENHANCE123",
  "Enhance123",
  "enhance123",
  "ENHANCE 123",
  "ENHANCE",
];

// Core Admin account
const ADMIN_PROFILE = {
  username: "Sumit",
  displayName: "Sumit",
  role: "ADMIN",
  department: "Admin",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("authUser");
      return saved ? JSON.parse(saved) : ADMIN_PROFILE;
    } catch (e) {
      return ADMIN_PROFILE;
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

  // Compile list of profiles derived ONLY from Core Admin + Active Employees in backend Employee table
  const allProfiles = useMemo(() => {
    const list = [ADMIN_PROFILE];

    // Filter only ACTIVE employees from the Employee table
    const activeEmps = (employees || []).filter(
      (emp) => emp.status !== "Inactive" && emp.status !== "inactive"
    );

    activeEmps.forEach((emp) => {
      const empName = (emp.displayName || emp.employeeName || "").trim();
      if (
        empName &&
        !list.some((p) => p.username.toLowerCase() === empName.toLowerCase())
      ) {
        const empDept = emp.department || emp.dept || emp.designation || "Operations";
        list.push({
          username: empName,
          displayName: empName,
          role: emp.designation || emp.jobTitle || "EMPLOYEE",
          department: empDept,
        });
      }
    });

    return list;
  }, [employees]);

  const switchProfile = (profileUsername) => {
    const matched = allProfiles.find(
      (p) => p.username.toLowerCase() === (profileUsername || "").trim().toLowerCase()
    );
    if (matched) {
      setUser({
        username: matched.username,
        displayName: matched.displayName,
        role: matched.role,
        department: matched.department,
      });
      return matched;
    }
    const defaultUser = {
      username: profileUsername,
      displayName: profileUsername,
      role: "EMPLOYEE",
      department: "Operations",
    };
    setUser(defaultUser);
    return defaultUser;
  };

  const login = (inputUsername, inputPassword) => {
    const cleanUser = (inputUsername || "").trim();
    const cleanPass = (inputPassword || "").trim();

    const isPassValid = DEFAULT_PASSWORDS.some(
      (p) => p.toLowerCase() === cleanPass.toLowerCase()
    );

    if (!isPassValid) {
      return { success: false, message: "Invalid Password" };
    }

    const userData = switchProfile(cleanUser);
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  const getUserDepartments = (u) => {
    if (!u) return [];
    const depts = new Set();
    if (u.department) depts.add(u.department.toUpperCase());
    if (u.role) depts.add(u.role.toUpperCase());

    const extra = u.extraRoles || u.ExtaRoles || [];
    if (Array.isArray(extra)) {
      extra.forEach((r) => depts.add(String(r).toUpperCase()));
    } else if (typeof extra === "string") {
      extra.split(",").forEach((r) => depts.add(r.trim().toUpperCase()));
    }
    return Array.from(depts);
  };

  // Check top navbar tab accessibility
  const hasTabAccess = (tabName) => {
    if (!user) return false;
    const username = (user.username || "").toLowerCase();
    const role = (user.role || "").toUpperCase();
    const dept = (user.department || "").toUpperCase();

    // Admin sees EVERYTHING
    if (role === "ADMIN" || username.includes("sumit") || dept === "ADMIN") return true;

    // CONSOLE tab is ONLY visible to Admin
    if (tabName === "CONSOLE") return false;

    // Common for everyone: MY TASK, MY TICKETS, MY MAILS
    if (["MY_TASK", "MY_TICKETS", "MY_MAILS"].includes(tabName)) return true;

    const allUserDepts = getUserDepartments(user);

    return allUserDepts.some((d) => {
      if (d.includes("OPERAT") && tabName === "OPERATIONS") return true;
      if (d.includes("IT") && tabName === "IT") return true;
      if ((d.includes("HR") || d.includes("HUMAN")) && tabName === "HRMS") return true;
      if ((d.includes("FIN") || d.includes("ACC")) && (tabName === "ACCOUNTS" || tabName === "CNC")) return true;
      return false;
    });
  };

  // Check homepage tile accessibility
  const hasTileAccess = (tileKey) => {
    if (!user) return false;
    const username = (user.username || "").toLowerCase();
    const role = (user.role || "").toUpperCase();
    const dept = (user.department || "").toUpperCase();

    const isAdmin = role === "ADMIN" || username.includes("sumit") || dept === "ADMIN";

    // Admin sees ALL tiles including Business Engagement
    if (isAdmin) return true;

    // Business Engagement tile is ONLY visible to Admin
    if (tileKey === "BUSINESS_ENGAGEMENT") return false;

    // All other tiles are visible to everyone
    return true;
  };

  const hasModuleAccess = (moduleName) => {
    if (moduleName === "ALL") return hasTabAccess("ADMIN");
    return hasTabAccess(moduleName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchProfile,
        hasTabAccess,
        hasTileAccess,
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
