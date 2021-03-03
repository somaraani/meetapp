"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios = require('axios');
var API_URL = 'http://localhost:3000/';
var ApiWrapper = /** @class */ (function () {
    function ApiWrapper() {
        this.token = "";
        this.id = "";
    }
    ApiWrapper.prototype.signIn = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res, data, res2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { email: email, password: password };
                        return [4 /*yield*/, axios.post(API_URL + "authenticate/", payload)];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        this.token = data.access_token;
                        return [4 /*yield*/, axios.get(API_URL + "users/self/", { headers: { "Authorization": "Bearer " + this.token } })];
                    case 2:
                        res2 = _a.sent();
                        this.id = (res2.data).id;
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiWrapper.prototype.signOut = function () {
        this.token = "";
        this.id = "";
    };
    ApiWrapper.prototype.isSignedIn = function () {
        if (this.token) {
            return true;
        }
        else {
            return false;
        }
    };
    ApiWrapper.prototype.createUser = function (email, password, details) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { email: email, password: password, details: details };
                        return [4 /*yield*/, axios.post(API_URL + "users/", payload)];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.updateUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { user: user };
                        return [4 /*yield*/, axios.put(API_URL + "users/" + this.id + "/", payload, { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(API_URL + "users/self/", { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.getPublicUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(API_URL + "users/" + id + "/public/", { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.getUsers = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(API_URL + "users/", { headers: { "Authorization": "Bearer " + this.token }, params: { query: query } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.createMeeting = function (description, time, location) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { description: description, time: time, location: location };
                        return [4 /*yield*/, axios.post(API_URL + "meetings/", payload, { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.getMeetingsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(API_URL + "meetings/", { headers: { "Authorization": "Bearer " + this.token }, params: { userId: userId } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.getMeeting = function (meetingID) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(API_URL + "meetings/" + meetingID + "/", { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.updateMeeting = function (meetingId, MeetingDetail) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = MeetingDetail;
                        return [4 /*yield*/, axios.put(API_URL + "meetings/" + meetingId + "/details/", payload, { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ApiWrapper.prototype.deleteMeeting = function (meetingID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios["delete"](API_URL + "meetings/" + meetingID + "/", { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiWrapper.prototype.getNotifications = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(API_URL + "notifications/", { headers: { "Authorization": "Bearer " + this.token } })];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return ApiWrapper;
}());
var api = new ApiWrapper();
api.signIn('nav67@gmail.com', 'password').then(function () {
    api.getUsers("TESTACCOUNT55");
});
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
