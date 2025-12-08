import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ImageBackground,
} from "react-native";
import { COLORS } from "../util/colors";
import WordStyling from "../components/WordStyling";
import TipsInfo from "../util/TipsInfo"; // Array of tips
import CustomButton from "../components/CustomButton";
import { supabase } from "../supabase";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import { getAvatar } from "../util/avatar";
import { useAppSettings } from "../src/context/AppSettingProvid";

export default function Home({ navigation }) {
  const { profile, user } = useAppSettings();
  const [gender, setGender] = useState(
    profile?.gender ?? user?.user_metadata?.gender ?? null
  );

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        let g = profile?.gender ?? user?.user_metadata?.gender ?? null;

        if (!g) {
          const { data: auth } = await supabase.auth.getUser();
          const uid = auth?.user?.id;
          if (uid) {
            const { data } = await supabase
              .from("profiles")
              .select("gender")
              .eq("id", uid)
              .single();
            g = data?.gender ?? null;
          }
        }

        if (alive) setGender(g);
      })();

      return () => {
        alive = false;
      };
    }, [profile?.gender])
  );

  const avatarSrc = getAvatar(gender);
  const firstName = (
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    user?.email?.split("@")[0] ||
    "Friend"
  ).split(" ")[0];

  return (
    <View style={styles.container}>
      {/* Profile pic and welcome message */}
      <View style={styles.greetingContainer}>
        <Image source={avatarSrc} style={styles.avatarImage} />
        <Text style={styles.greetngText}>
          <WordStyling
            style={{
              fontFamily: "Poppins-500",
              fontSize: 16,
              color: COLORS.purple3,
            }}
          >
            {`Hello, ${firstName}`}
          </WordStyling>
          {"\n"}Glad to see you!
        </Text>
      </View>

      {/* Status Card */}
      <View style={styles.StatusCardContainer}>
        <Image
          source={require("../assets/images/Rectangle.png")}
          style={styles.statusBackground}
          resizeMode="stretch"
        />
        <Image
          source={require("../assets/images/protection.png")}
          style={{ width: 64, height: 64, marginBottom: 16 }}
        />
        <Text style={[styles.greetngText, { color: "#118AD0", fontSize: 14 }]}>
          We’ve got you covered
        </Text>
      </View>

      {/* Tips Scroll */}
      <View>
        <Text style={styles.tipsHeader}>Today’s Smart Tips</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          {TipsInfo.map((tip, index) => (
            <Card key={index} title={tip.title} description={tip.description} />
          ))}
        </ScrollView>
      </View>

      {/* Actions Buttons */}
      <View style={{ marginTop: 16 }}>
        <Text style={[styles.tipsHeader]}>Your Safety Kit</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ActionButton
            title="Analyze Call"
            icon={require("../assets/icons/Volume.png")}
            imageSource={require("../assets/images/Actions.png")}
            iconWidth={72}
            iconHeight={72}
            top={-40}
            onPress={() => navigation.navigate("AnalyzeCall")}
          />
          <ActionButton
            title="Safe Browsing"
            icon={require("../assets/icons/net.png")}
            imageSource={require("../assets/images/Actions.png")}
            iconWidth={62}
            iconHeight={62}
            top={-48}
            onPress={() => navigation.navigate("SafeBrowsing")}
          />
          {/* 
          <ActionButton
            title="Scan URL"
            icon={require("../assets/icons/Search.png")}
            imageSource={require("../assets/images/Actions.png")}
            iconWidth={120}
            iconHeight={120}
            top={-18}
            onPress={() => navigation.navigate("ScanURL")}
          />
          */}
          <ActionButton
            title="Report Scam"
            icon={require("../assets/icons/alarm.png")}
            imageSource={require("../assets/images/Actions.png")}
            iconWidth={114}
            top={-30}
            iconHeight={114}
            onPress={() => navigation.navigate("ReportScam")}
          />
          <ActionButton
            title="SMS Scam"
            icon={require("../assets/icons/sms_scam.png")}
            imageSource={require("../assets/images/Actions.png")}
            iconWidth={114}
            top={-30}
            iconHeight={114}
            onPress={() => navigation.navigate("SmsScam")}
          />
        </ScrollView>
      </View>
    </View>
  );
}

// Reusable Card Component
function Card({ title, description }) {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require("../assets/images/Rectangle2.png")}
        style={styles.cardBackground}
        resizeMode="cover"
      />
      <Text style={styles.cardTitle}>{title}</Text>
      <Image
        source={require("../assets/images/Line3.png")}
        style={styles.cardLine}
        resizeMode="cover"
      />
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

function ActionButton({
  title,
  icon,
  onPress,
  imageSource,
  iconWidth = 72,
  iconHeight = 72,
  top,
}) {
  return (
    <Pressable onPress={onPress} style={{ marginRight: 12 }}>
      <ImageBackground
        source={imageSource}
        style={{
          width: 140,
          height: 200,
          borderRadius: 12,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 12,
          overflow: "hidden",
        }}
        imageStyle={{ borderRadius: 12 }}
      >
        <Image
          source={icon}
          style={{
            width: iconWidth,
            height: iconHeight,
            marginBottom: 12,
            top: top,
          }}
          resizeMode="contain"
        />
        <Text
          style={{
            color: "#5E62C1",
            fontSize: 14,
            fontFamily: "Poppins-600",
            textAlign: "center",
            top: -28,
          }}
        >
          {title}
        </Text>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 64,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E8F4",
  },
  greetngText: {
    fontFamily: "Poppins-300",
    color: COLORS.purple7,
    fontSize: 14,
  },
  StatusCardContainer: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 28,
    overflow: "hidden",
  },
  statusBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  tipsHeader: {
    fontFamily: "Poppins-500",
    fontSize: 18,
    color: "#797A7A",
    marginBottom: 12,
  },
  cardContainer: {
    width: 280,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
    padding: 16,
  },
  cardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 280,
    height: 180,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-500",
    color: COLORS.purple6,
    marginBottom: 24,
    textAlign: "center",
  },
  cardLine: {
    width: "80%",
    height: 2,
    marginBottom: 8,
  },
  cardDescription: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: "Poppins-400",
    color: "#797A7A",
    textAlign: "center",
  },
});
