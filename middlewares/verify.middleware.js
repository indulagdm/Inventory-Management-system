import jwt from "jsonwebtoken";

import { SERVICEUSER, SECRET } from "../utils/variable.js";
import { getKey, deleteKey } from "../security/advanceSecurity.js";
import { isNullChecker } from "../helper/emptyChecker.helper.js";

const verify = async () => {
  try {
    const token = await getKey(SERVICEUSER);

    if (isNullChecker(token)) {
      throw new Error("Session is expired. Please re-login.");
    }

    const decode = jwt.verify(token, SECRET);

    return decode;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      await deleteKey(SERVICEUSER);
      throw new Error("Session has expired. Please login again.");
    } else if (error.name === "JsonWebTokenError") {
      await deleteKey(SERVICEUSER);
      throw new Error("Invalid token.");
    } else if (error.message.includes("BAD_DECRYPT")) {
      await deleteKey(SERVICEUSER);
      throw new Error("Session has some error. Please login again.");
    }
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export { verify };
