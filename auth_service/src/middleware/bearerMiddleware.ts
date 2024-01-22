import { Request, Response, NextFunction } from "express";

const AuthBearerMiddleare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth_bearer: string | undefined = req.headers["authorization"];

  // if the authorization header is present
  if (!auth_bearer) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing Authorization header" });
  }
  // get the bearer token string
  const bearer_token: string | undefined = auth_bearer.split(" ")[1];

  if (bearer_token !== process.env.BEARER_TOKEN) {
    return res.status(403).json({ message: "Forbidden: Invalid bearer token" });
  }

  next();
};

export default AuthBearerMiddleare;
