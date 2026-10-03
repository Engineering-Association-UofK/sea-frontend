import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { usersService } from "../../../features/users/api/users.service";

const PasscodeLookup = () => {
  const [userId, setUserId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [passcode, setPasscode] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [statusInfo, setStatusInfo] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const resetState = () => {
    setPasscode(null);
    setUserNotFound(false);
    setStatusInfo("");
    setError("");
    setCopied(false);
  };

  const extractAndSetPasscode = (res) => {
    if (!res) {
      setPasscode("No Data Returned");
      return;
    }
    const code = res.passcode;
    setPasscode(typeof code === "object" ? JSON.stringify(code) : String(code));
  };

  // --- Fetch Passcode directly ---
  const handleFetchPasscode = async (idToFetch) => {
    resetState();
    setLoading(true);
    setSearchId(idToFetch);

    try {
      const res = await usersService.getTempPasscode(idToFetch);
      extractAndSetPasscode(res);
    } catch (err) {
      if (err?.response?.status === 404) {
        setUserNotFound(true);
      } else {
        setError(
          err?.response?.data?.message || "Failed to fetch user passcode.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    handleFetchPasscode(userId.trim());
  };

  // --- Create Temp User with 5-Second Native Timeout ---
  const handleCreateTempUser = async () => {
    setLoading(true);
    setError("");
    setStatusInfo("");
    setUserNotFound(false);

    try {
      // Use Axios native timeout config
      const res = await usersService.createTempUser(searchId, {
        timeout: 5000,
      });
      extractAndSetPasscode(res);
      setLoading(false);
    } catch (err) {
      // Check if the error is due to timeout
      if (
        err?.code === "ECONNABORTED" ||
        err?.message?.toLowerCase().includes("timeout")
      ) {
        setStatusInfo("Passcode is generated. Fetching passcode details...");

        try {
          const fetchRes = await usersService.getTempPasscode(searchId);
          extractAndSetPasscode(fetchRes);
          setStatusInfo("");
        } catch (fetchErr) {
          setError(
            fetchErr?.response?.data?.message ||
              "Failed to retrieve generated passcode.",
          );
        } finally {
          setLoading(false);
        }
      } else {
        setError(err?.response?.data?.message || "Failed to create temp user.");
        setLoading(false);
      }
    }
  };

  const handleCopy = () => {
    if (passcode) {
      navigator.clipboard.writeText(passcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-75 py-5">
      <Card
        style={{ maxWidth: "480px", width: "100%" }}
        className="shadow-sm border-0 rounded-4"
      >
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-2">
              <i className="bi bi-key-fill fs-3"></i>
            </div>
            <h4 className="fw-bold mb-1">Passcode Finder</h4>
            <p className="text-muted small">
              Retrieve or generate temporary user registration passcodes
            </p>
          </div>

          <Form onSubmit={handleSearchSubmit} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">User ID</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter Student / User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loading}
                  required
                />
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading && !statusInfo ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <i className="bi bi-search me-1"></i> Search
                    </>
                  )}
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>

          {/* Feedback & Notifications */}
          {statusInfo && (
            <Alert variant="info" className="py-2 text-center small">
              <Spinner animation="grow" size="sm" className="me-2" />
              {statusInfo}
            </Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Fixed Layout for Create User Prompt */}
          {userNotFound && (
            <div className="p-3 bg-light border-start border-warning border-4 rounded mb-3">
              <h6 className="fw-bold text-dark mb-1">User Not Found</h6>
              <p className="small text-muted mb-3">
                No record exists for User ID <strong>{searchId}</strong>. Would
                you like to create a placeholder entry?
              </p>
              <div className="d-flex gap-2">
                <Button
                  variant="warning"
                  size="sm"
                  className="w-100 fw-medium"
                  onClick={handleCreateTempUser}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Yes, Create Entry & Generate"
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={resetState}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Display Result Passcode */}
          {passcode && (
            <div className="bg-success-subtle rounded text-center p-3">
              <span
                className="text-uppercase small fw-bold text-success mb-1 d-block"
                style={{ letterSpacing: "1px" }}
              >
                Registration Passcode
              </span>
              <div className="d-flex justify-content-center align-items-center gap-2 my-2">
                <code
                  className="fs-3 text-dark fw-bold px-3 py-1 bg-white rounded border"
                  style={{ wordBreak: "break-all" }}
                >
                  {passcode}
                </code>
              </div>
              <Button
                variant={copied ? "success" : "outline-success"}
                size="sm"
                className="mt-2"
                onClick={handleCopy}
              >
                <i
                  className={`bi ${copied ? "bi-check-lg" : "bi-clipboard"} me-1`}
                ></i>
                {copied ? "Copied!" : "Copy Passcode"}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PasscodeLookup;
