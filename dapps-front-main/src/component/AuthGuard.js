import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from 'src/context/User';

export default function AuthGuard(props) {
  const { children } = props;
  const auth = useContext(UserContext);
  if (!auth.userLoggedIn) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
