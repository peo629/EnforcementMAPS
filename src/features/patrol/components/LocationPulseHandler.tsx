import { useEffect, useRef, useCallback } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { useAuth } from "@/shared/infra/auth-context";
import { getApiBaseUrl } from "@/shared/config/runtime-config";

const IS_WEB = Platform.OS === "web";

export function LocationPulseHandler() {
  const { token } = useAuth();
  const apiBaseUrl = IS_WEB ? "" : getApiBaseUrl() ?? "";
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);

  const handlePulseResponse = useCallback(
    async (pulseId: string, response: "approve" | "standby" | "decline") => {
      if (!token || !apiBaseUrl) return;

      try {
        let body: Record<string, unknown> = { response };

        if (response === "approve") {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Location Permission",
              "Location permission is required to share your position."
            );
            return;
          }

          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          body.latitude = loc.coords.latitude;
          body.longitude = loc.coords.longitude;
          body.accuracy = loc.coords.accuracy;
        }

        const res = await fetch(
          `${apiBaseUrl}/api/location-pulse/${pulseId}/respond`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "Failed to respond");
          return;
        }

        if (response === "approve") {
          Alert.alert(
            "Location Shared",
            "Your location has been shared with the requester."
          );
        } else if (response === "standby") {
          Alert.alert(
            "Standby Set",
            "You will receive another request in 15 minutes."
          );
        } else {
          Alert.alert("Declined", "Location request has been declined.");
        }
      } catch (err) {
        console.error("[LOCATION-PULSE] Response error:", err);
        Alert.alert("Error", "Failed to respond to location request.");
      }
    },
    [apiBaseUrl, token]
  );

  const showPulseAlert = useCallback(
    (pulseId: string, requesterName: string) => {
      Alert.alert(
        "Location Request",
        `${requesterName} is requesting your current location.`,
        [
          {
            text: "Decline",
            style: "destructive",
            onPress: () => handlePulseResponse(pulseId, "decline"),
          },
          {
            text: "Standby",
            style: "default",
            onPress: () => handlePulseResponse(pulseId, "standby"),
          },
          {
            text: "Approve",
            style: "default",
            onPress: () => handlePulseResponse(pulseId, "approve"),
          },
        ],
        { cancelable: false }
      );
    },
    [handlePulseResponse]
  );

  useEffect(() => {
    if (Platform.OS === "web") return;

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        if (data?.type === "LOCATION_PULSE_REQUEST" && data.pulseId) {
          showPulseAlert(
            data.pulseId as string,
            (data.requesterName as string) || "Supervisor"
          );
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.type === "LOCATION_PULSE_REQUEST" && data.pulseId) {
          showPulseAlert(
            data.pulseId as string,
            (data.requesterName as string) || "Supervisor"
          );
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [showPulseAlert]);

  return null;
}
