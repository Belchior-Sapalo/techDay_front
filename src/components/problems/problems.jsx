import React, { useContext, useEffect, useState } from "react";
import "../codeEditor/codeEditor.css";
import { Card } from "react-bootstrap";
import Cookies from "js-cookie";
import LoadingComponent from "../loadingComponent/loadingComponent";
import { FaMaximize, FaMinimize } from "react-icons/fa6";
import { ApiServices } from "../utils/apiServices";
import { AppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../utils/notifier";
import "./problems.css";

export default function Problems() {
  const { setRemainingTime, remainingTime, setIsTimeExpired } =
    useContext(AppContext);

  const [started, setStarted] = useState(Cookies.get("started") === "true");
  const [finished, setFinished] = useState(Cookies.get("finished") === "true");
  const [checkInterval, setCheckInterval] = useState(1000);
  const [isChecking, setIsChecking] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("started") === "true") {
      handleGetCurrentProblem();
    }
  }, []);

  async function handleGetCurrentProblem() {
    const res = await ApiServices.handleGetCurrentProblem();
    if (res.ok) {
      setCurrentProblem(res.problem);
      await fetchTimeLeftFromApi(res.problem.id);
    }
  }

  useEffect(() => {
    //Cookies.set("finished", "false")
    if (remainingTime > 0) {
      const timeoutId = setTimeout(() => {
        setIsChecking(true);
        setCheckInterval(1000);
      }, remainingTime * 1000);
      setIsChecking(false);
      return () => clearTimeout(timeoutId);
    } else {
      setCheckInterval(1000);
      setIsChecking(true);
    }
  }, [remainingTime, isChecking]);

  useEffect(() => {
    if (!isChecking || finished) return;

    const intervalId = setInterval(async () => {
      try {
        if (!started) {
          const verifyFirstRes =
            await ApiServices.handleCheckIfFirstProblemIsVisible();
          if (verifyFirstRes.ok) {
            await handleGetNextProblem();
            setIsChecking(false);
          }
        } else {
          const verifyNextRes =
            await ApiServices.handleCheckIfNextProblemIsReady();
          if (verifyNextRes.ok) {
            await handleGetNextProblem();
            setIsChecking(false);
          }
          const challengeStatus =
            await ApiServices.handleCheckIfChalangeIsFinished();
          if (challengeStatus.finished === true) {
            finalizeChallenge();
            return;
          }
        }
      } catch (error) {
        notifyError(error.message || "Erro ao verificar o status do desafio.");
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [isChecking, checkInterval, started, finished]);

  async function handleGetNextProblem() {
    try {
      setIsLoading(true);

      const res = await ApiServices.handleGetNextProblem();
      if (res.ok) {
        setCurrentProblem(res.problem);
        Cookies.set("currentProblemObj", res.problem);
        Cookies.set("currentProblem", res.problem.sequence);
        Cookies.set("currentProblemId", res.problem.id);

        await fetchTimeLeftFromApi(res.problem.id);

        Cookies.remove("sent");
        setStarted(true);
        setIsTimeExpired(false);
        Cookies.set("started", "true");
        Cookies.set("finished", "false");
      } else {
        setCurrentProblem(null);
        Cookies.remove("currentProblem");
      }
    } catch (error) {
      notifyError("Erro ao buscar o próximo problema.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTimeLeftFromApi(problemId) {
    try {
      const res = await ApiServices.handleGetTimeLeft(problemId);
      if (res.ok) {
        setRemainingTime(res.timeLeftInSeconds);
      } else {
        throw new Error(res.msg);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        handleTimeExpired();
      } else {
        notifyError("Erro ao obter o tempo restante.");
      }
    }
  }

  function handleTimeExpired() {
    setIsTimeExpired(true);
    notifyError("O tempo acabou!");
    setRemainingTime(0);
    Cookies.remove("sent");
  }

  function handleResetAllCookies() {
    Cookies.set("finished", "true");
    Cookies.remove("currentProblem");
    Cookies.remove("currentProblemId");
    Cookies.set("started", "false");
  }

  function finalizeChallenge() {
    handleResetAllCookies();
    navigate("/resultados");
    setIsChecking(false);
  }

  return (
    <div className="problem-container">
      <Card id="problem-card">
        <Card.Header className="card-header">
          {isLoading ? null : currentProblem ? (
            <h4 className="problem-sequence">
              Problema: {currentProblem.sequence}
            </h4>
          ) : null}
          <button
            variant="secondary"
            onClick={() => setIsMinimized(!isMinimized)}
            className="minimize-btn"
          >
            {isMinimized ? <FaMaximize size={14} /> : <FaMinimize size={14} />}
          </button>
        </Card.Header>
        {!isMinimized && (
          <Card.Body>
            {isLoading ? (
              <LoadingComponent operation="Carregando problema..." />
            ) : currentProblem ? (
              <div>
                <h6>{currentProblem.title}</h6>
                <p className="problem-description">
                  {currentProblem.description}
                </p>
              </div>
            ) : (
              <div>
                {finished ? (
                  <h6>Parabéns por completar o desafio!</h6>
                ) : (
                  <h6>Se prepare, logo começamos!</h6>
                )}
              </div>
            )}
          </Card.Body>
        )}
      </Card>
    </div>
  );
}
