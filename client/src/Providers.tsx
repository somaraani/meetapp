import React, { FC } from "react";
import AuthProvider from "./AuthProvider";
import { Routes } from "./Routes";

interface ProvidersProps {}

const Providers: FC<ProvidersProps> = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default Providers;
