import * as bcrypt from 'bcrypt';

export const oneWayHash = async (text: string) => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(text, salt);
};

export const oneWayCheck = async (text: string, hash: string) =>
  await bcrypt.compare(text, hash);
