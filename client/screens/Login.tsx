import React, { FC, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { AuthNavProps, AuthParamList } from "../src/AuthParamList";
import { AuthContext } from "../src/AuthProvider";

const Login = ({ navigation }: AuthNavProps<"Login">) => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    // authenticate(email, password)
    //   .then(({ access_token }) => login(access_token))
    //   .catch((e) => console.log(e));
    try {
      let token = await login(email, password);
      console.log(token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
