import React, { FC, useContext, useState } from "react";
import { StyleSheet, Text, TextInput, View, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthNavProps, AuthParamList } from "../src/AuthParamList";
import { authenticate, createUser } from "../api/ApiWrapper";
import { ApiContext } from "../src/ApiProvider";

const Register = ({ navigation }: AuthNavProps<"Register">) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { register, login } = useContext(ApiContext);

  const submitHandler = async () => {
    // createUser(email, password, {
    //   displayName: name,
    //   displayPicture: "sample picture",
    // })
    //   .then(() =>
    //     authenticate(email, password)
    //       .then(({ access_token }) => login(access_token))
    //       .catch((e) => console.log(e))
    //   )
    //   .catch((e) => console.log(e));
    try {
      if (
        name !== "" &&
        email !== "" &&
        password !== "" &&
        confirmPass !== "" &&
        password === confirmPass
      ) {
        await register(email, password, {
          displayName: name,
          displayPicture:
            "https://images.unsplash.com/photo-1535498051285-5613026fae05?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlzcGxheXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
        });

        let token = await login(email, password);

        console.log(token);
      } else if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirmPass === ""
      ) {
        ToastAndroid.show("Fields must not be empty", ToastAndroid.SHORT);
      } else if (password !== confirmPass) {
        ToastAndroid.show("Password does not match", ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.response.status === 400) {
        ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
      } else if (error.response.status === 409) {
        ToastAndroid.show("Email already in use", ToastAndroid.SHORT);
      }
    }
  };

  return (
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
