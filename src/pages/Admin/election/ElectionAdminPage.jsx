import React, { useState } from "react";
import {
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
  // Query Hooks
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useElectionPrivateStatistics();

  const {
    data: candidates,
    isLoading: isLoadingCandidates,
    isError: isErrorCandidates,
    refetch: refetchCandidates,
  } = useCandidates();

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
    refetchStats();
    refetchCandidates();
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
        err?.response?.data?.message || "Failed to add candidate.",
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
        err?.response?.data?.message || "Failed to update candidate.",
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
        err?.response?.data?.message || "Failed to delete candidate.",
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
        err?.response?.data?.message || "Failed to resolve election cycle.",
      );
    }
  };

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
