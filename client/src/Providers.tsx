import React, { FC } from "react";
import ApiProvider from "./ApiProvider";
import { Routes } from "./Routes";

interface ProvidersProps {}

const Providers: FC<ProvidersProps> = () => {
  return (
    <ApiProvider>
      <Routes />
    </ApiProvider>
  );
};

export default Providers;
