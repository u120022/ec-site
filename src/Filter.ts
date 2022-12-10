export const simpleFilter = (search: string, target: string) => {
  return target
    .replace(" ", "")
    .toLowerCase()
    .includes(search.replace(" ", "").toLowerCase());
};
