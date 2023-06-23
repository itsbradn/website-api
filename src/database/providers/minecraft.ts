import { Document, Types } from "mongoose";
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

  let finalData = data;
  if (type === "mojang") finalData.mojangCacheUntil = mojangCacheUntil;
  else finalData.hypixelCacheUntil = hypixelCacheUntil;

  cur.$set(finalData);
  return await cur.save();
};

export const checkCacheByPlayername = async (
  playerName: string,
  type: "mojang" | "hypixel"
): Promise<
  | {
      data: Document<unknown, {}, Minecraft> &
        Omit<
          Minecraft & {
            _id: Types.ObjectId;
          },
          never
        >;
      refresh: false;
    }
  | {
    data:
        | (Document<unknown, {}, Minecraft> &
            Omit<
              Minecraft & {
                _id: Types.ObjectId;
              },
              never
            >)
        | null;
      refresh: true;
    }
> => {
  const cache = await MinecraftModel.findOne({ username: playerName });
  if (!cache) return { data: null, refresh: true };
  const cacheUntil =
    type === "mojang"
      ? cache.mojangCacheUntil?.getTime()
      : cache.hypixelCacheUntil?.getTime();
  if (new Date().getTime() > (cacheUntil === undefined ? 0 : cacheUntil))
    return { data: cache, refresh: true };

  return { data: cache, refresh: false };
};

export const checkCacheByUuid = async (
  uuid: string,
  type: "mojang" | "hypixel"
): Promise<
  | {
    data: Document<unknown, {}, Minecraft> &
        Omit<
          Minecraft & {
            _id: Types.ObjectId;
          },
          never
        >;
      refresh: false;
    }
  | {
    data:
        | (Document<unknown, {}, Minecraft> &
            Omit<
              Minecraft & {
                _id: Types.ObjectId;
              },
              never
            >)
        | null;
      refresh: true;
    }
> => {
  const cache = await MinecraftModel.findOne({ uuid });
  if (!cache) return { data: null, refresh: true };
  const cacheUntil =
    type === "mojang"
      ? cache.mojangCacheUntil?.getTime()
      : cache.hypixelCacheUntil?.getTime();
  if (new Date().getTime() > (cacheUntil === undefined ? 0 : cacheUntil))
    return { data: cache, refresh: true };

  return { data: cache, refresh: false };
};

export const getCacheDoc = async (uuid: string) => {
  let doc = await MinecraftModel.findOne({ uuid });
  if (!doc) doc = await MinecraftModel.create({ uuid });
  return doc;
}
