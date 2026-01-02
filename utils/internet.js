import dns from "dns";

const isOnline = async () => {
  try {
    await dns.promises.lookup("google.com");
    return true;
  } catch (error) {
    throw new Error("No Internet Connection.", error.message);
  }
};

export { isOnline };
