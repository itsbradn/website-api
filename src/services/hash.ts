import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export const oneWayHash = async (text: string) => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(text, salt);
};

export const oneWayCheck = async (text: string, hash: string) =>
  await bcrypt.compare(text, hash);
