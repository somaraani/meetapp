import React, { FC } from "react";
import AuthProvider from "./AuthProvider";
import NotificationProvider from "./NotificationProvider";
import { Routes } from "./Routes";

interface ProvidersProps {}

const Providers: FC<ProvidersProps> = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default Providers;
