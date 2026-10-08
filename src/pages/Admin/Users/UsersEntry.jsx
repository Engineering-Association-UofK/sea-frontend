import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import { useUser, useUpdateUser } from "../../../features/users/hooks/useUsers";
import { roles } from "../../../utils/roles";
import styles from "./Users.module.css";
import { DEPARTMENTS } from "../../../utils/departments";
import { displayRole } from "../../../utils/roles";

const EMPTY_FORM = {
  uni_id: "",
  name_ar: "",
  name_en: "",
  phone: "",
  department: "",
  gender: "",
};

const UsersEntry = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const userFromState = location.state?.user;

  const { data: fetchedUser, isLoading, isError } = useUser(id);
  const updateMutation = useUpdateUser();
  const isPending = updateMutation.isPending;

  const user = fetchedUser ?? userFromState;

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (user) {
      setFormData({
        uni_id: user.uni_id ?? "",
        name_ar: user.name_ar ?? "",
        name_en: user.name_en ?? "",
        phone: user.phone ?? "",
        department: user.department ?? "",
        gender: user.gender ?? "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data: ", {id: Number(id), roles: selectedRoles});

    updateMutation.mutate(
      {
        data: {
          id: Number(id),
          uni_id: formData.uni_id,
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          phone: formData.phone,
          department: formData.department,
          gender: formData.gender,
        },
      },
      {
        onSuccess: () => navigate("/admin/users"),
        onError: (err) => console.error("Update failed", err),
      },
    );
  };

  // ── Guard: no state and fetch also failed ──────────────────────────────────
  if (!userFromState && isError) {
    return (
      <Alert variant="danger">
        Failed to load user.{" "}
        <Alert.Link onClick={() => navigate("/admin/users")}>
          Go back to the list.
        </Alert.Link>
      </Alert>
    );
  }

  // ── Loading: no state snapshot yet and fetch still in flight ──────────────
  if (!userFromState && isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <>
      <Form className="entry-form" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="title-wrapper d-flex">
            <Button
              className="me-2"
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(`/admin/users`)}
              disabled={isPending}
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
            <h4>Edit user</h4>
            {isLoading && (
              <Spinner
                animation="border"
                size="sm"
                variant="secondary"
                className="ms-2"
              />
            )}
          </div>
          <div className="actions-wrapper">
            <Button
              variant="outline-primary"
              size="sm"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <i className="bi pe-none bi-floppy2-fill"></i>
              )}
            </Button>
          </div>
        </div>

        {updateMutation.isError && (
          <Alert variant="danger">
            {/* Failed to update user: {updateMutation.error?.message} */}
            {updateMutation.error?.response?.data?.message ||
              updateMutation.error?.message ||
              "Failed to update user."}
          </Alert>
        )}

        <div className="scrollable-container">
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Student Index (ID)</Form.Label>
                <Form.Control value={user?.id ?? "—"} disabled />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control value={user?.username || "—"} disabled />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control value={user?.email || "—"} disabled />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <div className="mt-1 d-flex gap-2">
                  <Badge bg={user?.status === "active" ? "success" : "danger"}>
                    {user?.status ?? "—"}
                  </Badge>
                  {user?.verified && (
                    <Badge bg="info">
                      <i className="bi bi-patch-check-fill me-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              {user?.roles?.length > 0 && (
                <Form.Group>
                  <Form.Label>Roles</Form.Label>
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {user.roles.map((role) => (
                      <Badge key={role} bg="secondary">
                        {displayRole(role)}
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              )}
            </Col>
          </Row>

          <hr />

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formNameAr">
                <Form.Label>Full Name (Arabic)</Form.Label>
                <Form.Control
                  name="name_ar"
                  type="text"
                  placeholder="الاسم بالعربية"
                  value={formData.name_ar}
                  onChange={handleChange}
                  disabled={isPending}
                  dir="rtl"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formNameEn">
                <Form.Label>Full Name (English)</Form.Label>
                <Form.Control
                  name="name_en"
                  type="text"
                  placeholder="Full name in English"
                  value={formData.name_en}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formUniId">
                <Form.Label>University ID</Form.Label>
                <Form.Control
                  name="uni_id"
                  type="number"
                  placeholder="University ID"
                  value={formData.uni_id}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  type="tel"
                  placeholder="e.g. 0912345678"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isPending}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isPending}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};

export default UsersEntry;
