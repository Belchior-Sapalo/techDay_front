import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { ApiServices } from "../../components/utils/apiServices";
import { notifyError, notifySuccess } from "../../components/utils/notifier";
import Timer from '../../components/timer/timer'
import { AppContext } from "../../components/context/appContext";
import Cookies from "js-cookie";

export default function ManageProblems() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [wasClicked, setWasClicked] = useState(false);
  const { setRemainingTime } =
    useContext(AppContext);

  useEffect(() => {
    fetchProblems();
    handleGetCurrentProblem()
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await ApiServices.handleGetProblemList();
      if (res.ok) {
        setProblems(res.problemList);
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(`Erro ao buscar problemas: ${error.message}`);
    } finally {
      setisLoading(false);
    }
  };

  const handleUpdateVisibility = async (problemId) => {
    try {
      setisLoading(true)
      const res = await ApiServices.handleUpdateProblemVisibility(problemId);
      if (res.ok) {
       await fetchProblems()
       await handleGetCurrentProblem()
      }else{
        throw new Error(res.msg)
      }
    } catch (error) {
      alert(`Erro ao mostrar problema: ${error.message}`);
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

  async function handleFinishChalange(){
    if (wasClicked){
      try {
        setisLoading(true)
        const res = await ApiServices.handleFinishChalange()
        if (res.ok) {
         await fetchProblems()
         notifySuccess("Desafio terminado")
         setRemainingTime(null)
        }else{
          throw new Error(res.msg)
        }
      } catch (error) {
        alert(`Erro ao terminar desafio: ${error.message}`);
      } finally {
        setisLoading(false)
      }
    }else{
      setWasClicked(true)
      setTimeout(() => setWasClicked(false), 2000)
    }
  }

  async function handleGetCurrentProblem(){
    const res = await ApiServices.handleGetNextProblem();
      if (res.ok) {
        setRemainingTime(res.problem.durationTime * 60);
      } else {
        Cookies.remove("currentProblem");
      }
  }

  return (  
    <div>
      <div className="mt-2"><Timer areInAdminRoute={true}/></div>
      <h2 className="mb-4 mt-4">Lista de Problemas</h2>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Duração</th>
            <th>Ordem</th>
            <th>Pontos</th>
            <th>Visível</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem.id}>
              <td style={{ whiteSpace: "nowrap" }}>{index + 1}</td>
              <td style={{ whiteSpace: "nowrap" }}>{problem.title}</td>
              <td style={{ whiteSpace: "nowrap" }}>{problem.description}</td>
              <td style={{ whiteSpace: "nowrap" }}>{problem.durationTime} min</td>
              <td style={{ whiteSpace: "nowrap" }}>{problem.sequence}</td>
              <td style={{ whiteSpace: "nowrap" }}>{problem.points}</td>
              <td style={{ whiteSpace: "nowrap" }}>{problem.visible ? "Sim" : "Não"}</td>
              <td>
                {!problem.visible && (
                  <Button
                    variant="success"
                    onClick={() => handleUpdateVisibility(problem.id)}
                    disabled={isLoading}
                  >
                    Mostrar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => handleFinishChalange()} variant={wasClicked ? "danger": "primary"} className="mt-4">{wasClicked ? "Terminar desafio?" : "Terminar"}</Button>
    </div>
  );
}
