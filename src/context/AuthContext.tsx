import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
    idusuario: number;
    usuario: string;
    tipo: number;
    clinica_cnpj: string;
    exp?: number;
}

interface AuthContextType {
    token: string | null;
    user: UserPayload | null;
    login: (token: string) => void;
    logout: () => void;
    hasPermission: (requiredRole: number) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const decodeUser = (value: string | null): UserPayload | null => {
    if (!value) return null;
    try {
        return jwtDecode<UserPayload>(value);
    } catch {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('@App:token');
    const decoded = decodeUser(storedToken);
    if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
        localStorage.removeItem('@App:token');
        return null;
    }
    return storedToken;
   });

   const user = decodeUser(token);

   const login = (newToken: string) => {
    localStorage.setItem('@App:token', newToken);
    setToken(newToken);
   };

    const logout = () => {
     localStorage.removeItem('@App:token');
     setToken(null);
    };

   const hasPermission = (requiredRole: number) => {
    if(!user) return false;
    return user.tipo === requiredRole || user.tipo === 1;
   }

   return (
    <AuthContext.Provider value ={{ token, user, login, logout, hasPermission}}>
        {children}
    </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
