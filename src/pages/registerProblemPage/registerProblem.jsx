import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { notifyError, notifySuccess } from "../../components/utils/notifier";
import { ApiServices } from "../../components/utils/apiServices";

export default function RegisterProblem(){
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    sequence: "",
    points: "",
    durationTime: "",
    testCases: [],
  });
  const [isLoading, setIsLoading] = useState(false)

  const [testCase, setTestCase] = useState({
    inputs: "",
    expectedOutput: "",
  });

  const handleAddTestCase = () => {
    if (!testCase.inputs || !testCase.expectedOutput){
        alert("Precisa inserir as entradas e saídas")
        returnç
    }
    setProblem((prevProblem) => ({
      ...prevProblem,
      testCases: [...prevProblem.testCases, testCase],
    }));
    setTestCase({ inputs: "", expectedOutput: "" });
  };

  function handleCleanStates(){
    setProblem({
      title: "",
      description: "",
      sequence: "",
      points: "",
      durationTime: "",
      testCases: [],
    })
  }

  const handleRegisterProblem = async (e) => {
    e.preventDefault();
    if (problem.testCases.length === 0){
      notifyError("Precisa inserir casos de testes!")
      return;
    }
    try {
      setIsLoading(true)
        const res = await ApiServices.handleRegisterProblem(problem)
        if (res.ok){
          handleCleanStates()
          notifySuccess("Problema cadastrado")
        }else{
          throw new Error(res.msg)
        }
    } catch (error) {
        alert(`Erro ao registrar problema: ${error.message}`)
    }finally{
        setIsLoading(false)
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Registrar Problema</Card.Title>
              <Form onSubmit={handleRegisterProblem}>
                <Form.Group controlId="problemTitle" className="mb-3">
                  <Form.Label>Título do Problema</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o título"
                    value={problem.title}
                    onChange={(e) =>
                      setProblem({ ...problem, title: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group controlId="problemDescription" className="mb-3">
                  <Form.Label>Descrição do Problema</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descreva o problema"
                    value={problem.description}
                    onChange={(e) =>
                      setProblem({ ...problem, description: e.target.value })
                    }
                    style={{resize: "none"}}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="problemSequence" className="mb-3">
                  <Form.Label>Sequência</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Número do problema"
                    value={problem.sequence}
                    onChange={(e) =>
                      setProblem({ ...problem, sequence: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group controlId="problemDuration" className="mb-3">
                  <Form.Label>Duração</Form.Label>
                  <Form.Control
                    type="number"
                    min={10}
                    placeholder="Duração"
                    value={problem.durationTime}
                    onChange={(e) =>
                      setProblem({ ...problem, durationTime: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group controlId="problemSequence" className="mb-3">
                  <Form.Label>Pontos</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Pontos"
                    min={1}
                    value={problem.points}
                    onChange={(e) =>
                      setProblem({ ...problem, points: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <hr />
                <h5>Casos de Teste</h5>
                <Form.Group controlId="testCaseInputs" className="mb-3">
                  <Form.Label>Entradas</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite as entradas separando por vírgulas"
                    value={testCase.inputs}
                    onChange={(e) =>
                      setTestCase({ ...testCase, inputs: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="testCaseExpectedOutput" className="mb-3">
                  <Form.Label>Saída Esperada</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite a saída esperada"
                    value={testCase.expectedOutput}
                    onChange={(e) =>
                      setTestCase({ ...testCase, expectedOutput: e.target.value })
                    }
                  />
                </Form.Group>

                <Button
                disabled={isLoading} 
                  variant="secondary"
                  onClick={handleAddTestCase}
                  className="mb-3"
                >
                  Adicionar Caso de Teste
                </Button>

                <ul>
                  {problem.testCases.map((tc, index) => (
                    <li key={index}>
                      <strong>Entradas:</strong> {tc.inputs},{" "}
                      <strong>Saída Esperada:</strong> {tc.expectedOutput}
                    </li>
                  ))}
                </ul>

                <Button disabled={isLoading} variant="primary" type="submit">
                  {isLoading ? "Aguarde..." : "Registrar Problema"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

