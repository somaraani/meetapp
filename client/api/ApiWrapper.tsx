import {PublicUserData, User} from "@types"
const axios = require('axios');
const API_URL = 'http://localhost:3000/';

class ApiWrapper {
  constructor(){
    this.token = "";
    this.id = "";
  }

  async signIn(email:string, password:string): Promise<void> {
    let payload = { email: email, password: password};
    let res = await axios.post(`${ API_URL }authenticate/`, payload);
    let data = res.data;
    this.token = data.access_token;    
    let res2 = await axios.get(`${ API_URL }users/self/`, { headers: {"Authorization" : `Bearer ${this.token}`} });
    this.id = (res2.data).id;
  }

  signOut(): void {
    this.token = "";
    this.id = "";
  }

  isSignedIn():boolean {
    if (this.token) {
      return true;
    }
    else {
      return false;
    }
  }

  async createUser(email:string, password:string, details:PublicUserData): Promise<User> {
    let payload = { email: email, password: password, details: details };
    let res = await axios.post(`${ API_URL }users/`, payload);
    let data = res.data;
    return data;
  }

  async updateUser(user:User): Promise<User> {
    let payload = { user: user };
    let res = await axios.put(`${ API_URL }users/${ this.id }/`, payload, { headers: {"Authorization" : `Bearer ${this.token}`} });
    let data = res.data;
    return data;
  }

  async getUser(): Promise<User> {
    let res = await axios.get(`${ API_URL }users/self/`, { headers: {"Authorization" : `Bearer ${this.token}`} });
    let data = res.data;
    console.log(data);
    return data;
  }

}

let api = new ApiWrapper();




/* Create User Test - Passed
api.createUser("nav66@gmail.com", "password", {displayName:"TESTACCOUNT55", displayPicture:"https://images.unsplash.com/photo-1535498051285-5613026fae05?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlzcGxheXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"});
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
  api.updateUser({THIS DID NOT WORK DOCUMENTATION DOES NOT LINE UP WITH THIS});
});
*/

/* Testing getUser- Failed
api.signIn('nav66@gmail.com', 'password').then(()=>{
  api.getUser();
});
*/


