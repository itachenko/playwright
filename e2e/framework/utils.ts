export const wait = async (ms: number): Promise<void> =>
  new Promise((r, _) => setTimeout(r, ms));

export const generateRandomString = (length: number = 5): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};
