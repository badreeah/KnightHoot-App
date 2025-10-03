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
import { supabase } from "../supabaseClient";
import { saveCallResult } from "../services/saveCallResult";
const { height } = Dimensions.get("window");

export default function AnalyzeCall({ navigation }) {
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
      const res = await fetch("http://192.168.100.115:3000/transcribe", {
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
      const res = await fetch("http://192.168.100.115:3000/transcribe-test");
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
        backgroundColor: "#fff",
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
          <Ionicons name="arrow-back" size={28} color="#6726C3" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Poppins-500",
            color: "#6726C3",
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
          borderColor: "#d4cfcfff",
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <TextInput
          value={transcript}
          editable={false}
          multiline
          style={{ fontSize: 16 }}
          placeholder="Transcription will appear here..."
        />
      </View>

      {/* Analysis Box */}
      {analysis && (
        <View
          style={{
            backgroundColor:
              analysis.prediction === "scam" ? "#ffe5e5" : "#e5ffe5",
            borderWidth: 2,
            borderColor: analysis.prediction === "scam" ? "#ff9999" : "#99ff99",
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-700",
              fontSize: 24,
              color: analysis.prediction === "scam" ? "#cc0000" : "#55da55ff",
              marginBottom: 8,
            }}
          >
            {analysis.prediction?.toUpperCase()}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins-600",
              fontSize: 18,
              color: "#333",
            }}
          >
            {(analysis.probability * 100).toFixed(2)}%
          </Text>
        </View>
      )}

      {/* Spinner */}
      {loading && (
        <ActivityIndicator
          size={60}
          color="#6200EE"
          style={{
            marginBottom: 20,
          }}
        />
      )}

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={{
            flex: 0.45,
            padding: 8,
            backgroundColor: "#926DFB",
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Ionicons
            name={isRecording ? "mic-off" : "mic"}
            size={24}
            color="#fff"
          />
          <Text
            style={{ color: "#fff", marginTop: 4, fontFamily: "Poppins-500" }}
          >
            {isRecording ? "Stop" : "Record"}
          </Text>
        </Pressable>

        <Pressable
          onPress={fetchTestTranscription}
          style={{
            flex: 0.45,
            padding: 12,
            backgroundColor: "#4AE2E3",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#ffffffff", fontFamily: "Poppins-600" }}>
            Transcribe
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
