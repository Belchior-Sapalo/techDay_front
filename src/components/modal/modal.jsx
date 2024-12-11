import { useState } from "react";
import { MdCheck, MdError } from "react-icons/md";
import {Modal} from "react-bootstrap"
import './modal.css'

function ModalComponent({ response, show, handleClose, isAnTestResponse }) {
  return (
    <>
      {isAnTestResponse ? (
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Resultados do teste</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>{response.result}</h6>
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Resultado final</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Problema: {response.exerciseNumber}</h6>
            <h6>Resultado: {response.isCorrect ? "Acertou" : "Errou"}</h6>
            <h6>
              Pontos pelo problema: {response.isCorrect ? response.score : 0}
            </h6>
            <h6>
              Bónus: {response.bonus}
            </h6>
            <h6>Pontos total: {response.totalScore}</h6>
          </Modal.Body>
          <Modal.Footer>
            <div id="res-icon-container">
              {response.isCorrect ? (
                <MdCheck color="green" size={25}/>
              ) : (
                <MdError color="#d9534f" size={25}/>
              )}
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default ModalComponent;
