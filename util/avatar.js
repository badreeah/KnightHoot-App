export const AVATARS = {
  male: require("../assets/images/Male_Avatar.png"),
  female: require("../assets/images/Avatar.png"),
  default: require("../assets/icons/account.png"),
};

export const normalizeGender = (g) => {
  const v = String(g || "").trim().toLowerCase();
  if (["male", "ذكر"].includes(v)) return "male";
  if (["female", "انثى", "أنثى"].includes(v)) return "female";
  return null;
};

export const getAvatar = (gender) => {
  const key = normalizeGender(gender);
  return key ? AVATARS[key] : AVATARS.default;
};