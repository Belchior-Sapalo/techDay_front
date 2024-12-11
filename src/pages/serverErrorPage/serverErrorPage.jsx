import React from "react";
import { useNavigate } from "react-router-dom";
import "./serverErrorPage.css";
import Cookies from "js-cookie";

const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (Cookies.get("token")) {
      navigate("/codingPage")
    } else {
      navigate("/");
    }
  };

  return (
    <div className="server-error-page">
      <h1>500</h1>
      <p>Oops! Algo deu errado no servidor.</p>
      <p>Reporte o problema para resolução imediata!</p>
      <button onClick={handleGoHome}>Voltar para a página inicial</button>
    </div>
  );
};

export default ServerErrorPage;
