import Cookies from "js-cookie";
import {
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  useContext,
} from "solid-js";

const tokenContext = createContext<
  [
    token: () => string | undefined,
    setToken: (token: string | undefined) => void
  ]
>([() => undefined, () => {}]);

export const TokenProvider: ParentComponent = (props) => {
  const [token, setToken] = createSignal(Cookies.get("SESSION_TOKEN"));

  createEffect(() => {
    const current = token();

    if (!current) {
      Cookies.remove("SESSION_TOKEN");
      return;
    }

    Cookies.set("SESSION_TOKEN", current);
  });

  return (
    <tokenContext.Provider value={[token, setToken]}>
      {props.children}
    </tokenContext.Provider>
  );
};

export const useToken = () => useContext(tokenContext);
