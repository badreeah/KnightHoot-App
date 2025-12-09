import { useTranslation } from "react-i18next";

export default function TipsInfo() {
  const { t } = useTranslation();

  return [
    {
      title: t("home.tips.thinkTitle"),
      description: t("home.tips.thinkBody"),
    },
    {
      title: t("home.tips.pauseTitle"),
      description: t("home.tips.pauseBody"),
    },
    {
      title: t("home.tips.urgencyTitle"),
      description: t("home.tips.urgencyBody"),
    },
  ];
}
