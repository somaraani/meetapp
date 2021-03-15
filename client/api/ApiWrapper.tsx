import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Coordinate,
  Meeting,
  MeetingDetail,
  Notification,
  PublicUserData,
  User,
} from "@types";
const axios = require("axios");
const API_URL = "http://10.0.2.2:3000/";

export class ApiWrapper {
  public token: string;
  private id: string;
  constructor() {
    AsyncStorage.getItem("user").then(async (token) => {
      if (token) {
        this.token = token;
        this.id = (await this.getUser()).id;
      } else {
        this.token = "";
        this.id = "";
      }
    });
    this.token = "";
    this.id = "";
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
    let payload = { user: user };
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

  async getUsers(query: string): Promise<User[]> {
    let res = await axios.get(`${API_URL}users/`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: { query: query },
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
    console.log('sending:')
    console.log(payload)
    console.log(this.token)
    try{
      await axios.put(`${API_URL}users/expo-push-token`, payload, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    }
    catch(e){
      console.log(e)
    }
    
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
