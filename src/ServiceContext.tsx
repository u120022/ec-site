import { createContext, ParentComponent, useContext } from "solid-js";
import { Service } from "./Service";

export const ServiceContext = createContext<Service>();

export const ServiceProvider: ParentComponent = (props) => {

  const service = new Service();

  return (
    <ServiceContext.Provider value={service}>
      {props.children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
