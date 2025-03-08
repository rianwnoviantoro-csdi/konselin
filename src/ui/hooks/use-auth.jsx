import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/slice";

function UseAuth() {
  const token = useSelector(selectCurrentToken);
  let isAuthenticated = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { id, name } = decoded;

    isAuthenticated = true;

    return {
      id,
      name,
      isAuthenticated,
    };
  }
  return {
    id: "",
    name: "",
    isAuthenticated,
  };
}

export default UseAuth;
