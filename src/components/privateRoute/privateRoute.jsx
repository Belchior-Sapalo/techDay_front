import React from 'react';
import { Navigate } from 'react-router-dom';
import { ApiServices } from "../utils/apiServices";
export default function PrivateRoute({children}) {
  return ApiServices.isAuthenticated() ? children : <Navigate to='/'/>
}
