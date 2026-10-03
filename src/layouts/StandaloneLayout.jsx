import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const StandaloneLayout = () => {
  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-3">
        <Link to="/">
          <Button
            variant="link"
            className="text-decoration-none text-secondary fw-bold p-0 mb-3 hover-scale"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back
          </Button>
        </Link>
        <Outlet />
      </Container>
    </div>
  );
};

export default StandaloneLayout;
