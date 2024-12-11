import { useEffect } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DashBoard(){
  const navigate = useNavigate()
  useEffect(() => {
    navigate("manageProblems")
  }, [])
  return (
    <div className="p-4">
      <ButtonGroup>
        <NavLink
          className={({isActive}) => isActive ? "btn btn-primary" : "btn btn-secondary"}
          to="manageProblems"
        >
          Problemas
        </NavLink>
        <NavLink
          className={({isActive}) => isActive ? "btn btn-primary" : "btn btn-secondary"}
          to="registerProblem"
        >
          Registrar
        </NavLink>
      </ButtonGroup>
      <Outlet/>
    </div>
  );
};

