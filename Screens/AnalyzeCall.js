import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import supabase from "../supabase";
import { saveCallResult } from "../services/saveCallResult";
const { height } = Dimensions.get("window");
import { useAppSettings } from "../src/context/AppSettingProvid";

export default function AnalyzeCall({ navigation }) {
  const { theme } = useAppSettings();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null); // store API response

  // Start recording
  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return alert("Microphone permission required");

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();

    setRecording(rec);
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = async () => {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setIsRecording(false);
    setRecording(null);

    if (uri) uploadAudio(uri);
  };

  // Upload audio to backend
  const uploadAudio = async (uri) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", { uri, name: "recording.wav", type: "audio/wav" });

    try {
      const res = await fetch("http://192.168.100.109:3000/transcribe", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await res.json();
      const text = data.text || "No transcription";
      setTranscript(text);

      // Send transcription to scam API
      const scamRes = await fetch(
        "https://detect-scam-calls-api-production.up.railway.app/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );
      const scamData = await scamRes.json();
      setAnalysis(scamData);
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      if (userId) {
        await saveCallResult(userId, scamData.prediction, scamData.probability);
      }

      // Show alert if scam
      if (scamData.prediction === "scam") {
        Alert.alert(
          "Warning",
          "This call is detected as a scam. Advise user to hang up!"
        );
      }
    } catch (err) {
      console.error(err);
      setTranscript("Error uploading audio");
    } finally {
      setLoading(false);
    }
  };

  // Fetch test transcription
  const fetchTestTranscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://192.168.100.109:3000/transcribe-test");
      const data = await res.json();
      const text = data.text || "No transcription";
      setTranscript(text);

      // Send transcription to scam API
      const scamRes = await fetch(
        "https://detect-scam-calls-api-production.up.railway.app/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );
      const scamData = await scamRes.json();
      setAnalysis(scamData);
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      if (userId) {
        await saveCallResult(userId, scamData.prediction, scamData.probability);
      }

      // Show alert if scam
      if (scamData.prediction === "scam") {
        Alert.alert(
          "Warning",
          "This call is detected as a scam. Advise user to hang up!"
        );
      }
    } catch (err) {
      console.error(err);
      setTranscript("Error fetching transcription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 50,
        paddingHorizontal: 16,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          marginTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 20,
            fontFamily: theme.fonts.medium,
            color: theme.colors.text,
          }}
        >
          Analyze Call
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Transcription Box */}
      <View
        style={{
          height: height / 3,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
          backgroundColor: theme.colors.card,
        }}
      >
        <TextInput
          value={transcript}
          editable={false}
          multiline
          style={{ fontSize: 16, color: theme.colors.text }}
          placeholder="Transcription will appear here..."
          placeholderTextColor={theme.colors.subtext}
        />
      </View>

      {/* Analysis Box */}
      {analysis && (
        <View
          style={{
            backgroundColor:
              analysis.prediction === "scam"
                ? "#FF7F7F" // light red for scam
                : "#5cc55fff", // green for safe
            borderWidth: 2,
            borderColor: theme.colors.cardBorder,
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 24,
              color: "#FFFFFF", // white text
              marginBottom: 8,
            }}
          >
            {analysis.prediction?.toUpperCase()}
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.semibold,
              fontSize: 18,
              color: "#FFFFFF", // white text
            }}
          >
            {(analysis.probability * 100).toFixed(2)}%
          </Text>
        </View>
      )}

      {loading && (
        <ActivityIndicator
          size={60}
          color={theme.colors.primary}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={{
            flex: 0.45,
            padding: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Ionicons
            name={isRecording ? "mic-off" : "mic"}
            size={24}
            color={theme.colors.primaryTextOn}
          />
          <Text
            style={{
              color: theme.colors.primaryTextOn,
              marginTop: 4,
              fontFamily: theme.fonts.medium,
            }}
          >
            {isRecording ? "Stop" : "Record"}
          </Text>
        </Pressable>

        <Pressable
          onPress={fetchTestTranscription}
          style={{
            flex: 0.45,
            padding: 12,
            backgroundColor: theme.colors.tint,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme.colors.primaryTextOn,
              fontFamily: theme.fonts.semibold,
            }}
          >
            Transcribe
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
