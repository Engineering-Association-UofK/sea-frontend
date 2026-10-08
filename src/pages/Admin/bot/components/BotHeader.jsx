import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const BotHeader = ({ isPending, isResetting, onReset, onSave }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
      <div className="title-wrapper d-flex align-items-center">
        <Button
          className="me-3"
          variant="outline-secondary"
          size="sm"
          onClick={() => navigate(`/admin/bot`)}
        >
          <i className="bi bi-arrow-left"></i>
        </Button>
        <h4 className="mb-0">Bot Graph Editor</h4>
      </div>
      <div className="actions-wrapper d-flex gap-2">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={onReset}
          disabled={isResetting || isPending}
        >
          {isResetting ? (
            <Spinner size="sm" />
          ) : (
            <i className="bi bi-arrow-counterclockwise me-1"></i>
          )}
          Reset Bot
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={onSave}
          disabled={isPending || isResetting}
        >
          {isPending ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />{" "}
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-floppy2-fill me-1"></i> Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BotHeader;
