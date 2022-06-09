import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // Remember, the backend needs to be authorized with a token
  // We're providing a token you can use to interact with the backend API
  // DON'T MODIFY THIS TOKEN
  static token = null;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    // console.debug("token ******",JoblyApi.token);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get all companies or filter if query is provided. */

  static async getCompanies(query = {}) {
    let res = await this.request(`companies`, query);
    return res.companies;
  }

  /** Get all jobs or filter if query is provided. */

  static async getJobs(query = {}) {
    let res = await this.request(`jobs`, query);
    return res.jobs;
  }

  /** Register User and return token*/

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Login User and return token*/

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;

  }

  /** Get User detail*/

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update User detail*/

  static async updateProfile(username, formData) {
    let res = await this.request(`users/${username}`, formData, "patch");
    return res.user;
  }
}

export default JoblyApi;
