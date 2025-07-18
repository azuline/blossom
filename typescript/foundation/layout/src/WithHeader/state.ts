import { createContext, useContext } from "react";

const HeaderExistsContext = createContext(false);
export const HeaderExistsContextProvider = HeaderExistsContext.Provider;
export const useHeaderExists = (): boolean => useContext(HeaderExistsContext);
