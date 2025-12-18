const isNullChecker = (value) => {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "null" ||
    (typeof value === "string" && value.trim() === "")
  );
};

export { isNullChecker };
