import { createContext } from "react";

export const EmployeeContext = createContext({
  trigger: 0,
  generateEmployees: () => {},
});
