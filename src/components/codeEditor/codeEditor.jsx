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
  ButtonGroup,
  ButtonToolbar,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { AppContext } from "../context/appContext";
import { ApiServices } from "../utils/apiServices";
import Problems from "../problems/problems";

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
  const {
    handleGetCompetitorInfo,
    setRemainingTime,
    isTimeExpired,
  } = useContext(AppContext);
  const [wasClicked, setWasClicked] = useState(false);

  useEffect(() => {
    handleGetCompetitorInfo();
  }, []);

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
    if (isTimeExpired === true) {
      notifyError("Seu tempo acabou!");
      return;
    }
    if (requestBody.codeBody.length === 0) {
      notifyError("Insira o código!");
      return;
    }
    if (requestBody.language.length === 0) {
      notifyError("Seleccione uma linguagem!");
      return;
    }
    // if (Cookies.get("sent") === "true") {
    //   notifyError("Já enviou sua solução!");
    //   return;
    // }
    if (wasClicked) {
      try {
        setIsLoadingSubmit(true);
        const res = await ApiServices.handleSubmitCode(requestBody);

        if (res.ok) {
          setResponse(res.resObj);
          setIsAnTestResponse(false);
          handleShow();
          handleGetCompetitorInfo();
          //Cookies.set("sent", "true");
        } else {
          throw new Error(res.msg);
        }
      } catch (error) {
        alert(`Erro ao enviar resolução: ${error.message}`);
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
        console.log("result:" + res.resObj.result)
        setIsAnTestResponse(true);
        handleShow();
      } else {
        throw new Error(res.msg);
      }
    } catch (error) {
      alert(`Erro ao testar código: ${error.message}`);
    } finally {
      setIsLoadingTest(false);
    }
  }

  function handleShowLast() {
    setIsAnTestResponse(true);
    setResponse({ result: Cookies.get("lastMsg") });
    handleShow();
  }

  function disableButton() {
    return (
      isLoadingTest ||
      isLoadingSubmit 
    );
  }

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
                disabled={disableButton()}
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
                    disabled={disableButton()}
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
                    disabled={disableButton()}
                  >
                    Enviar
                  </Button>
                )}
              </>
            </ButtonGroup>
            <ButtonGroup className="me-2" aria-label="scond group">
              <Button
                onClick={() => handleShowLast()}
                disabled={!Cookies.get("lastMsg") || disableButton()}
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
