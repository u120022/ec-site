import { useParams, useSearchParams } from "@solidjs/router";

export const useParamInt = <T>(key: string, initValue: T) => {
  const params = useParams();

  const getParam = () => {
    if (params[key] == undefined) return initValue;

    const parsed = parseInt(params[key]);
    if (isNaN(parsed)) return initValue;

    return parsed;
  };

  return getParam;
};

export const useSearchParam = <T>(key: string, initValue: T) => {
  const [params, setParams] = useSearchParams();

  const getParam = () => {
    if (params[key] == undefined) return initValue;
    return params[key];
  };

  const setParam = (value: string) => {
    setParams({ [key]: value });
  };

  return [getParam, setParam] as [() => string | T, (value: string) => void];
};

export const useSearchParamInt = <T>(key: string, initValue: T) => {
  const [params, setParams] = useSearchParams();

  const getParam = () => {
    if (params[key] == undefined) return initValue;

    const parsed = parseInt(params[key]);
    if (isNaN(parsed)) return initValue;

    return parsed;
  };

  const setParam = (value: number) => {
    setParams({ [key]: value });
  };

  return [getParam, setParam] as [() => number | T, (value: number) => void];
};

export const calcMaxPageCount = (
  count: number | undefined,
  countPerPage: number
) => {
  if (count == undefined) return 1;
  return Math.ceil(count / countPerPage);
};
