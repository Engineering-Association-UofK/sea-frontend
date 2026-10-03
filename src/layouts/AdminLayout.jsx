import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Offcanvas,
  Badge,
  Button,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar.jsx";
import { AdminTaskProvider, useAdminTasks } from "../context/AdminTaskContext";

// Internal Top Header Component
const AdminHeader = ({ onToggleSidebar, onToggleTasks }) => {
  const { tasks } = useAdminTasks();
  const activeTasksCount = tasks.filter((t) => t.status === "running").length;

  return (
    <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm z-2">
      <div className="d-flex align-items-center">
        {/* Mobile Hamburger */}
        <Button
          variant="link"
          className="text-dark p-0 me-3 d-lg-none"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list fs-3"></i>
        </Button>
        <h5 className="mb-0 fw-bold text-primary d-none d-sm-block">
          System Admin Desk
        </h5>
      </div>

      <Button
        variant="light"
        className="position-relative rounded-circle p-2"
        onClick={onToggleTasks}
      >
        <i className="bi bi-bell-fill fs-5 text-secondary"></i>
        {activeTasksCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            {activeTasksCount}
          </Badge>
        )}
      </Button>
    </header>
  );
};

// Internal Task Tray Offcanvas Component
const TaskTray = ({ show, onHide }) => {
  const { tasks, dismissTask } = useAdminTasks();

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className="shadow"
      style={{ width: "400px" }}
    >
      <Offcanvas.Header closeButton className="border-bottom bg-light">
        <Offcanvas.Title className="fw-bold fs-6">
          <i className="bi bi-list-task me-2 text-primary"></i> Background
          Processes
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0 bg-light">
        {tasks.length === 0 ? (
          <div className="p-5 text-center text-muted small">
            No background tasks running.
          </div>
        ) : (
          tasks.map((task) => {
            const pct =
              task.progress.total > 0
                ? Math.round(
                    (task.progress.current / task.progress.total) * 100,
                  )
                : 0;

            return (
              <div key={task.id} className="border-bottom bg-white p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-bold small text-dark text-truncate pe-2">
                    {task.title}
                  </div>
                  {task.status === "running" ? (
                    <Badge
                      bg="warning"
                      text="dark"
                      className="d-flex align-items-center"
                    >
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-1"
                        style={{ borderWidth: "0.15em" }}
                      />{" "}
                      Running
                    </Badge>
                  ) : task.status === "error" ? (
                    <Badge bg="danger">Failed</Badge>
                  ) : (
                    <Badge bg="success">Completed</Badge>
                  )}
                </div>

                {/* 1. Progress Bar Area */}
                {task.progress.total > 0 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>
                        {task.progress.current} / {task.progress.total}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <ProgressBar
                      animated={task.status === "running"}
                      variant={
                        task.status === "error"
                          ? "danger"
                          : task.status === "completed"
                            ? "success"
                            : "primary"
                      }
                      now={pct}
                      style={{ height: "8px" }}
                    />
                    {task.progress.name && (
                      <div className="small text-muted mt-1 text-truncate">
                        Current target:{" "}
                        <span className="fw-medium text-dark">
                          {task.progress.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Error Message Area */}
                {task.errorMsg && (
                  <div className="alert alert-danger py-1 px-2 small mb-2 border-0 rounded-1">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>{" "}
                    {task.errorMsg}
                  </div>
                )}

                {/* 3. Live Terminal Output Block */}
                <div
                  className="bg-dark p-2 rounded small"
                  style={{
                    height: "120px",
                    overflowY: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                  }}
                >
                  {task.logs.length === 0 ? (
                    <span className="text-muted">Waiting for server...</span>
                  ) : (
                    task.logs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes("✗") || log.includes("[Error]")
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        &gt; {log}
                      </div>
                    ))
                  )}
                </div>

                {task.status !== "running" && (
                  <div className="text-end mt-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => dismissTask(task.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

// Main Layout Wrapper
const AdminLayout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showTaskTray, setShowTaskTray] = useState(false);

  return (
    <AdminTaskProvider>
      <div className="d-flex vh-100 overflow-hidden bg-light">
        {/* 1. Desktop Static Sidebar */}
        <div
          className="d-none d-lg-flex flex-column bg-white border-end shadow-sm"
          style={{ width: "250px", zIndex: 10 }}
        >
          <AdminSidebar />
        </div>

        {/* 2. Main Application Body Area */}
        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
          <AdminHeader
            onToggleSidebar={() => setShowMobileSidebar(true)}
            onToggleTasks={() => setShowTaskTray(true)}
          />

          {/* The internal scrollable content pane */}
          <main className="flex-grow-1 overflow-auto p-3 p-md-4">
            <Outlet />
          </main>
        </div>

        {/* 3. Mobile Navigation Offcanvas */}
        <Offcanvas
          show={showMobileSidebar}
          onHide={() => setShowMobileSidebar(false)}
          placement="start"
          style={{ width: "250px" }}
        >
          <Offcanvas.Header closeButton className="border-bottom">
            <Offcanvas.Title className="fw-bold text-primary">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0 d-flex flex-column">
            <AdminSidebar onNavigate={() => setShowMobileSidebar(false)} />
          </Offcanvas.Body>
        </Offcanvas>

        {/* 4. Global Task Execution Tray */}
        <TaskTray show={showTaskTray} onHide={() => setShowTaskTray(false)} />
      </div>
    </AdminTaskProvider>
  );
};

export default AdminLayout;
