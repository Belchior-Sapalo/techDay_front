import React, { useContext, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import "../codeEditor/codeEditor.css";
import { notifyError } from "../utils/notifier";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/modal/modal";
import {
  Spinner,
  Button,
  Form,
  Card,
  ButtonGroup,
  ButtonToolbar,
} from "react-bootstrap";
import Cookies from "js-cookie";
import LoadingComponent from "../loadingComponent/loadingComponent";
import { FaMaximize, FaMinimize } from "react-icons/fa6";
import { AppContext } from "../context/appContext";
import { ApiServices } from "../utils/apiServices";

const CodeEditor = () => {
  const [language, setLanguage] = useState(javascript);
  const [response, setResponse] = useState({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const navigator = useNavigate();
  const [show, setShow] = useState(false);
  const [isAnTestResponse, setIsAnTestResponse] = useState(false);
  const [simpleCode, setSimpleCode] = useState("");
  const [requestBody, setRequestBody] = useState({
    codeBody: "",
    language: "",
    token: Cookies.get("token"),
    inputs: "",
  });
  const { handleGetCompetitorName } = useContext(AppContext);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // Estado para o minimizador
  const [wasClicked, setWasClicked] = useState(false);
  const baseUrl = "http://localhost:8080/problems";
  const [timer, setTimer] = useState(null); // Estado do cronômetro
  const [remainingTime, setRemainingTime] = useState(5);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (remainingTime === 0) {
      notifyError("O tempo acabou!");
    }
  }, [remainingTime]);

  useEffect(() => {
    handleGetFirstProblem();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  function Problems() {
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
            <div id="timer-container">
              {remainingTime != null && (
                <h5>Tempo restante: {formatTime(remainingTime)}</h5>
              )}
            </div>
            <button
              variant="secondary"
              onClick={() => setIsMinimized(!isMinimized)}
              className="minimize-btn"
            >
              {isMinimized ? (
                <FaMaximize size={14} />
              ) : (
                <FaMinimize size={14} />
              )}
            </button>

          </Card.Header>
          {!isMinimized && (
            <>
              <Card.Body>
                {isLoading ? (
                  <LoadingComponent operation="Carregando problema..." />
                ) : currentProblem != null ? (
                  <div>
                    <h6>{currentProblem.title}</h6>
                    <p className="problem-description">
                      {currentProblem.description}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h6>Sem mais problemas, parabéns por chegar até aqui!</h6>
                  </div>
                )}
              </Card.Body>
            </>
          )}
        </Card>
      </div>
    );
  }

  async function handleGetFirstProblem() {
    setIsLoading(true);
    const url = `${baseUrl}/first`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await res.json();
      setCurrentProblem(data);
      Cookies.set("currentProblem", data.sequence);
      Cookies.set("currentProblemId", data.id);
      setRemainingTime(data.durationTime)
    } catch (error) {
      console.error("Erro ao buscar o primeiro problema", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGetCurrentProblem() {
    setIsLoading(true);
    const sequence = parseInt(Cookies.get("currentProblem"), 10);
    if (isNaN(sequence)) {
      setIsLoading(false);
      return;
    }

    const url = `${baseUrl}/current/${sequence}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentProblem(data);
        Cookies.set("currentProblem", data.sequence);
        Cookies.set("currentProblemId", data.id);
        Cookies.set("finished", true);
      } else {
        alert("Problema não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o problema atual", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGetNextProblem() {
    setIsLoading(true);
    const sequence = parseInt(Cookies.get("currentProblem"), 10);
    if (isNaN(sequence)) {
      setIsLoading(false);
      return;
    }

    const url = `${baseUrl}/next/${sequence}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (res.status === 404) {
        setCurrentProblem(null);
        Cookies.remove("currentProblem");
        setIsLoading(false);
      } else if (res.ok) {
        const data = await res.json();
        setCurrentProblem(data);
        Cookies.set("currentProblem", data.sequence);
        Cookies.set("currentProblemId", data.id);
        setIsLoading(false);
      } else {
        console.error("Erro ao buscar o próximo problema");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao buscar o próximo problema", error);
      setIsLoading(false);
    }
  }


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleGetCompetitorName();
  }, []);

  const handleLanguageChange = (e) => {
    setRequestBody({ ...requestBody, language: e.target.value });
    requestBody.language = e.target.value;
    switch (requestBody.language) {
      case "javascript":
        {
          setLanguage(javascript());
          setSimpleCode("");
          setRequestBody({ ...requestBody, codeBody: "" });
        }
        break;
      case "python":
        {
          setLanguage(python());
          setSimpleCode("");
          setRequestBody({ ...requestBody, codeBody: "" });
        }
        break;
      case "java":
        {
          setLanguage(java());
          setSimpleCode(
            "public class Main{\n public static void main(String args[]){\n}\n}"
          );
          setRequestBody({
            ...requestBody,
            codeBody:
              "public class Main{\npublic static void main(String args[]){\n}\n}",
          });
        }
        break;
      case "c++":
        {
          setLanguage(cpp());
          setSimpleCode("#include <iostream>\nint main(){\n}");
          setRequestBody({
            ...requestBody,
            codeBody: "#include <iostream>\nint main(){\n}",
          });
        }
        break;
      case "c":
        {
          setLanguage(cpp());
          setSimpleCode("#include <stdio.h>\nint main(){\n}");
          setRequestBody({
            ...requestBody,
            codeBody: "#include <stdio.h>\nint main(){\n}",
          });
        }
        break;
      default: {
        setLanguage(javascript());
        setSimpleCode("");
        setRequestBody({ ...requestBody, codeBody: "" });
      }
    }
  };

  const handleCodeChange = (value) => {
    setRequestBody({ ...requestBody, codeBody: value });
  };

  async function handleSubmitCode() {
    if (requestBody.codeBody.length === 0) {
      notifyError("Insira o código!");
      return;
    }
    if (requestBody.language.length == 0) {
      notifyError("Seleccione uma linguagem!");
      return;
    }

    if (wasClicked) {
      try {
        setIsLoadingSubmit(true);
        const res = await ApiServices.handleSubmitCode(requestBody);

        if (res.ok) {
          setResponse(res.resObj);
          setIsAnTestResponse(false);
          handleShow();
          //handleGetCompetitorName();
        } else {
          throw new Error(res.msg);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoadingSubmit(false);
      }
    } else {
      setWasClicked(true);
      setTimeout(() => {
        setWasClicked(false);
      }, 2000);
    }
  }

  async function handleTestCode() {
    if (requestBody.codeBody.length === 0) {
      notifyError("Insira o código!");
      return;
    }
    if (requestBody.language.length == 0) {
      notifyError("Seleccione uma linguagem!");
      return;
    }
    try {
      setIsLoadingTest(true);
      const res = await ApiServices.handleTestCode(requestBody);

      if (res.ok) {
        setResponse(res.resObj);
        Cookies.set("lastMsg", res.resObj.result);
        setIsAnTestResponse(true);
        handleShow();
      } else {
        throw new Error(res.msg);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoadingTest(false);
    }
  }

  function handleShowLast() {
    setIsAnTestResponse(true);
    setResponse({ result: Cookies.get("lastMsg") });
    handleShow();
  }

  //setTimeout(() => Cookies.set("lastMsg", ""), 1000)

  return (
    <div id="code-editor-container" className="pt-4 container">
      <Problems />
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Entradas de teste</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite as entradas separadas por vírgula"
            onChange={(e) =>
              setRequestBody({ ...requestBody, inputs: e.target.value })
            }
            required
          />
        </Form.Group>
      </Form>
      <div id="code-editor-header">
        <Form.Select id="select" onChange={handleLanguageChange}>
          <option value="">Selecione a linguagem</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="c">C</option>
        </Form.Select>

        <div id="submit-container">
          <ButtonToolbar aria-label="Toolbar with button group">
            <ButtonGroup className="me-2" aria-label="first group">
              <Button
                id="first-btn"
                onClick={() => handleTestCode()}
                disabled={
                  isLoadingTest ||
                  isLoadingSubmit ||
                  Cookies.get("currentProblem") === null ||
                  requestBody.codeBody.length === 0
                }
              >
                {isLoadingTest ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Testando...
                  </>
                ) : (
                  "Testar"
                )}
              </Button>
              <>
                {wasClicked ? (
                  <Button
                    onClick={() => handleSubmitCode()}
                    disabled={
                      isLoadingTest ||
                      isLoadingSubmit ||
                      Cookies.get("currentProblem") == null ||
                      requestBody.codeBody.length === 0
                    }
                    variant="danger"
                  >
                    {isLoadingSubmit ? (
                      <>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Enviando...
                      </>
                    ) : (
                      "Certeza?"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmitCode()}
                    disabled={requestBody.codeBody.length === 0}
                  >
                    Enviar
                  </Button>
                )}
              </>
            </ButtonGroup>
            <ButtonGroup className="me-2" aria-label="scond group">
              <Button
                onClick={() => handleShowLast()}
                disabled={!Cookies.get("lastMsg")}
              >
                Resultado do teste
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
      </div>
      <label>Insira seu código</label>
      <CodeMirror
        id="code-input"
        value={simpleCode.length === 0 ? "" : simpleCode}
        height="500px"
        extensions={[language]}
        onChange={handleCodeChange}
      />

      <ModalComponent
        response={response}
        show={show}
        handleClose={handleClose}
        isAnTestResponse={isAnTestResponse}
      />
    </div>
  );
};

export default CodeEditor;
