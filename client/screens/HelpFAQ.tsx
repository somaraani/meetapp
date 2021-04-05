import React, { useContext, useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  View, Linking,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, ListItem } from "react-native-elements";

const HelpFAQ = ({ navigation }) => {
  
    const backAction = () => {
      navigation.navigate("Meetings");
      return true;
    };
  
    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
      };
    }, []);
  
  
    return (
        // const InviteStack = createStackNavigator<AuthParamList>();
        <View style={{ flex: 1 }}><ScrollView>
          <ListItem key={1} style={{padding: 15}}><ListItem.Content>
              <ListItem.Title>
                  <Text style={{ fontWeight: "bold" }}>
                    Creating a Meeting
                  </Text>
              </ListItem.Title>
              <ListItem.Content style={{ paddingLeft: 15 }}>
                  <Text style={{ color: "black" }}>{"\n"}
                  {"- "}Tap the <Text style={{fontWeight:"bold"}}>Hamburger Bar icon</Text> (<Icon name="menu" color="black" size={13} />) in the top left and tap on <Icon name="home" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Meetings</Text>. {"\n\n"}
                  {"- "}On the <Icon name="home" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Meetings</Text> page, tap the blue <Text style={{fontWeight:"bold",color:"#5aa3fb"}}>+</Text> icon in the top right to create a new Meeting. {"\n\n"}
                  {"- "}You should see a screen titled <Text style={{fontWeight:"bold"}}>Create Meeting</Text>. {"\n\n"}
                  {"- "}You can now enter the Meeting details. <Text style={{fontWeight:"bold"}}>Note: </Text> tapping on the Location field will direct you to an interactive map where you can select a Meeting location. {"\n\n"}
                  {"- "}Once these fields are filled correctly, the <Text style={{fontWeight:"bold", color:"#5aa3fb", fontSize:13}}>CREATE</Text> button will be activated to confirm your choices.
                  </Text>
              </ListItem.Content>
              <ListItem.Subtitle style={{ fontWeight: "bold"}}><Text>_______</Text></ListItem.Subtitle>
        </ListItem.Content></ListItem>

        <ListItem key={2} style={{padding: 15}}><ListItem.Content>
              <ListItem.Title>
                  <Text style={{ fontWeight: "bold" }}>
                    Inviting Someone to Your Meeting
                  </Text>
              </ListItem.Title>
              <ListItem.Content style={{ paddingLeft: 15 }}>
                  <Text style={{ color: "black" }}>{"\n"}
                  {"- "}Tap the <Text style={{fontWeight:"bold"}}>Hamburger Bar icon</Text> (<Icon name="menu" color="black" size={13} />) in the top left and tap on <Icon name="home" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Meetings</Text>. {"\n\n"}
                  {"- "}On the <Icon name="home" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Meetings</Text> page, select an existing Meeting and tap on <Icon name="account-multiple" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Members</Text> at the bottom of the screen.{"\n\n"}
                  {"- "}On this new screen, tapping on the blue <Icon name="account-plus" color="#5aa3fb" size={13} /> button at the bottom will allow you to search for users to invite to your meeting. {"\n\n"}
                  {"- "}Tap on the user you would like to add and they should receive an invite shortly.
                  </Text>
              </ListItem.Content>
              <ListItem.Subtitle style={{ fontWeight: "bold"}}><Text>_______</Text></ListItem.Subtitle>
        </ListItem.Content></ListItem>

        <ListItem key={3} style={{padding: 15}}><ListItem.Content>
              <ListItem.Title>
                  <Text style={{ fontWeight: "bold" }}>
                    Setting a Start Location
                  </Text>
              </ListItem.Title>
              <ListItem.Content style={{ paddingLeft: 15 }}>
                  <Text style={{ color: "black" }}>{"\n"}
                  {"- "}Tap the <Text style={{fontWeight:"bold"}}>Hamburger Bar icon</Text> (<Icon name="menu" color="black" size={13} />) in the top left and tap on <Icon name="home" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Meetings</Text>. {"\n\n"}
                  {"- "}On the <Icon name="home" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Meetings</Text> page, select an existing Meeting and tap on {"\""}Settings{"\""} at the bottom-right of the screen.{"\n\n"}
                  {"- "}On this new screen, tapping on the <Icon name="tooltip-edit" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Set Starting Location</Text> will open an interactive map to select your starting location. {"\n\n"}
                  {"- "}Once you are done, the <Icon name="map" color="black" size={13} /> <Text style={{fontWeight:"bold"}}>Map</Text> page will show you your navigation route and the optimal time to depart.
                  </Text>
              </ListItem.Content>
              <ListItem.Subtitle style={{ fontWeight: "bold"}}><Text>_______</Text></ListItem.Subtitle>
        </ListItem.Content></ListItem>
        
        <ListItem key={4} style={{padding: 15}}><ListItem.Content>
              <ListItem.Title>
                  <Text style={{ fontWeight: "bold" }}>
                    Accepting an Invitation
                  </Text>
              </ListItem.Title>
              <ListItem.Content style={{ paddingLeft: 15 }}>
                  <Text style={{ color: "black" }}>{"\n"}
                  {"- "}Tap the <Text style={{fontWeight:"bold"}}>Hamburger Bar icon</Text> (<Icon name="menu" color="black" size={13} />) in the top left and tap on <Icon name="mailbox" color={"black"} size={13} /> <Text style={{fontWeight:"bold"}}>Invites</Text>. {"\n\n"}
                  {"- "}If you have any pending invitations, the <Icon name="mailbox" color={"black"} size={13} /> <Text style={{fontWeight:"bold"}}>Invites</Text> page will display the Meeting name and who sent the invitiation. {"\n\n"}
                  {"- "}You can choose to accept or decline this invitation. {"\n\n"}
                  {"- "}If you do not see any invitiations, this means you have not received an invite yet.
                  </Text>
              </ListItem.Content>
              <ListItem.Subtitle style={{ fontWeight: "bold"}}><Text>_______</Text></ListItem.Subtitle>
        </ListItem.Content></ListItem>
        
        <ListItem key={5} style={{padding: 15}}><ListItem.Content>
              <ListItem.Title>
                  <Text style={{ fontWeight: "bold" }}>
                    Need help with something else?
                  </Text>
              </ListItem.Title>
              <ListItem.Content style={{ paddingLeft: 15 }}>
                  <Text style={{ color: "black" }}>{"\n"}
                  {"- "}Send us an email at <Text style={{color:"#5aa3fb"}}onPress={() => Linking.openURL('mailto:support@meetapp.com')}>support@meetapp.com</Text>
                  </Text>
              </ListItem.Content>
              <ListItem.Subtitle style={{ fontWeight: "bold"}}><Text>_______</Text></ListItem.Subtitle>
        </ListItem.Content></ListItem>
        </ScrollView></View>
    );
  };

export default HelpFAQ;

const styles = StyleSheet.create({});
