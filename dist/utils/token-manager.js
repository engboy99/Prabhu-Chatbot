import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constant.js";
export const createToken = (id, email, expiresIn) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn,
    });
};
export const verifyToken = (req, res, next) => {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtData = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};
//# sourceMappingURL=token-manager.js.map