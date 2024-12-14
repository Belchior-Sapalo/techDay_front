import React, { useState, useEffect } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import { ApiServices } from "../../components/utils/apiServices";
import { FaMedal } from "react-icons/fa";

const ChallengeResults = () => {
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiServices.handleGetChallengeResults(); 
        if (res.ok) {
          setResults(res.competitorList);
        } else {
          throw new Error("Erro ao buscar resultados");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Resultados do Desafio</h1>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && results.length === 0 && (
        <Alert variant="info">Nenhum resultado disponível no momento.</Alert>
      )}

      {!loading && !error && results.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Posições</th>
              <th>Competidor</th>
              <th>BI</th>
              <th>Pontos</th>
            </tr>
          </thead>
          <tbody>
            {results.map((competitor, index) => (
              <tr key={competitor.id}>
                <td>
                  {competitor.score === 0 && (!index === 0 || !index === 1 || !index === 2) ? (
                    index + 1
                  ) : index === 0 ? (
                    <FaMedal color="gold" title="1º Lugar" />
                  ) : index === 1 ? (
                    <FaMedal color="silver" title="2º Lugar" />
                  ) : index === 2 ? (
                    <FaMedal color="#cd7f32" title="3º Lugar" />
                  ) : (
                    index + 1 + "º"
                  )}
                </td>
                <td>{competitor.name}</td>
                <td>{competitor.bi}</td>
                <td>{competitor.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ChallengeResults;
