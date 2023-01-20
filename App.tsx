import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from "react";
import Sahha, { SahhaEnvironment, SahhaSensorStatus } from "sahha-react-native";

export default function App() {
  const [sensorStatus, setSensorStatus] = useState<SahhaSensorStatus>(
    SahhaSensorStatus.pending
  );

  var isDisabled =
  sensorStatus === SahhaSensorStatus.unavailable ||
  sensorStatus === SahhaSensorStatus.enabled;

  useEffect(() =>
  {
    console.log("hello");
                           const settings = {
                            environment: SahhaEnvironment.development, // Required -  .development for testing
                          };
    Sahha.configure(settings, (error: string, success: boolean) => {
      console.log(`Success: ${success}`);
      if (error) {
        console.error(`Error: ${error}`);
      } else {
        getSensorStatus();
      }
    });
  }, []);

  const getSensorStatus = () => {
    console.log("check")
    Sahha.getSensorStatus((error: string, value: SahhaSensorStatus) => {
      console.log("checked " + value)
      if (error) {
        console.error(`Error: ${error}`);
      } else if (value != null) {
        console.log(`Sensor status: ` + value)
        setSensorStatus(value);
        if (value == SahhaSensorStatus.pending) {
          console.log("pending");
          // Show your custom UI asking your user to setup Sleep in the Health App
        }
      }
    });
  };

  const enableSensors = () => {
    console.log("enable")
    Sahha.enableSensors((error: string, value: SahhaSensorStatus) => {
      console.log("enable " + value)
      if (error) {
        console.error(`Error: ${error}`);
      } else if (value != null) {
        console.log(`Sensor status: ` + value)
        setSensorStatus(value);
        if (value == SahhaSensorStatus.pending) {
          console.log("pending");
          // Show your custom UI asking your user to setup Sleep in the Health App
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>SENSOR STATUS : {SahhaSensorStatus[sensorStatus]}</Text>
      <Button
        title="Enable Sensors"
        disabled={isDisabled}
        onPress={enableSensors}
      />
      <Button
        title={'Open App Settings'}
        onPress={() => {
          Sahha.openAppSettings();
        }
      }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
