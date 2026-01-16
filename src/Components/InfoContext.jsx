import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [eml, setEml] = useState(false);
  return (
    <UserContext.Provider value={{ eml, setEml }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);