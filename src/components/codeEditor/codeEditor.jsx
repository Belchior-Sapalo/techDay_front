import React, { useContext, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import "../codeEditor/codeEditor.css";
import { notifyError } from "../utils/notifier";
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
import { Client } from "@stomp/stompjs";

const CodeEditor = () => {
  const [language, setLanguage] = useState(javascript);
  const [response, setResponse] = useState({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [show, setShow] = useState(false);
  const [isAnTestResponse, setIsAnTestResponse] = useState(false);
  const [simpleCode, setSimpleCode] = useState("");
  const [requestBody, setRequestBody] = useState({
    codeBody: "",
    language: "",
    token: Cookies.get("token"),
    inputs: "",
  });
  const { handleGetCompetitorName, setRemainingTime, durationTimeOut } =
    useContext(AppContext);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // Estado para o minimizador
  const [wasClicked, setWasClicked] = useState(false);

  useEffect(() => {
    handleGetCompetitorName();
    handleGetNextProblem();
  }, []);

  // useEffect(() => {
  //   const client = new Client({
  //     brokerURL: "ws://localhost:8080/ws", // URL do WebSocket do backend
  //     reconnectDelay: 5000, // Tenta reconectar automaticamente
  //     debug: (str) => console.log("WebSocket Debug: ", str),
  //   });

  //   client.onConnect = () => {
  //     console.log("Conectado ao WebSocket!");

  //     // Subscrição para verificar atualizações de problemas
  //     client.subscribe("/topic/problems", async (message) => {
  //       const data = message.body;

  //       try {
  //         let res;
  //         if (!Cookies.get("started")) {
  //           res = await ApiServices.handleCheckIfFirstProblemIsVisible();
  //         } else {
  //           res = await ApiServices.handleCheckIfNextProblemIsReady();
  //         }

  //         if (res.ok) {
  //           handleGetNextProblem();
  //         }
  //       } catch (error) {
  //         console.error("Erro ao processar mensagem do WebSocket:", error);
  //       }
  //     });
  //   };

  //   client.onStompError = (frame) => {
  //     console.error("Erro no STOMP:", frame.headers["message"], frame.body);
  //   };

  //   client.activate();

  //   return () => {
  //     client.deactivate();
  //   };
  // }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        let res;
        if (!Cookies.get("started")) {
          res = await ApiServices.handleCheckIfFirstProblemIsVisible();
        } else {
          res = await ApiServices.handleCheckIfNextProblemIsReady();
        }
  
        if (res.ok) {
          handleGetNextProblem();
        }
      } catch (error) {
        console.error("Erro ao verificar problema:", error);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  //setTimeout(() => Cookies.remove("started"), 1000)

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
                    {
                      Cookies.get("started") ? (
                        <h6>Parabéns por completar o desafio!</h6>
                      ): (
                        <h6>Se prepare, logo começamos!</h6>
                      )
                    }
                  </div>
                )}
              </Card.Body>
            </>
          )}
        </Card>
      </div>
    );
  }

  async function handleGetNextProblem() {
    try {
      setIsLoading(true);
      const res = await ApiServices.handleGetNextProblem();
      if (res.ok) {
        setCurrentProblem(res.problem);
        Cookies.set("currentProblem", res.problem.sequence);
        Cookies.set("currentProblemId", res.problem.id);
        setRemainingTime(res.problem.durationTime * 60);
        setIsLoading(false);
        Cookies.set("started", true)
      } else {
        setCurrentProblem(null);
        Cookies.remove("currentProblem");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          handleGetCompetitorName();
          Cookies.set("sent", true);
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
        <Form.Select
          disabled={durationTimeOut}
          id="select"
          onChange={handleLanguageChange}
        >
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
                  requestBody.codeBody.length === 0 ||
                  durationTimeOut
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
                      requestBody.codeBody.length === 0 ||
                      durationTimeOut
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
                    disabled={
                      requestBody.codeBody.length === 0 || durationTimeOut
                    }
                  >
                    Enviar
                  </Button>
                )}
              </>
            </ButtonGroup>
            <ButtonGroup className="me-2" aria-label="scond group">
              <Button
                onClick={() => handleShowLast()}
                disabled={!Cookies.get("lastMsg") || durationTimeOut}
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
