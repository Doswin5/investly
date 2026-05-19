import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("investly_token");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("investly_token");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);

    localStorage.setItem("investly_token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);

    localStorage.setItem("investly_token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("investly_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);