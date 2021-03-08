import React, { FC } from "react";
import NotificationProvider from "./NotificationProvider";
import ApiProvider from "./ApiProvider";
import { Routes } from "./Routes";

interface ProvidersProps {}

const Providers: FC<ProvidersProps> = () => {
  return (
    <ApiProvider>
      <NotificationProvider >
        <Routes />
      </NotificationProvider>
    </ApiProvider>

  );
};

export default Providers;