import Cookies from "js-cookie";
import React from 'react';

import { Navigate } from 'react-router-dom';
export default function PrivateRoute({children}) {
  const authToken = Cookies.get("token")

  return authToken ? children : <Navigate to='/'/>
}
