import React, { useEffect, useState } from "react";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { ApiServices } from "../../components/utils/apiServices";
import { notifyError } from "../../components/utils/notifier";
import Cookies from "js-cookie";

export default function ManageProblems() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await ApiServices.handleGetProblemList();
      if (res.ok) {
        setProblems(res.problemList);
      } else {
        throw new Error(res.msg);
      }
    } catch (error) {
      notifyError("Erro ao buscar problemas:", error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleUpdateVisibility = async (problemId) => {
    try {
      setisLoading(true)
      const res = await ApiServices.handleUpdateProblemVisibility(problemId); // Ajuste a URL
      if (res.ok) {
       await fetchProblems()
      }else{
        throw new Error(res.msg)
      }
    } catch (error) {
      notifyError("Erro ao atualizar visibilidade:", error.message);
    } finally {
      setisLoading(false)
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
        <p>Carregando problemas...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="my-4">Lista de Problemas</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ordem</th>
            <th>Visível</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem.id}>
              <td>{index + 1}</td>
              <td>{problem.title}</td>
              <td>{problem.description}</td>
              <td>{problem.sequence}</td>
              <td>{problem.visible ? "Sim" : "Não"}</td>
              <td>
                {!problem.visible && (
                  <Button
                    variant="success"
                    onClick={() => handleUpdateVisibility(problem.id)}
                    disabled={isLoading}
                  >
                    Tornar Visível
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
