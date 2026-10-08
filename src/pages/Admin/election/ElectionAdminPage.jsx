import React, { useState } from "react";
import { Spinner, Alert, Card, Button } from "react-bootstrap";
import {
  useIfLive,
  useElectionPrivateStatistics,
  useCandidates,
  useCreateCandidate,
  useUpdateCandidate,
  useDeleteCandidate,
  useResolveElection,
} from "../../../features/election/hooks/useElection";

import { ElectionHeader } from "./ElectionHeader";
import { ElectionStats } from "./ElectionStats";
import { CandidateTable } from "./CandidateTable";
import {
  CreateCandidateModal,
  EditCandidateModal,
  DeleteCandidateModal,
  ResolveElectionModal,
} from "./modals/CandidateModals";

const ElectionAdminPage = () => {
  const {
    data: liveStatus,
    isLoading: isLoadingLive,
    isError: isErrorLive,
    refetch: refetchLive,
  } = useIfLive();

  const isLive = Boolean(liveStatus?.live);

  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useElectionPrivateStatistics({ enabled: isLive });

  const {
    data: candidates,
    isLoading: isLoadingCandidates,
    isError: isErrorCandidates,
    refetch: refetchCandidates,
  } = useCandidates({ enabled: isLive });

  // Mutation Hooks
  const createCandidateMutation = useCreateCandidate();
  const updateCandidateMutation = useUpdateCandidate();
  const deleteCandidateMutation = useDeleteCandidate();
  const resolveElectionMutation = useResolveElection();

  // Modal Visibility States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Selection & Action Error States
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Handlers
  const handleSyncData = () => {
    refetchLive();
    if (isLive) {
      refetchStats();
      refetchCandidates();
    }
  };

  const handleCreateSubmit = async (formData) => {
    setActionError(null);
    if (!formData.user_id) {
      setActionError("User ID is required.");
      return;
    }
    try {
      await createCandidateMutation.mutateAsync({
        user_id: Number(formData.user_id),
        belonging: formData.belonging,
      });
      setShowAddModal(false);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to add candidate."
      );
    }
  };

  const handleUpdateSubmit = async (editBelonging) => {
    setActionError(null);
    try {
      await updateCandidateMutation.mutateAsync({
        id: selectedCandidate.id,
        belonging: editBelonging,
      });
      setShowEditModal(false);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update candidate."
      );
    }
  };

  const handleDeleteSubmit = async () => {
    setActionError(null);
    try {
      await deleteCandidateMutation.mutateAsync(selectedCandidate.id);
      setShowDeleteModal(false);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to delete candidate."
      );
    }
  };

  const handleResolveSubmit = async () => {
    setActionError(null);
    try {
      await resolveElectionMutation.mutateAsync();
      setShowResolveModal(false);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to resolve election cycle."
      );
    }
  };

  // ------------------------------------------------------------------------
  // Guard 1: Loading Live Check
  // ------------------------------------------------------------------------
  if (isLoadingLive) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted fw-semibold">Checking election status...</p>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // Guard 2: Error Fetching Live Status
  // ------------------------------------------------------------------------
  if (isErrorLive) {
    return (
      <div className="py-5 text-center">
        <Alert variant="danger" className="d-inline-block border-0 shadow-sm text-start mb-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Failed to verify election live status. Please check your network connection.
        </Alert>
        <div>
          <Button variant="outline-primary" size="sm" onClick={() => refetchLive()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // Guard 3: Election is NOT Live Screen
  // ------------------------------------------------------------------------
  if (!isLive) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Card className="text-center p-4 border-0 shadow-sm w-100 bg-white" style={{ maxWidth: "480px" }}>
          <Card.Body>
            <div
              className="rounded-circle bg-warning-subtle text-warning d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="bi bi-pause-circle-fill fs-1"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Election is Not Live</h4>
            <p className="text-muted small mb-3">
              There is currently no active election running. System telemetry and candidate management are offline until an election cycle is started.
            </p>
            {liveStatus?.cycle !== undefined && (
              <div className="p-2 bg-light rounded font-monospace fs-7 text-muted mb-4">
                Current Cycle ID: #{liveStatus.cycle}
              </div>
            )}
            <Button
              variant="outline-secondary"
              size="sm"
              className="d-inline-flex align-items-center gap-2 fw-semibold px-3"
              onClick={() => refetchLive()}
            >
              <i className="bi bi-arrow-clockwise"></i> Re-check Status
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // Main Dashboard
  // ------------------------------------------------------------------------
  return (
    <div className="election-admin-page pb-4">
      <ElectionHeader
        onSync={handleSyncData}
        onOpenResolve={() => {
          setActionError(null);
          setShowResolveModal(true);
        }}
        isFetchingStats={isFetchingStats}
      />

      <ElectionStats
        stats={stats}
        isLoading={isLoadingStats}
        isError={isErrorStats}
      />

      <CandidateTable
        candidates={candidates}
        isLoading={isLoadingCandidates}
        isError={isErrorCandidates}
        onOpenAdd={() => {
          setActionError(null);
          setShowAddModal(true);
        }}
        onOpenEdit={(candidate) => {
          setSelectedCandidate(candidate);
          setActionError(null);
          setShowEditModal(true);
        }}
        onOpenDelete={(candidate) => {
          setSelectedCandidate(candidate);
          setActionError(null);
          setShowDeleteModal(true);
        }}
      />

      {/* Modals */}
      <CreateCandidateModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleCreateSubmit}
        isPending={createCandidateMutation.isPending}
        error={actionError}
      />

      <EditCandidateModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleUpdateSubmit}
        candidate={selectedCandidate}
        isPending={updateCandidateMutation.isPending}
        error={actionError}
      />

      <DeleteCandidateModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSubmit}
        candidate={selectedCandidate}
        isPending={deleteCandidateMutation.isPending}
        error={actionError}
      />

      <ResolveElectionModal
        show={showResolveModal}
        onHide={() => setShowResolveModal(false)}
        onConfirm={handleResolveSubmit}
        isPending={resolveElectionMutation.isPending}
        error={actionError}
      />

      <style>{`
        .fs-7 { font-size: 0.78rem; }
        .tracking-wide { letter-spacing: 0.05em; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (min-width: 576px) {
          .border-start-sm { border-left: 1px solid #dee2e6 !important; }
        }
      `}</style>
    </div>
  );
};

export default ElectionAdminPage;
