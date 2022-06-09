import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesList from "./RoutesList";
import NavBar from "./NavBar";
import UserContext from "./shared/UserContext";
import { useEffect, useState } from "react";
import JoblyApi from "./api";
import jwt from "jwt-decode";
import LoadingSpinner from "./shared/LoadingSpinner";

/** App with user auth methods for jobly application
 *
 * state: currentUser, token, isLoading
 * props: none
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);


  async function signup(formData) {
    const response = await JoblyApi.signup(formData);
    JoblyApi.token = response;
    setToken(response);
  }

  async function login(formData) {
    const response = await JoblyApi.login(formData);
    JoblyApi.token = response;
    setToken(response);
  }

  function logout() {
    setCurrentUser(null);
    setToken(null);
    JoblyApi.token = null;
    localStorage.clear();
  }

  async function updateProfile(formData) {
    const response = await JoblyApi.updateProfile(currentUser.username, {
      ...formData,
    });

    setCurrentUser(response);
  }

  /** useEffect runs on initial render and on changes in token state
   *  - makes request to API for user details from token payload
   *  - updates currentUser and sets token in localStorage
   */
  useEffect(
    function getUser() {
      async function getNewUser() {
        const username = jwt(token).username;
        const response = await JoblyApi.getUser(username);
        setCurrentUser({ ...response });
        localStorage.setItem("token", token);
        setIsLoading(false);
      }
      if (token) {
        JoblyApi.token = token;
        getNewUser();
      } else {
        setIsLoading(false);
      }
    },
    [token]
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <UserContext.Provider value={{ currentUser }}>
      <div className="App">
        <BrowserRouter>
          <NavBar logout={logout} />
          <RoutesList
            signup={signup}
            login={login}
            logout={logout}
            updateProfile={updateProfile}
          />
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
