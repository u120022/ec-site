import Cookies from "js-cookie";
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";

// 要修正
const tokenContext = createContext<
  [token: Accessor<string>, setToken: Setter<string>]
>(createSignal(Cookies.get("SESSION_TOKEN") || "EMPTY"));

export const TokenProvider: ParentComponent = (props) => {
  const [token, setToken] = createSignal(
    Cookies.get("SESSION_TOKEN") || "EMPTY"
  );

  createEffect(() => Cookies.set("SESSION_TOKEN", token()));

  return (
    <tokenContext.Provider value={[token, setToken]}>
      {props.children}
    </tokenContext.Provider>
  );
};

export const useToken = () => useContext(tokenContext);
