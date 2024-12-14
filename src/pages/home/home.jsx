import React, { useState } from "react";
import "./home.css";
import {
  Form,
  Button,
  Container,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ApiServices } from "../../components/utils/apiServices";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [creadentials, setCreadentials] = useState({
    bi: "",
    name: "",
    password: "",
    isAdmin: false
  });
  const [apiMessage, setApiMessage] = useState("");
  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      creadentials.password = creadentials.bi;
      const res = await ApiServices.handleLogin(creadentials)

      if (res.ok){
        Cookies.set("token", res.token);
        Cookies.set("role", res.role)
        navigate("codingPage");
      }else{
        throw new Error(res.msg)
      }
    } catch (error) {
      setIsError(true);
      setApiMessage(error.message);
    }finally{
      setIsLoading(false)
      setTimeout(() => setApiMessage(""), 2000);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      creadentials.password = creadentials.bi;
      const res = await ApiServices.handleRegister(creadentials)
      if (res.ok){
        handleClose();
        setIsError(false);
        handleLogin(e)
      }else{
        throw new Error(res.msg)
      }
    } catch (error) {
      setIsError(true);
      setApiMessage(error.message);
    }finally{
      setIsLoading(false)
      setTimeout(() => setApiMessage(""), 2000);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="border p-4 rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleLogin}>
          {apiMessage && (
            <Alert
              className="text-center"
              variant={isError ? "danger" : "success"}
            >
              {apiMessage}
            </Alert>
          )}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Digite seu BI"
              value={creadentials.bi}
              onChange={(e) =>
                setCreadentials({ ...creadentials, bi: e.target.value })
              }
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Aguarde...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          <p className="mt-2 mb-0" id="register-btn" onClick={handleShow}>
            Não tem uma conta? <span style={{color: "green"}}>Registre-se</span>
          </p>
          <p style={{cursor: "pointer"}} className="mt-2 mb-0" onClick={() => navigate("/admin")}>
            Administrador
          </p>
        </Form>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registre-se como competidor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            {apiMessage && (
              <Alert className="text-center" variant="danger">
                {apiMessage}
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>BI</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu BI"
                value={creadentials.bi}
                onChange={(e) =>
                  setCreadentials({ ...creadentials, bi: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome"
                value={creadentials.name}
                onChange={(e) =>
                  setCreadentials({ ...creadentials, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Aguarde...
                </>
              ) : (
                "Registrar"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
