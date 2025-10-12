import React, { useEffect, useState, useMemo, useCallback } from "react";
import supabase from "../supabase";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function AddDevice({ navigation, route }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newDeviceCategory, setNewDeviceCategory] = useState("My Devices");
  const [addEnabled, setAddEnabled] = useState(true);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const EmptyState = ({ onAddPress }) => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../assets/images/not_found.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No devices found</Text>
      <Text style={styles.emptySubtitle}>
        You haven't added any devices yet. Start by adding your first device.
      </Text>
      <TouchableOpacity style={styles.scanButton} onPress={onAddPress}>
        <Text style={styles.scanButtonText}>Add Device</Text>
      </TouchableOpacity>
    </View>
  );

  const fetchDevices = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("devices")
      .select("id, name, type, category, connected, enabled")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error.message);
    } else {
      console.log("Fetched devices:", data);
      setDevices(data || []);
    }
    setLoading(false);
  }, []);

  const handleDeviceAdded = async () => {
    if (!newDeviceType) {
      alert("Please select a device type.");
      return;
    }
    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log("User:", user, "Error:", userError);
    if (userError || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    console.log("user.user.id:", user.user.id);

    const deviceData = {
      name: newDeviceName,
      type: newDeviceType,
      category: newDeviceCategory,
      enabled: addEnabled,
      connected: addEnabled,
    };

    if (!editingDevice) {
      deviceData.user_id = user.user.id;
      console.log("Set user_id:", deviceData.user_id);
    }
    deviceData.bluetooth_id =
      route.params?.selectedDevice?.bluetooth_id || null;
    console.log("Device data:", deviceData);

    let operation;

    if (editingDevice) {
      operation = supabase
        .from("devices")
        .update(deviceData)
        .eq("id", editingDevice.id)
        .select();
    } else {
      operation = supabase.from("devices").insert([deviceData]).select();
    }

    const { data, error } = await operation;

    console.log("Operation result:", data, error);

    if (error) {
      console.error("Supabase DB Error:", error.message);
      alert(
        `Failed to ${
          editingDevice ? "update" : "add"
        } device. Check RLS policies.`
      );
    } else {
      await fetchDevices();

      setShowAddForm(false);
      setEditingDevice(null);
      navigation.setParams({ selectedDevice: undefined });
    }
  };

  const toggleDevice = async (deviceId, currentState) => {
    const { error } = await supabase
      .from("devices")
      .update({ enabled: !currentState })
      .eq("id", deviceId);

    if (error) {
      console.error("Toggle Error:", error.message);
      alert("Failed to update device status.");
    } else {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === deviceId ? { ...d, enabled: !currentState } : d
        )
      );
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    const { error } = await supabase
      .from("devices")
      .delete()
      .eq("id", deviceId);
    if (error) {
      console.error("Delete Error:", error.message);
      alert("Failed to delete device.");
    } else {
      await fetchDevices();
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      await fetchDevices();

      if (route.params?.selectedDevice) {
        const device = route.params.selectedDevice;
        const isNew = route.params?.isNew ?? true; // Default to true for adding new
        if (isNew) {
          setEditingDevice(null);
          // Prefill form for new device
          setNewDeviceName(device.name || "");
          setNewDeviceType(device.type || "");
          setNewDeviceCategory(device.category || "My Devices");
          setAddEnabled(true);
          setShowAddForm(true);
        } else {
          // Edit existing
          setEditingDevice(device);
          setNewDeviceName(device.name || "");
          setNewDeviceType(device.type || "");
          setNewDeviceCategory(device.category || "My Devices");
          setAddEnabled(device.enabled ?? true);
          setShowAddForm(true);
        }
      } else {
        setNewDeviceName("New Device");
        setNewDeviceType("");
        setNewDeviceCategory("My Devices");
        setAddEnabled(true);
      }
    };

    console.log("route.params:", route.params);
    initializeComponent();
  }, [route.params]);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "My Device" && device.category === "My Devices") ||
      (selectedCategory === "Family" && device.category === "Family");
    return matchesSearch && matchesCategory;
  });
  console.log(
    "Filtered devices:",
    filteredDevices.length,
    "from",
    devices.length
  );

  const getDeviceIcon = (type) => {
    const iconStyle = { width: 32, height: 32, resizeMode: "contain" };
    switch (type) {
      case "phone":
        return (
          <Image
            source={require("../assets/icons/smartphone.png")}
            style={iconStyle}
          />
        );
      case "laptop":
        return (
          <Image
            source={require("../assets/icons/laptop.png")}
            style={iconStyle}
          />
        );
      case "tablet":
        return (
          <Image
            source={require("../assets/icons/tablet.png")}
            style={iconStyle}
          />
        );
      default:
        return null;
    }
  };

  const navigateToRadar = () => {
    navigation.navigate("DeviceRadar");
  };

  const handleBackPress = () => {
    if (showAddForm) {
      setShowAddForm(false);
      setEditingDevice(null);
      navigation.setParams({ selectedDevice: undefined });
    } else {
      navigation.navigate("Home");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.purple1} />
        <Text style={styles.headerTitle}>Loading Devices...</Text>
      </View>
    );
  }

  if (showAddForm) {
    const formTitle = editingDevice ? "Edit Device" : "Add Device";
    return (
      <KeyboardAvoidingView
        style={styles.absoluteContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{formTitle}</Text>
            <TouchableOpacity onPress={navigateToRadar}>
              <Image
                source={require("../assets/icons/scan.png")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={[styles.row, { marginBottom: 16 }]}>
              <View style={styles.deviceInfo}>
                {getDeviceIcon(newDeviceType)}
                <TextInput
                  style={styles.deviceNameInput}
                  value={newDeviceName}
                  onChangeText={setNewDeviceName}
                />
              </View>
              <Switch
                value={addEnabled}
                onValueChange={setAddEnabled}
                trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
                thumbColor={"#ffffff"}
              />
            </View>
            <View style={styles.divider} />
            <View style={[styles.row, { marginTop: 16 }]}>
              <Text
                style={
                  addEnabled ? styles.connectedText : styles.disconnectedText
                }
              >
                {addEnabled ? "• Connected" : "• Disconnected"}
              </Text>
              <TouchableOpacity
                onPress={(event) => {
                  event.stopPropagation();
                  setShowTypeSelector(!showTypeSelector);
                }}
                style={styles.typeSelector}
                activeOpacity={0.7}
              >
                <Text style={styles.selectTypeText}>
                  {newDeviceType
                    ? newDeviceType === "phone"
                      ? "iPhone"
                      : newDeviceType === "laptop"
                      ? "Laptop"
                      : "Tablet"
                    : "Select Type"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={COLORS.purple1}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.categoryTitle}>Category</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={
                  newDeviceCategory === "My Devices"
                    ? styles.categoryButtonActive
                    : styles.categoryButtonInactive
                }
                onPress={() => setNewDeviceCategory("My Devices")}
              >
                <Text
                  style={
                    newDeviceCategory === "My Devices"
                      ? styles.categoryTextActive
                      : styles.categoryTextInactive
                  }
                >
                  My Devices
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  newDeviceCategory === "Family"
                    ? styles.categoryButtonActive
                    : styles.categoryButtonInactive
                }
                onPress={() => setNewDeviceCategory("Family")}
              >
                <Text
                  style={
                    newDeviceCategory === "Family"
                      ? styles.categoryTextActive
                      : styles.categoryTextInactive
                  }
                >
                  Family
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDeviceAdded}
          >
            <Text style={styles.primaryButtonText}>
              {editingDevice ? "Save Changes" : "Add Now"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Dropdown rendered OUTSIDE ScrollView at screen level */}
        {showTypeSelector && (
          <View style={styles.screenDropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setNewDeviceType("phone");
                setShowTypeSelector(false);
              }}
            >
              <Text style={styles.dropdownText}>iPhone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setNewDeviceType("laptop");
                setShowTypeSelector(false);
              }}
            >
              <Text style={styles.dropdownText}>Laptop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setNewDeviceType("tablet");
                setShowTypeSelector(false);
              }}
            >
              <Text style={styles.dropdownText}>Tablet</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.absoluteContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 200,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Device</Text>
          <TouchableOpacity onPress={navigateToRadar}>
            <Image
              source={require("../assets/icons/scan.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Device"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={COLORS.gray2}
          />
          <Ionicons
            name="search"
            size={20}
            color={COLORS.gray2}
            style={styles.searchIcon}
          />
        </View>

        <View style={styles.categoryFilterContainer}>
          {["All", "My Device", "Family"].map((category) => (
            <TouchableOpacity
              key={category}
              style={
                selectedCategory === category
                  ? styles.categoryButtonActive
                  : styles.categoryButtonInactive
              }
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={
                  selectedCategory === category
                    ? styles.categoryTextActive
                    : styles.categoryTextInactive
                }
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredDevices.length === 0 ? (
          <EmptyState onAddPress={() => setShowAddForm(true)} />
        ) : (
          <View>
            <View style={{ marginTop: 20 }}>
              {filteredDevices.map((device) => (
                <View key={device.id} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => handleDeleteDevice(device.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close" size={16} color="#A0A0A0" />
                  </TouchableOpacity>
                  <View style={[styles.row, { marginBottom: 16 }]}>
                    <View style={styles.deviceInfo}>
                      {getDeviceIcon(device.type)}
                      <Text style={styles.deviceName}>{device.name}</Text>
                    </View>
                    <Switch
                      value={device.enabled}
                      onValueChange={() =>
                        toggleDevice(device.id, device.enabled)
                      }
                      trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
                      thumbColor={"#ffffff"}
                    />
                  </View>
                  <View style={styles.divider} />
                  <View
                    style={[
                      styles.row,
                      {
                        marginTop: 16,
                        justifyContent: "space-between",
                        paddingHorizontal: 8,
                      },
                    ]}
                  >
                    <Text
                      style={
                        device.enabled
                          ? styles.connectedText
                          : styles.disconnectedText
                      }
                    >
                      {device.connected ? "• Connected" : "• Disconnected"}
                    </Text>
                    <Text style={styles.categoryText}>{device.category}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {filteredDevices.length > 0 && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.bottomPrimaryButton]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.primaryButtonText}>Add New Device</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 50,
    },
    absoluteContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      position: "relative",
      overflow: "visible",
    },
    scrollContent: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 200, // Increased for taller button container
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
      overflow: "visible",
    },
    scrollContentContainer: {
      paddingBottom: 120,
      flexGrow: 1,
    },
    bottomButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingBottom: 40,
      paddingTop: 10,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      elevation: 25,
      zIndex: 999,
      minHeight: 140,
    },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
    },
    searchInput: {
      flex: 1,
      height: 50,
      backgroundColor: theme.colors.card,
      borderRadius: 999,
      paddingLeft: isRTL ? 16 : 24,
      paddingRight: isRTL ? 24 : 50,
      fontSize: 16,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder,
      color: theme.colors.text,
    },
    searchIcon: {
      position: "absolute",
      right: 20,
      transform: [{ scaleX: isRTL ? -1 : 1 }],
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      position: "relative",
      overflow: "visible",
    },
    deleteButton: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 5,
      opacity: 0.7,
    },
    row: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      overflow: "visible",
      position: "relative",
    },
    deviceInfo: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 16,
    },
    deviceName: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
    },
    deviceNameInput: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.cardBorder,
      marginVertical: 16,
    },
    connectedText: {
      color: "#10B981",
      fontWeight: "500",
    },
    disconnectedText: {
      color: theme.colors.subtext,
      fontWeight: "500",
    },
    selectTypeText: {
      color: theme.colors.text,
    },
    categoryText: {
      color: theme.colors.text,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
    },
    categoryFilterContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 12,
      marginTop: 20,
    },
    categoryButtonActive: {
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: COLORS.purple1,
      backgroundColor: theme.colors.card,
    },
    categoryButtonInactive: {
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder,
      backgroundColor: theme.colors.card,
      opacity: 0.85,
    },
    categoryTextActive: {
      color: theme.colors.text,
      fontWeight: "500",
    },
    categoryTextInactive: {
      color: theme.colors.subtext,
      fontWeight: "500",
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 0,
      marginBottom: 75,
    },
    primaryButtonText: {
      color: theme.colors.primaryTextOn,
      fontSize: 18,
      fontWeight: "500",
    },
    bottomPrimaryButton: {
      marginTop: 20,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginTop: 40,
      marginBottom: 40,
    },
    emptyImage: {
      width: 150,
      height: 150,
      resizeMode: "contain",
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 16,
      color: theme.colors.subtext,
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 24,
    },
    scanButton: {
      width: "100%",
      paddingVertical: 16,
      borderWidth: 2,
      borderColor: COLORS.purple1,
      borderRadius: 16,
      alignItems: "center",
    },
    scanButtonText: {
      color: COLORS.purple1,
      fontSize: 18,
      fontWeight: "500",
    },
    typeSelector: {
      position: "relative",
      zIndex: 999,
      marginVertical: 16,
      marginLeft: 12,
      minHeight: 44,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "auto",
      flexShrink: 0,
    },
    screenDropdown: {
      position: "absolute",
      top: 280,
      right: 30,
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 50,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      minWidth: 140,
      zIndex: 99999,
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
      minHeight: 44,
    },
    dropdownText: {
      fontSize: 15,
      color: COLORS.purple8,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 20,
      flexShrink: 1,
    },
  });
