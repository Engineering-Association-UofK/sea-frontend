import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { electionService } from "../api/election.service";

export const ELECTION_KEYS = {
  all: ["election"],
  live: () => [...ELECTION_KEYS.all, "live"],
  publicStatistics: () => [...ELECTION_KEYS.all, "public-statistics"],
  privateStatistics: () => [...ELECTION_KEYS.all, "private-statistics"],
  candidates: () => [...ELECTION_KEYS.all, "candidates"],
  ticket: () => [...ELECTION_KEYS.all, "ticket"],
  results: (cycle) => [...ELECTION_KEYS.all, "results", cycle],
};

// ==========================================
// Queries (Data Fetching)
// ==========================================

// Check if election is live
export const useIfLive = (options = {}) => {
  return useQuery({
    queryKey: ELECTION_KEYS.live(),
    queryFn: () => electionService.getIfLive(),
    ...options,
  });
};

// Real-time public metrics
export const useElectionPublicStatistics = (options = {}) => {
  return useQuery({
    queryKey: ELECTION_KEYS.publicStatistics(),
    queryFn: () => electionService.getPublicStatistics(),
    ...options,
  });
};

// Candidate list for setup and voting views
export const useCandidates = (options = {}) => {
  return useQuery({
    queryKey: ELECTION_KEYS.candidates(),
    queryFn: () => electionService.getCandidates(),
    ...options,
  });
};

// Unique voting ticket for authenticated users
export const useElectionTicket = (options = {}) => {
  return useQuery({
    queryKey: ELECTION_KEYS.ticket(),
    queryFn: () => electionService.getTicket(),
    ...options,
  });
};

// Election results filtered by cycle
export const useElectionResults = (cycle, options = {}) => {
  return useQuery({
    queryKey: ELECTION_KEYS.results(cycle),
    queryFn: () => electionService.getResults(cycle),
    enabled: Boolean(cycle && cycle > 0),
    ...options,
  });
};

// Admin: Statistics
export const useElectionPrivateStatistics = (options = {}) => {
  return useQuery({
    queryKey: ELECTION_KEYS.privateStatistics(),
    queryFn: () => electionService.getPrivateStatistics(),
    ...options,
  });
};

// ==========================================
// Mutations
// ==========================================

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (candidateData) => electionService.createCandidate(candidateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.candidates() });
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, belonging }) =>
      electionService.updateCandidate({ id, belonging }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.candidates() });
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => electionService.deleteCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.candidates() });
    },
  });
};

export const useSubmitVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voteData) => electionService.submitVote(voteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.ticket() });
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.publicStatistics() });
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.privateStatistics() });
    },
  });
};

export const useResolveElection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => electionService.resolveAndReset(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.all });
    },
  });
};
