const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withSmsPermissions(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // إضافة صلاحيات RECEIVE_SMS و READ_SMS
    const usesPermissions = androidManifest.manifest["uses-permission"] || [];

    const smsPermissions = [
      "android.permission.RECEIVE_SMS",
      "android.permission.READ_SMS",
    ];

    smsPermissions.forEach((perm) => {
      if (!usesPermissions.find((p) => p.$["android:name"] === perm)) {
        usesPermissions.push({ $: { "android:name": perm } });
      }
    });

    androidManifest.manifest["uses-permission"] = usesPermissions;

    return config;
  });
};
