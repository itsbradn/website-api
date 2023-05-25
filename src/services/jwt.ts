import { v4 as uuidv4 } from "uuid";
import { UserDocument } from "../database/providers/user";
import { EncryptJWT, SignJWT, base64url, jwtDecrypt } from "jose";

export const getAccessTokens = async (user: UserDocument) => {
  const refreshToken = uuidv4();
  user.refreshTokens.push({ token: refreshToken, invalid: false });

  const accessToken = await new EncryptJWT({ id: user.id })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setIssuer("bradn-accounts:bradn.dev")
    .setAudience("bradn-accounts:user")
    .setExpirationTime("3h")
    .encrypt(base64url.decode(process.env.JWT_KEY!));

  await user.save();

  return {
    refresh: refreshToken,
    accessToken,
  };
};

export const refreshToken = async (user: UserDocument, token: string) => {
  const tokenData = user.refreshTokens.find((v) => v.token === token);
  if (!tokenData || tokenData.invalid) return "INVALID_TOKEN";

  return await new EncryptJWT({ id: user.id })
  .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
  .setIssuedAt()
  .setIssuer("bradn-accounts:bradn.dev")
  .setAudience("bradn-accounts:user")
  .setExpirationTime("3h")
  .encrypt(base64url.decode(process.env.JWT_KEY!));
};

export const readAccessToken = async (text: string) => {
  let res: string = "INVALID";
  try {
    const { payload, protectedHeader } = await jwtDecrypt(text, base64url.decode(process.env.JWT_KEY!), {
      issuer: 'bradn-accounts:bradn.dev',
      audience: 'bradn-accounts:user',
    });

    res = payload.id as string;
  } catch (e) {
    res = "INVALID";
  }

  return res;
}
