function replaceEmptySpaceString(inputString) {
  const stringWithoutSpaces = inputString.replace(/ /g, "%20");
  return stringWithoutSpaces;
}

export default {
  replaceEmptySpaceString,
};
