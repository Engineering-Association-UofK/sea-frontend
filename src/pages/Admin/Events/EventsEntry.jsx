import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Badge,
} from "react-bootstrap";
import {
  useAdminEvent,
  useCreateEvent,
  useUpdateEvent,
  useGetParticipants,
  useUpdateParticipants,
} from "../../../features/events/hooks/useEvent";
import { useAdminTasks } from "../../../context/AdminTaskContext";
import ImagePickerModal from "../../../components/ImagePickerModal";

import EventDetailsForm from "./components/EventDetailsForm";
import ParticipantsTable from "./components/ParticipantsTable";
import CollaboratorsDrawer from "./components/CollaboratorsDrawer";
import FormSelectorModal from "./components/FormSelectorModal";
import { processFetchStream } from "../../../features/events/api/event.service";
import styles from "./Events.module.css";

const formatToInputTime = (iso) =>
  iso
    ? new Date(
        new Date(iso).getTime() - new Date(iso).getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16)
    : "";
const formatToGoTime = (local) => (local ? new Date(local).toISOString() : "");

const EventsEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== "0";
  const { startTask } = useAdminTasks();

  const [page, setPage] = useState(1);
  const limit = 25;

  const {
    data: fetchedEvent,
    isLoading: isEventFetching,
    isError: eventFetchError,
  } = useAdminEvent(isEditMode ? id : null);
  const { data: participantPayload, isLoading: isParticipantsLoading } =
    useGetParticipants(isEditMode ? id : null, page, limit);

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const updateParticipantsMutation = useUpdateParticipants(id);
  const isEventSaving =
    createEventMutation.isPending || updateEventMutation.isPending;

  const [activeTab, setActiveTab] = useState("details");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCollabDrawer, setShowCollabDrawer] = useState(false);
  const [showFormSelector, setShowFormSelector] = useState(false);

  const [outcomes, setOutcomes] = useState([""]);
  const [components, setComponents] = useState([]);
  const [participantRows, setParticipantRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    event_type: "WORKSHOP",
    form_application: true,
    form_id: 0,
    max_participants: 0,
    participants_count: 0,
    presenter_id: "",
    start_date: "",
    end_date: "",
    wallpaper_id: 0,
    wallpaper_url: "",
  });

  useEffect(() => {
    if (isEditMode && fetchedEvent) {
      setFormData({
        name: fetchedEvent.name ?? "",
        description: fetchedEvent.description ?? "",
        event_type: fetchedEvent.event_type ?? "WORKSHOP",
        form_application: fetchedEvent.form_application ?? true,
        form_id: fetchedEvent.form_id ?? 0,
        max_participants: fetchedEvent.max_participants ?? 0,
        participants_count: fetchedEvent.participants_count ?? 0,
        presenter_id: fetchedEvent.presenter?.[0]?.id ?? "",
        coordinator_id: fetchedEvent.coordinator?.[0]?.id ?? "",
        start_date: formatToInputTime(fetchedEvent.schedule?.start),
        end_date: formatToInputTime(fetchedEvent.schedule?.end),
        wallpaper_id: fetchedEvent.wallpaper_id ?? 0,
        wallpaper_url: fetchedEvent.wallpaper ?? "",
      });
      if (fetchedEvent.outcomes?.length) setOutcomes(fetchedEvent.outcomes);
      if (fetchedEvent.grading_scheme)
        setComponents(fetchedEvent.grading_scheme.map((c) => ({ ...c })));
    }
  }, [isEditMode, fetchedEvent]);

  useEffect(() => {
    const payload = participantPayload?.data || participantPayload;
    const pool = payload?.participants || [];
    const total = payload?.total || 0;

    setTotalPages(Math.ceil(total / limit) || 1);

    if (pool) {
      setParticipantRows(
        pool.map((p) => ({
          id: p.registration_id || p.id,
          user_id: p.user_id,
          name_en: p.name_en,
          name_ar: p.name_ar,
          status: p.status,
          completed: p.completed,
          grades: p.grades
            ? p.grades.map((g) => ({
                component_id: g.component_id,
                score: g.score,
              }))
            : [],
        })),
      );
    }
  }, [participantPayload]);

  const handleEventSubmit = () => {
    setFeedback({ type: "", message: "" });
    const payload = {
      id: isEditMode ? Number(id) : 0,
      ...formData,
      form_id: Number(formData.form_id),
      max_participants: Number(formData.max_participants),
      presenter_id: Number(formData.presenter_id),
      coordinator_id: Number(formData.coordinator_id),
      wallpaper_id: Number(formData.wallpaper_id),
      start_date: formatToGoTime(formData.start_date),
      end_date: formatToGoTime(formData.end_date),
      outcomes: outcomes.filter((o) => o.trim() !== ""),
      components: components.map((c) => ({
        id: c.id || 0,
        name: c.name,
        max_score: c.max_score,
        description: c.description,
      })),
    };

    if (isEditMode) {
      updateEventMutation.mutate(payload, {
        onSuccess: () =>
          setFeedback({ type: "success", message: "Event synchronized." }),
        onError: (err) =>
          setFeedback({
            type: "danger",
            message: err.response?.data?.message || "Update failed.",
          }),
      });
    } else {
      createEventMutation.mutate(payload, {
        onSuccess: (res) =>
          navigate(`/admin/events/${res.id || res.data?.id || 0}`),
        onError: (err) =>
          setFeedback({
            type: "danger",
            message: err.response?.data?.message || "Creation failed.",
          }),
      });
    }
  };

  const handleSaveParticipants = () => {
    setFeedback({ type: "", message: "" });
    const payload = participantRows.map((row) => ({
      id: row.id,
      status: row.status,
      completed: row.completed,
      grades: components.map((comp) => ({
        component_id: comp.id,
        score: row.grades.find((g) => g.component_id === comp.id)?.score || 0,
      })),
    }));

    updateParticipantsMutation.mutate(payload, {
      onSuccess: () =>
        setFeedback({ type: "success", message: "Grades saved." }),
      onError: () =>
        setFeedback({ type: "danger", message: "Matrix update failed." }),
    });
  };

  const handleGenerateCertificates = () => {
    const payload = {
      certificate_type: "participation",
      certificate_version: "v0.1",
      event_id: Number(id),
    };
    startTask(
      `/v1/admin/event/generate-certs`,
      `certs-${id}`,
      `Generate Certs: ${formData.name}`,
      processFetchStream,
      payload,
    );
    setFeedback({
      type: "info",
      message: "Certificate generation launched in background tasks.",
    });
  };

  const handleSendFinishEmails = () => {
    const payload = { event_id: Number(id) };
    startTask(
      `/v1/admin/event/send-finish-emails`,
      `emails-${id}`,
      `Send Emails: ${formData.name}`,
      processFetchStream,
      payload,
    );
    setFeedback({
      type: "info",
      message: "Email dispatch launched in background tasks.",
    });
  };

  if (isEditMode && eventFetchError)
    return (
      <Alert variant="danger" className="m-4">
        Workspace connection failed.
      </Alert>
    );

  return (
    <Container fluid className="d-flex flex-column p-0">
      {/* <div className="sticky-top bg-white border-bottom p-3 mb-3 z-3 d-flex flex-wrap gap-2 justify-content-between align-items-center shadow-sm" style={{ top: 0 }}> */}
      <div
        className="mb-4 z-3 d-flex flex-wrap gap-2 justify-content-between align-items-center"
        style={{ top: 0 }}
      >
        <div className="d-flex align-items-center">
          {/* <Button variant="light" size="sm" className="me-3 rounded-circle shadow-sm" onClick={() => navigate('/admin/events')}>
                        <i className="bi bi-arrow-left"></i>
                    </Button> */}
          <Button
            className="me-2"
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/admin/events")}
            // disabled={isPending}
          >
            <i className="bi bi-arrow-left"></i>
          </Button>
          <h4
            className="mb-0 fw-bold text-truncate"
            style={{ maxWidth: "300px" }}
          >
            {isEditMode ? formData.name : "New Event Architecture"}
          </h4>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => setShowCollabDrawer(true)}
          >
            <i className="bi bi-person-video3 me-1"></i> Presenters
          </Button>

          {isEditMode && (
            <>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleGenerateCertificates}
              >
                <i className="bi bi-award me-1"></i> Issue Certs
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleSendFinishEmails}
              >
                <i className="bi bi-envelope-check me-1"></i> Send Emails
              </Button>
            </>
          )}

          {activeTab === "details" ? (
            <Button
              variant="primary"
              size="sm"
              className="fw-bold shadow-sm px-3"
              onClick={handleEventSubmit}
              disabled={isEventSaving}
            >
              {isEventSaving ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <i className="bi bi-hdd-fill me-1"></i> Save Config
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              className="fw-bold shadow-sm px-3"
              onClick={handleSaveParticipants}
              disabled={updateParticipantsMutation.isPending}
            >
              {updateParticipantsMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <i className="bi bi-database-check me-1"></i> Save Matrices
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* <div className="scrollable-container"> */}
      {/* <div className="px-3 px-md-4"> */}
      <div className="">
        {feedback.message && (
          <Alert
            variant={feedback.type}
            dismissible
            onClose={() => setFeedback({ type: "", message: "" })}
            className="shadow-sm border-0"
          >
            {feedback.message}
          </Alert>
        )}

        {isEditMode && (
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3 custom-picker-tabs"
          >
            <Tab eventKey="details" title="Structural Configuration" />
            <Tab
              eventKey="participants"
              title={
                <>
                  Participant Pool{" "}
                  <Badge bg="secondary" className="ms-1">
                    {participantPayload?.total || participantRows.length}
                  </Badge>
                </>
              }
            />
          </Tabs>
        )}

        {isEventFetching ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div
            className={`scrollable-container + ${styles.scrollableContainer}`}
          >
            <div className="workspace-content pb-5">
              {(!isEditMode || activeTab === "details") && (
                <EventDetailsForm
                  formData={formData}
                  setFormData={setFormData}
                  outcomes={outcomes}
                  setOutcomes={setOutcomes}
                  components={components}
                  setComponents={setComponents}
                  onShowPicker={() => setShowImagePicker(true)}
                  onShowFormSelector={() => setShowFormSelector(true)}
                  isEditMode={isEditMode}
                />
              )}
              {isEditMode && activeTab === "participants" && (
                <ParticipantsTable
                  rows={participantRows}
                  setRows={setParticipantRows}
                  components={components}
                  isLoading={isParticipantsLoading}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
        )}
      </div>
      {/* </div> */}

      <ImagePickerModal
        show={showImagePicker}
        onHide={() => setShowImagePicker(false)}
        onSelect={(id, url) =>
          setFormData((prev) => ({
            ...prev,
            wallpaper_id: id,
            wallpaper_url: url,
          }))
        }
      />
      <CollaboratorsDrawer
        show={showCollabDrawer}
        onHide={() => setShowCollabDrawer(false)}
      />
      <FormSelectorModal
        show={showFormSelector}
        onHide={() => setShowFormSelector(false)}
        eventId={id}
        onSelect={(formId) =>
          setFormData((prev) => ({ ...prev, form_id: formId }))
        }
      />
    </Container>
  );
};

export default EventsEntry;
