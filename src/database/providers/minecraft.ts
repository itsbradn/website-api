import { Document, Types } from "mongoose";
import { Minecraft } from "../../types/minecraft";
import { MinecraftModel } from "../schemas/minecraft";
import { parseWhole } from "../../services/number";

export const cacheData = async (
  data: Partial<Omit<Minecraft, "cacheUntil">>,
  type: "mojang" | "hypixel",
  ip?: string
) => {
  let cur = await MinecraftModel.findOne({ uuid: data.uuid });
  if (!cur) cur = await MinecraftModel.create({ uuid: data.uuid });

  const mojangCacheUntil = new Date(Date.now() + 15 * 60 * 1000);
  const hypixelCacheUntil = new Date(Date.now() + 2 * 60 * 1000);

  let finalData = data;
  if (type === "mojang") finalData.mojangCacheUntil = mojangCacheUntil;
  else finalData.hypixelCacheUntil = hypixelCacheUntil;

  cur.$set(finalData);
  if (type === "mojang" && ip !== undefined) {
    updateViews(cur, ip);
  }
  return await cur.save();
};

export const updateViews = async (
  doc: Document<unknown, {}, Minecraft> &
    Omit<
      Minecraft & {
        _id: Types.ObjectId;
      },
      never
    >,
  ip: string
) => {
  if (doc.views && doc.views > 0) {
    // Update old docs
    const views: string[] = [];
    for (let i = 0; i < doc.views; i++) {
      views.push(
        Math.floor(Math.random() * 255) +
          1 +
          "." +
          Math.floor(Math.random() * 255) +
          "." +
          Math.floor(Math.random() * 255) +
          "." +
          Math.floor(Math.random() * 255)
      );
    }
    doc.views = undefined;
    doc.viewers = views;
  }

  if (!doc.viewers.includes(ip) && ip.includes('.')) {
    doc.viewers.push(ip);
  }

  doc.markModified("views");
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
};
