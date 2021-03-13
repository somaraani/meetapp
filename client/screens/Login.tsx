import React, { FC, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { AuthNavProps, AuthParamList } from "../src/AuthParamList";
import { ApiContext } from "../src/ApiProvider";

const Login = ({ navigation }: AuthNavProps<"Login">) => {
  const { login } = useContext(ApiContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    // authenticate(email, password)
    //   .then(({ access_token }) => login(access_token))
    //   .catch((e) => console.log(e));
    try {
      let token = await login(email, password);

      ToastAndroid.show("Login Successful!", ToastAndroid.SHORT);
    } catch (error) {
      console.log(error.response.status);

      if ((email === "" || password === "") && error.response.status === 401) {
        ToastAndroid.show("Fields must not be empty", ToastAndroid.SHORT);
      } else if (error.response.status === 401) {
        ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ marginBottom: 70 }}
      />
      <View>
        <Text style={{ color: "#000", marginBottom: 15, fontWeight: "bold" }}>
          Login to your account
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          theme={{ colors: { primary: "#2196F3" } }}
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={true}
          theme={{ colors: { primary: "#2196F3" } }}
          mode="outlined"
        />
        <Button
          onPress={submitHandler}
          mode="contained"
          theme={{ colors: { primary: "#2196F3" } }}
          style={{ marginBottom: 10 }}
        >
          Sign In
        </Button>
      </View>
      <Text style={{ color: "rgba(0, 0, 0, 0.6)", marginBottom: 70 }}>
        Forgot password?
      </Text>
      <Text style={{ color: "#000" }}>
        Don’t have an account?{" "}
        <Text
          style={{ color: "#2196F3", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  input: {
    width: 250,
    marginBottom: 15,
    fontSize: 16,
    height: 40,
  },
  button: {
    width: 200,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
});
