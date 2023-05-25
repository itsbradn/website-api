import { v4 as uuidv4 } from "uuid";
import { UserDocument } from "../database/providers/user";
import { SignJWT } from "jose";

export const getAccessTokens = async (user: UserDocument) => {
  const refreshToken = uuidv4();
  user.refreshTokens.push({ token: refreshToken, invalid: false });

  const accessToken = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("bradn-accounts:bradn.dev")
    .setAudience("bradn-accounts:" + user.id)
    .setExpirationTime("3h")
    .sign(new TextEncoder().encode(process.env.JWT_KEY!));

  await user.save();

  return {
    refresh: refreshToken,
    accessToken,
  };
};

export const refreshToken = async (user: UserDocument, token: string) => {
  const tokenData = user.refreshTokens.find((v) => v.token === token);
  if (!tokenData || tokenData.invalid) return "INVALID_TOKEN";

  return await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "ES256" })
    .setIssuedAt()
    .setIssuer("bradn-accounts:bradn.dev")
    .setAudience("bradn-accounts:" + user.id)
    .setExpirationTime("3h")
    .sign(new TextEncoder().encode(process.env.JWT_KEY!));
};
