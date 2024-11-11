import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import Sahha, {
  SahhaEnvironment,
  SahhaSensor,
  SahhaSensorStatus,
} from "sahha-react-native";
import { WebView } from 'react-native-webview';


export default function App() {
  const [sensorStatus, setSensorStatus] = useState<SahhaSensorStatus>(
    SahhaSensorStatus.pending
  );

  const [authStatus, setAuthStatus] = useState<boolean>(false);

  const sensorList = [SahhaSensor.step_count, SahhaSensor.sleep, SahhaSensor.device_lock, SahhaSensor.heart_rate, SahhaSensor.heart_rate_variability_sdnn];

  const APPID = "gcNrPzZ9dGIjuYN7JyKOlv0EVXn0Q6sU";
  const APPSCRT = "TKFsLCrzILD5NB9uxJ7XrRusTdwcJ7UPEv8gbcuYNAmc3pCPRRnse7cGcHAI7YIn";
  const USERID = "satya_mobile"; // Change these per user (add a user input for device name)

  var isDisabled =
    sensorStatus === SahhaSensorStatus.unavailable ||
    sensorStatus === SahhaSensorStatus.enabled;

  useEffect(() => {
    console.log("hello");
    const settings = {
      environment: SahhaEnvironment.sandbox, // Required -  .sandbox for testing
    };
    Sahha.configure(settings, (error: string, success: boolean) => {
      console.log(`Success: ${success}`);
      if (error) {
        console.error(`Error: ${error}`);
      } else {
        getSensorStatus();
        getUserAuthenticated();
      }
    });
  }, []);

  const getUserAuthenticated = () => {
    Sahha.isAuthenticated(
      (error: string, success: boolean) => {
        if (error) {
          console.error(`Error: ${error}`);
        } else if (success != null) {
          console.log("authenticated " + success);
          setAuthStatus(success)
        }
      }
    );
  }

  const getSensorStatus = () => {
    console.log("check");
    Sahha.getSensorStatus(
      sensorList,
      (error: string, value: SahhaSensorStatus) => {
        console.log("checked " + value);
        if (error) {
          console.error(`Error: ${error}`);
        } else if (value != null) {
          console.log(`Sensor status: ` + value);
          setSensorStatus(value);
          if (value == SahhaSensorStatus.pending) {
            console.log("pending");
            // Show your custom UI asking your user to setup Sleep in the Health App
          }
        }
      }
    );
  };

  const enableSensors = () => {
    console.log("enable");
    Sahha.enableSensors(
      sensorList,
      (error: string, value: SahhaSensorStatus) => {
        console.log("enable " + value);
        if (error) {
          console.error(`Error: ${error}`);
        } else if (value != null) {
          console.log(`Sensor status: ` + value);
          setSensorStatus(value);
          if (value == SahhaSensorStatus.pending) {
            console.log("pending");
            // Show your custom UI asking your user to setup Sleep in the Health App
          }
        }
      }
    );
  };

  const auth = () => {
    Sahha.authenticate(APPID, APPSCRT, USERID,
      (error: string, success: boolean) => {
        if (error) {
          console.error(`Error: ${error}`);
        } else if (success != null) {
          console.log("authenticated " + success);
          setAuthStatus(success)
        }
      }
    )
  }

  // Next Steps: https://docs.sahha.ai/docs/guides/widgets#react-native


  const MyWebComponent = () => {

    const [profileToken, setProfileToken] = useState<string>('');
    console.log("empty -  Profile Token: ", profileToken);


    useEffect(() => {
      Sahha.getProfileToken((error: string, token?: string) => {
        if (error) {
          console.error(`Error: ${error}`);
        } else if (token) {
          // console.log(`** Profile Token: ${profileToken}`);
          // ${profileToken}` is now empty -> ${token}

          console.log(`** getProfileToken ** Profile Token: ${token}`);
          setProfileToken(token);
          // console.log(`^^^^ Profile Token: ${profileToken}`);
        } else {
          console.log(`Profile Token: null`);
        }
      });
    }, []);

    console.log("MyWebComponent -- Auth Status: ", authStatus);
    console.log("MyWebComponent -- Sensor Status: ", sensorStatus);
    console.log("MyWebComponent -- Profile Token: ", profileToken);

    if (!profileToken) {
      return <Text>no profileToken </Text>;
    } else {
      // return <Text>show WebView...</Text>;
      return <View style={styles.container}>

        {/* // Use https://webview.sahha.ai/app in production */}

        <WebView source={{
          uri: "https://sandbox.webview.sahha.ai/app",
          // uri: "https://webview.sahha.ai/app",
          headers: {
            'Authorization': profileToken,
          },
        }}
          // style={{ flex: 1 }} 
          style={styles.webview}
        />
      </View >;
    }
  }

  return (
    <View style={styles.container}>

      <Text>AUTHENTICATED : {String(authStatus)}</Text>
      <Button
        title="Authenticate"
        disabled={authStatus}
        onPress={auth}
      />

      <Text>SENSOR STATUS : {SahhaSensorStatus[sensorStatus]}</Text>
      <Button title="Check Sensors" onPress={getSensorStatus} />
      <Button
        title="Enable Sensors"
        disabled={isDisabled}
        onPress={enableSensors}
      />

      <MyWebComponent />

      <Button
        title={"Open App Settings"}
        onPress={() => {
          Sahha.openAppSettings();
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  webview: {
    marginTop: 20,
    maxHeight: 500,
    width: 320,
    // width: "100%",
    // height: "100%",
    flex: 1
  }
});
