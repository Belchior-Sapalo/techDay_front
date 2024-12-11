import React from 'react';

import { Navigate } from 'react-router-dom';
import { ApiServices } from "../utils/apiServices";
export default function AdminRoute({children}) {
  return ApiServices.isAdmin() ? children : <Navigate to='/'/>
}
