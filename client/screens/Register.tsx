import React, { FC, useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  navigation: any;
}

const Register: FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const submitHandler = () => {
    console.log(name, email, password, confirmPass);
    navigation.navigate("Main");
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View>
          <Text style={{ color: "#fff", marginBottom: 15, fontWeight: "bold" }}>
            Create your account
          </Text>
          <TextInput
            style={styles.input}
            placeholder="full name"
            placeholderTextColor="rgba(255, 250, 255,.45)"
            onChangeText={(value) => setName(value)}
          />
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
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="confirm password"
            placeholderTextColor="rgba(255, 250, 255,.45)"
            secureTextEntry={true}
            onChangeText={(value) => setConfirmPass(value)}
          />
          <TouchableOpacity style={styles.button} onPress={submitHandler}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "#fff" }}>
            Already have an account?{" "}
            <Text
              style={{ color: "#2196F3", fontWeight: "bold" }}
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
};

export default Register;

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
    backgroundColor: "white",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 70,
  },
});
