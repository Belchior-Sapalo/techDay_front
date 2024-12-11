import React from 'react'
import { Spinner } from "react-bootstrap";
import '../loadingComponent/loadingComponent.css'

export default function LoadingComponent({operation}) {
    return (
        <div id="load-container">
          <Spinner
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <p>{operation}</p>
        </div>
      );
}
