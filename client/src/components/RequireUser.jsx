import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireUser = ({ children }) => {
    
    const loginInfo = useSelector((state) => state.slice.loginInfo);

    if (!loginInfo.isLoggedIn) {
        return < Navigate to = "/" replace />;
    }
    
    return children;
};

export default RequireUser;