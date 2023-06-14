import { Minecraft } from "../../types/minecraft";
import { MinecraftModel } from "../schemas/minecraft";

export const cacheData = async (
  data: Partial<Omit<Minecraft, "cacheUntil">>,
  type: "mojang" | "hypixel"
) => {
  let cur = await MinecraftModel.findOne({ uuid: data.uuid });
  if (!cur) cur = await MinecraftModel.create({ uuid: data.uuid });

  const mojangCacheUntil = new Date(Date.now() + 15 * 60 * 1000);
  const hypixelCacheUntil = new Date(Date.now() + 2 * 60 * 1000);

  let finalData = { ...data };
  if (type === "mojang") finalData.mojangCacheUntil = mojangCacheUntil;
  else finalData.hypixelCacheUntil = hypixelCacheUntil;

  return await MinecraftModel.updateOne(
    { uuid: data.uuid },
    { $set: finalData }
  );
};

export const checkCacheByPlayername = async (
  playerName: string,
  type: "mojang" | "hypixel"
) => {
  const cache = await MinecraftModel.findOne({ username: playerName });
  if (!cache) return null;
  const cacheUntil =
    type === "mojang" ? cache.mojangCacheUntil : cache.hypixelCacheUntil;
  if (new Date() > cacheUntil) return null;

  return cache;
};

export const checkCacheByUuid = async (
  uuid: string,
  type: "mojang" | "hypixel"
) => {
  const cache = await MinecraftModel.findOne({ uuid });
  if (!cache) return null;
  const cacheUntil =
    type === "mojang" ? cache.mojangCacheUntil : cache.hypixelCacheUntil;
  if (new Date() > cacheUntil) return null;

  return cache;
};
