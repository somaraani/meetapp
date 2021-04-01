import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Coordinate,
  Invitation,
  Journey,
  JourneySetting,
  Meeting,
  MeetingDetail,
  Notification,
  PublicUserData,
  PublicUserResponse,
  User,
} from "@types";
import jwtDecode from "jwt-decode";
import config from "../config";
const axios = require("axios");
const API_URL = config.API_URL;
console.log(config.API_URL);

export class ApiWrapper {
  public token: string;
  public id: string;
  constructor() {
    this.token = "";
    this.id = "";
  }

  public reset(): void {
    this.token = "";
    this.id = "";
  }

  public setToken(token: string): void {
    this.token = token;
    this.id = jwtDecode<any>(token).id;
  }

  async signIn(email: string, password: string): Promise<string> {
    let payload = { email: email, password: password };
    let res = await axios.post(`${API_URL}authenticate/`, payload);
    let data = res.data;
    this.token = data.access_token;
    let res2 = await axios.get(`${API_URL}users/self/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    this.id = res2.data.id;

    return data.access_token;
  }

  signOut(): void {
    this.token = "";
    this.id = "";
  }

  isSignedIn(): boolean {
    if (this.token) {
      return true;
    } else {
      return false;
    }
  }

  async createUser(
    email: string,
    password: string,
    details: PublicUserData
  ): Promise<User> {
    let payload = { email: email, password: password, details: details };
    let res = await axios.post(`${API_URL}users/`, payload);
    let data = res.data;
    return data;
  }

  async updateUser(user: User): Promise<User> {
    let payload = user;
    let res = await axios.put(`${API_URL}users/${this.id}/`, payload, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async getUser(): Promise<User> {
    let res = await axios.get(`${API_URL}users/self/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async getPublicUser(id: string): Promise<PublicUserData> {
    let res = await axios.get(`${API_URL}users/${id}/public/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async getUsers(query: string): Promise<PublicUserResponse[]> {
    let res = await axios.get(`${API_URL}users/`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: { query: query },
    });
    let data = res.data;
    return data;
  }

  async getUsersFromMeeting(meetingId: string): Promise<PublicUserResponse[]> {
    console.log("GET " + meetingId);
    let res = await axios.get(`${API_URL}meetings/${meetingId}/users`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async createMeeting(
    name: string,
    description: string,
    time: string,
    location: Coordinate
  ): Promise<Meeting> {
    let payload = {
      name: name,
      description: description,
      time: time,
      location: location,
    };
    let res = await axios.post(`${API_URL}meetings/`, payload, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async getMeetings(): Promise<Meeting[]> {
    let res = await axios.get(`${API_URL}meetings/`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: { userId: this.id },
    });
    let data = res.data;
    return data;
  }

  async getMeeting(meetingID: string): Promise<Meeting> {
    let res = await axios.get(`${API_URL}meetings/${meetingID}/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async updateMeeting(
    meetingId: string,
    MeetingDetail: MeetingDetail
  ): Promise<Meeting> {
    let payload = MeetingDetail;
    let res = await axios.put(
      `${API_URL}meetings/${meetingId}/details/`,
      payload,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    let data = res.data;
    return data;
  }

  async deleteMeeting(meetingID: string): Promise<void> {
    await axios.delete(`${API_URL}meetings/${meetingID}/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async getNotifications(): Promise<Notification[]> {
    let res = await axios.get(`${API_URL}notifications/`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async updateExpoPushToken(token: string): Promise<void> {
    let payload = { token: token };
    await axios.put(`${API_URL}users/expo-push-token`, payload, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async updateInvitation(
    invitationId: string,
    accepted: boolean
  ): Promise<Invitation> {
    let payload = { accepted: accepted };
    const res = await axios.patch(
      `${API_URL}invitations/${invitationId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return res.data;
  }

  async getInvitations(query: {
    userId: string;
    status: string;
    meetingId: string;
  }): Promise<Invitation[]> {
    let res = await axios.get(`${API_URL}invitations`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: query,
    });
    let data = res.data;
    return data;
  }

  async createInvitation(
    userId: string,
    meetingId: string
  ): Promise<Invitation> {
    let payload = { userId, meetingId };
    let res = await axios.post(`${API_URL}invitations`, payload, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    let data = res.data;
    return data;
  }

  async getJourney(journeyId: string): Promise<Journey> {
    const res = await axios.get(`${API_URL}journeys/${journeyId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return res.data;
  }

  async updateJourneySetting(
    journeyId: string,
    journeySettings: JourneySetting
  ): Promise<Journey> {
    let payload = journeySettings;
    const res = await axios.put(
      `${API_URL}journeys/${journeyId}/settings`,
      payload,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return res.data;
  }
}

/* Create User Test - Passed
api.createUser("nav67@gmail.com", "password", {displayName:"TESTACCOUNT55", displayPicture:"https://images.unsplash.com/photo-1535498051285-5613026fae05?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlzcGxheXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"});
*/

/* Sign In Test - Passed
api.signIn('nav66@gmail.com', 'password').then(()=>{
  console.log(api.id);
  console.log(api.token);
});
*/

/* Testing isSignedIn() and signOut() - Passed
console.log(api.isSignedIn());
api.signIn('nav66@gmail.com', 'password').then(()=>{
  console.log(api.isSignedIn());
  api.signOut();
  console.log(api.isSignedIn());
});
*/

/* Testing updateUser - Failed
api.signIn('nav66@gmail.com', 'password').then(()=>{
  api.updateUser({DOCUMENTATION DOES NOT LINE UP WITH THIS});
});
*/

/* Testing getUser- Passed
api.signIn('nav66@gmail.com', 'password').then(()=>{
  api.getUser();
});
*/

/* Testing getUsers- Passed
api.signIn('nav67@gmail.com', 'password').then(()=>{
  api.getUsers("TESTACCOUNT55");
});
*/

/* Testing getPublicUser- Passed
api.signIn('nav67@gmail.com', 'password').then(()=>{
  api.getPublicUser("603d366137fe8d1b08225d48");
});
*/

/* Updating and getting meeting - Passed
api.signIn('nav67@gmail.com', 'password').then(()=>{
  api.updateMeeting('603dd5b44f26be3570f491d7', {description:"Updated Meeting 1", location:{lat:1,lng:3}, time:'2021-03-04'}).then(()=> {
    api.getMeeting('603dd5b44f26be3570f491d7')
  });
*/

/* Tested Deleting Meeting - Passed
api.signIn('nav67@gmail.com', 'password').then(()=>{
  api.deleteMeeting('603dd5b44f26be3570f491d7').then(()=> {
    api.getMeetingsByUserId('603dce964f26be3570f491d4')
  });
*/
