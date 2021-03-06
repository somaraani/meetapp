import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type AuthParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Meetings: undefined;
  MeetingTabs: undefined;
  MainSettings: undefined;
  MeetingMap: undefined;
  MeetingMembers: undefined;
  MeetingSettings: undefined;
  CreateMeeting: undefined;
  JoinMeeting: undefined;
  LocationPicker: undefined;
  MeetingMembersPages: undefined;
  InviteMembers: undefined;
  Invites: undefined;
  StartLocationPicker: undefined;
};

export type AuthNavProps<T extends keyof AuthParamList> = {
  navigation: StackNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};
