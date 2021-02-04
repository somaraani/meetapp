import React, { FC, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";

interface Props {
  navigation: any;
}

const Login: FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = () => {
    console.log(email, password);
    navigation.navigate("Main");
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={{ marginBottom: 70 }}
        />
        <View>
          <Text style={{ color: "#fff", marginBottom: 15, fontWeight: "bold" }}>
            Login to your account
          </Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            placeholderTextColor="rgba(255, 250, 255,.45)"
            onChangeText={(value) => setEmail(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            placeholderTextColor="rgba(255, 250, 255,.45)"
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={submitHandler}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "rgba(255, 250, 255, 0.6)", marginBottom: 70 }}>
          Forgot password?
        </Text>
        <Text style={{ color: "#fff" }}>
          Don’t have an account?{" "}
          <Text
            style={{ color: "#2196F3", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    paddingHorizontal: 11,
    paddingVertical: 4,
    width: 200,
    color: "white",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: 200,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
});
