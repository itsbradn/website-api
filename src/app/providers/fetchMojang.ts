export const getMojangPlayerByUUID = async (uuid: string) => {
  const mojangReq = await fetch(
    "https://sessionserver.mojang.com/session/minecraft/profile/" + uuid
  ).catch((e) => { });
  
  if (!mojangReq) return null;
  const skinData = await mojangReq.json();
  const decodedTextures = JSON.parse(
    Buffer.from(skinData.properties[0].value, "base64").toString("ascii")
  );
  return {
    uuid: skinData.id,
    username: skinData.name,
    skin: {
      url:
        "https://api.bradn.dev/api/v1/minecraft/texture/" +
        (decodedTextures.textures.SKIN?.url
          ? decodedTextures.textures.SKIN.url.split("/texture/")[1]
          : ""),
      id: decodedTextures.textures.SKIN?.url
        ? decodedTextures.textures.SKIN.url.split("/texture/")[1]
        : "",
    },
    cape: {
      url:
        "https://api.bradn.dev/api/v1/minecraft/texture/" +
        (decodedTextures.textures.CAPE?.url
          ? decodedTextures.textures.CAPE.url.split("/texture/")[1]
          : ""),
      id: decodedTextures.textures.CAPE?.url
        ? decodedTextures.textures.CAPE.url.split("/texture/")[1]
        : "",
    },
  };
};
