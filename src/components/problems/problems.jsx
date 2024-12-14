import React, { useContext, useEffect, useState } from "react";
import "../codeEditor/codeEditor.css";
import { Card } from "react-bootstrap";
import Cookies from "js-cookie";
import LoadingComponent from "../loadingComponent/loadingComponent";
import { FaMaximize, FaMinimize } from "react-icons/fa6";
import { ApiServices } from "../utils/apiServices";
import { AppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

export default function Problems() {
  const { setRemainingTime, remainingTime, setDurationTimeOut } =
    useContext(AppContext);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [checkInterval, setCheckInterval] = useState(1000);
  const [isChecking, setIsChecking] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    if (started) {
      timeoutId = setTimeout(() => {
        setCheckInterval(1000);
        setIsChecking(true);
      }, remainingTime * 1000);

      setIsChecking(false);
    } else {
      setCheckInterval(1000);
      setIsChecking(true);
    }

    return () => clearTimeout(timeoutId);
  }, [started, remainingTime]);

  useEffect(() => {
    if (!isChecking) return;
    if (finished) return;

    const intervalId = setInterval(async () => {
      try {
        let res;
        if (!started) {
          res = await ApiServices.handleCheckIfFirstProblemIsVisible();
        } else {
            res = await ApiServices.handleCheckIfNextProblemIsReady();
          
            const response = await ApiServices.handleCheckIfChalangeIsFinished();
          
            if (response.finished) {
              navigate("/resultados");
            }
          }

        if (res.ok) {
          handleGetNextProblem();

          if (started) {
            setIsChecking(false);
          }
        }
      } catch (error) {
        alert("Erro ao verificar problema:", error);
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [checkInterval, isChecking, started, finished]);
  //setTimeout(() => Cookies.remove("started"), 1000)
  async function handleGetNextProblem() {
    try {
      setIsLoading(true);
      const res = await ApiServices.handleGetNextProblem();
      if (res.ok) {
        setCurrentProblem(res.problem);
        Cookies.set("currentProblem", res.problem.sequence);
        Cookies.set("currentProblemId", res.problem.id);
        setRemainingTime((res.problem.durationTime / 2) * 60);
        Cookies.remove("sent");
        setStarted(true);
        setDurationTimeOut(false);
        Cookies.set("started", true);
      } else {
        setCurrentProblem(null);
        Cookies.remove("currentProblem");
        Cookies.set("currentProblemId", res.problem.id);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="problem-container">
      <Card id="problem-card">
        <Card.Header className="card-header">
          {isLoading ? (
            <></>
          ) : currentProblem != null ? (
            <h4 className="problem-sequence">
              Problema: {currentProblem.sequence}
            </h4>
          ) : (
            <></>
          )}

          <button
            variant="secondary"
            onClick={() => setIsMinimized(!isMinimized)}
            className="minimize-btn"
          >
            {isMinimized ? <FaMaximize size={14} /> : <FaMinimize size={14} />}
          </button>
        </Card.Header>
        {!isMinimized && (
          <>
            <Card.Body>
              {isLoading ? (
                <LoadingComponent operation="Carregando problema..." />
              ) : currentProblem !== null ? (
                <div>
                  <h6>{currentProblem.title}</h6>
                  <p className="problem-description">
                    {currentProblem.description}
                  </p>
                </div>
              ) : (
                <div>
                  {Cookies.get("started") ? (
                    <h6>Parabéns por completar o desafio!</h6>
                  ) : (
                    <h6>Se prepare, logo começamos!</h6>
                  )}
                </div>
              )}
            </Card.Body>
          </>
        )}
      </Card>
    </div>
  );
}
