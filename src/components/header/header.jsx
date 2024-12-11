import React, { useContext } from "react";
import "../header/header.css";
import { AppContext } from "../context/appContext";

export default function Header() {
  const {user} = useContext(AppContext)

  return (
    <header id="header-container">
      <div id="logo-container">
        <h5>
          <span>&lt;&gt;</span>TechDay<span>&lt;/&gt;</span>
        </h5>
      </div>
      <h5>{user.name}: {user.score}</h5>
    </header>
  );
}
