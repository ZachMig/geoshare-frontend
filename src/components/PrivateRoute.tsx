import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

//https://stackoverflow.com/questions/66412660/what-is-the-typescript-type-to-accept-any-kind-of-react-component-as-prop

interface Props {
  Child: React.ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ Child }) => {
  const auth = useAuth();

  return auth.isLoggedIn ? Child : <Navigate to="/login" />;
};

export default PrivateRoute;
