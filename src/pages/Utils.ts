import { useParams, useSearchParams } from "@solidjs/router";

// urlパターンを解析して抽出
export function useParamInt<T>(key: string, initValue: T) {
  const params = useParams();

  const getParam = () => {
    if (params[key] == undefined) return initValue;

    const parsed = parseInt(params[key]);
    if (isNaN(parsed)) return initValue;

    return parsed;
  };

  return getParam;
}

// getクエリを抽出
export function useSearchParam<T>(key: string, initValue: T) {
  const [params, setParams] = useSearchParams();

  const getParam = () => {
    if (params[key] == undefined) return initValue;
    return params[key];
  };

  const setParam = (value: string) => {
    setParams({ [key]: value });
  };

  return [getParam, setParam] as [() => string | T, (value: string) => void];
}

// getクエリを解析して抽出
export function useSearchParamInt<T>(key: string, initValue: T) {
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
}

// 最大ページを計算
export function calcMaxPageCount(
  count: number | undefined,
  countPerPage: number
) {
  if (count == undefined) return 1;
  return Math.ceil(count / countPerPage);
}
