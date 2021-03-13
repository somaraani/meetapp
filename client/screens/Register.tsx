import React, { FC, useContext, useState } from "react";
import { StyleSheet, Text, View, ToastAndroid, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
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
        <Image
          source={require("../assets/join.png")}
          style={{ marginBottom: 30 }}
        />
        <Text style={{ color: "#000", marginBottom: 15, fontWeight: "bold" }}>
          Create your account
        </Text>
        <TextInput
          style={styles.input}
          placeholder="full name"
          onChangeText={(value) => setName(value)}
          theme={{ colors: { primary: "#2196F3" } }}
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          placeholder="email"
          onChangeText={(value) => setEmail(value)}
          theme={{ colors: { primary: "#2196F3" } }}
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          theme={{ colors: { primary: "#2196F3" } }}
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          placeholder="confirm password"
          secureTextEntry={true}
          onChangeText={(value) => setConfirmPass(value)}
          theme={{ colors: { primary: "#2196F3" } }}
          mode="outlined"
        />
        <Button
          onPress={submitHandler}
          mode="contained"
          theme={{ colors: { primary: "#2196F3" } }}
          style={{ marginBottom: 30 }}
        >
          Sign Up
        </Button>
      </View>
      <Text style={{ color: "#000" }}>
        Already have an account?{" "}
        <Text
          style={{ color: "#2196F3", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Login")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
};

export default Register;

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
});
