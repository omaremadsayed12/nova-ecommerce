import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function RouteChangeHandler({ closeMenus }) {
  const location = useLocation();

  useEffect(() => {
    closeMenus();
  }, [location, closeMenus]);

  return null;
}

export default RouteChangeHandler;