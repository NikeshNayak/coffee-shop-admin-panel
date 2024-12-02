import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NonAuthLayout = (props) => {
  const location = useLocation();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  useEffect(() => {
    let currentpage = capitalizeFirstLetter
    
    
    
    
    
    
    
    
    
    
    
    (location.pathname);
    currentpage = currentpage.replaceAll("-", " ");

    document.title = `${currentpage}`;
  }, [location]);

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default NonAuthLayout;
