import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { electionService } from '../api/election.service';

export const ELECTION_KEYS = {
  all: ['election'],
  live: () => [...ELECTION_KEYS.all, 'live'],
  publicStatistics: () => [...ELECTION_KEYS.all, 'public-statistics'],
  privateStatistics: () => [...ELECTION_KEYS.all, 'private-statistics'],
  candidates: () => [...ELECTION_KEYS.all, 'candidates'],
  ticket: () => [...ELECTION_KEYS.all, 'ticket'],
  results: (cycle) => [...ELECTION_KEYS.all, 'results', cycle],
};

// ==========================================
// Queries (Data Fetching)
// ==========================================

// Check if election is live
export const useIfLive = () => {
  return useQuery({
    queryKey: ELECTION_KEYS.live(),
    queryFn: () => electionService.getIfLive(),
  });
};

// Real-time public metrics
export const useElectionPublicStatistics = () => {
  return useQuery({
    queryKey: ELECTION_KEYS.publicStatistics(),
    queryFn: () => electionService.getPublicStatistics(),
  });
};

// Candidate list for setup and voting views
export const useCandidates = () => {
  return useQuery({
    queryKey: ELECTION_KEYS.candidates(),
    queryFn: () => electionService.getCandidates(),
  });
};

// Unique voting ticket for authenticated users
export const useElectionTicket = () => {
  return useQuery({
    queryKey: ELECTION_KEYS.ticket(),
    queryFn: () => electionService.getTicket(),
  });
};

// Election results filtered by cycle
export const useElectionResults = (cycle) => {
  return useQuery({
    queryKey: ELECTION_KEYS.results(cycle),
    queryFn: () => electionService.getResults(cycle),
    enabled: Boolean(cycle && cycle > 0),
  });
};

// ==========================================
// Mutations (Admin Actions & Voting)
// ==========================================

// Admin: Create Candidate
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateData) => electionService.createCandidate(candidateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.candidates() });
    },
  });
};

// Admin: Update Candidate
export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, belonging }) => electionService.updateCandidate({ id, belonging }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.candidates() });
    },
  });
};

// Admin: Delete Candidate
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => electionService.deleteCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.candidates() });
    },
  });
};

// Admin: Statistics
export const useElectionPrivateStatistics = () => {
  return useQuery({
    queryKey: ELECTION_KEYS.privateStatistics(),
    queryFn: () => electionService.getPrivateStatistics(),
  });
};

// User: Submit Vote Batch
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

// Admin: Resolve Election Results and Reset Active Cycle
export const useResolveElection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => electionService.resolveAndReset(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ELECTION_KEYS.all });
    },
  });
};