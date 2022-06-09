import { NavLink } from "react-router-dom";
import { useContext } from "react";
import UserContext from "./shared/UserContext";

/** Nav component with links to home, companies, and jobs components
 * props: logout
 */
function NavBar({ logout }) {
  //   const initialState = {
  //     companies: "nav-link d-inline",
  //     jobs: "nav-link d-inline",
  //     profile: "nav-link d-inline",
  //     login: "nav-link d-inline",
  //     signup: "nav-link d-inline",
  //   };

  //   const [isActive, setIsActive] = useState(initialState);

  const { currentUser } = useContext(UserContext);
  let activeStyle = {
    color: "#3a86ff",
    fontWeight: "bold",
  };

  //   function handleClick(evt) {
  //     const currentNav = evt.target.innerHTML.toLowerCase();
  //     setIsActive({ ...initialState, [currentNav]: "active nav-link d-inline " });
  //   }

  return (
    <nav className="NavBar navbar navbar-dark bg-dark">
      {currentUser ? (
        <div className="container">
          <NavLink className="navbar-brand d-inline" to="/" end>
            Jobly
          </NavLink>
          <div>
            <NavLink
              className="nav-link d-inline"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/companies"
            >
              Companies
            </NavLink>
            <NavLink
              className="nav-link d-inline"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/jobs"
            >
              Jobs
            </NavLink>
            <NavLink
              className="nav-link d-inline"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/profile"
            >
              Profile
            </NavLink>
            <button
              className="NavBar-logout nav-link bg-dark border-0 d-inline"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="container">
          <NavLink className="navbar-brand d-inline" to="/" end>
            Jobly
          </NavLink>
          <div>
            <NavLink
              className="nav-link d-inline"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className="nav-link d-inline"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/signup"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
