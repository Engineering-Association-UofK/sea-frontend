import React, { useState } from 'react';
import { Container, Card, Button, ProgressBar, Alert, Spinner, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useElectionPublicStatistics } from '../../features/election/hooks/useElection';
import CountdownTimer from './CountdownTimer';
import VotingView from './VotingView';
import ResultsView from './ResultsView';

const ElectionPage = () => {
  const { data: stats, isLoading, isError, refetch } = useElectionPublicStatistics();
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'voting' | 'results'

  if (isLoading) {
    return (
      <div className="election-page-wrapper min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Checking election status...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="election-page-wrapper min-vh-100 d-flex align-items-center justify-content-center py-5">
        <Container style={{ maxWidth: '600px' }}>
          <Alert variant="danger" className="text-center shadow-sm">
            Failed to fetch election statistics.
          </Alert>
        </Container>
      </div>
    );
  }

  const now = new Date();
  const ticketsStartTime = new Date(stats.tickets_start_time);
  const startTime = new Date(stats.start_time);
  const endTime = new Date(stats.end_time);

  const isPreStart = now < startTime;
  const isVotingActive = now >= startTime && now <= endTime;
  const isPostVoting = now > endTime;
  const isTicketOpen = now >= ticketsStartTime;

  // View Routing Logic
  if (activeView === 'voting') {
    return (
      <div className="election-page-wrapper min-vh-100 py-4 pb-5">
        <Container>
          <VotingView stats={stats} onBack={() => setActiveView('overview')} />
        </Container>
      </div>
    );
  }

  if (activeView === 'results') {
    return (
      <div className="election-page-wrapper min-vh-100 py-4">
        <Container>
          <ResultsView cycle={stats.current_cycle} onBack={() => setActiveView('overview')} />
        </Container>
      </div>
    );
  }

  return (
    <div className="h-100 election-page-wrapper min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Container style={{ maxWidth: '680px' }}>
        <Card className="border-0 shadow text-center p-4 w-100">
          <Card.Body>
            <div className="mb-3">
              <Badge bg="dark" className="px-3 py-2 fs-6">
                Election Cycle #{stats.current_cycle}
              </Badge>
            </div>

            <h2 className="fw-bold mb-3">Student Body Election</h2>

            {/* PHASE 1: PRE-START */}
            {isPreStart && (
              <div className="my-4">
                <h5 className="text-muted mb-3">Voting Begins In:</h5>
                <div className="mb-4">
                  <CountdownTimer targetDate={stats.start_time} onEnd={() => refetch()} />
                </div>

                {!isTicketOpen ? (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="ticket-countdown-tooltip">
                        Ticket Release Countdown:{' '}
                        <CountdownTimer targetDate={stats.tickets_start_time} noSeconds={true} />
                      </Tooltip>
                    }
                  >
                    <Alert variant="warning" className="d-inline-block border-warning text-dark px-4 py-3 cursor-pointer">
                      <i className="bi bi-clock-history me-2"></i>
                      Voting tickets are not open yet. Release Date:{' '}
                      <strong>{ticketsStartTime.toLocaleString()}</strong>
                    </Alert>
                  </OverlayTrigger>
                ) : (
                  <Alert variant="success" className="d-inline-block border-success px-4 py-3">
                    <i className="bi bi-check-circle me-2"></i>
                    Voting tickets are now available! Please <strong>Sign In</strong> to claim your ticket code.
                  </Alert>
                )}
              </div>
            )}

            {/* PHASE 2: VOTING ACTIVE */}
            {isVotingActive && (
              <div className="my-4">
                <Badge bg="danger" className="px-3 py-2 fs-6 mb-3 animate-pulse">
                  • Voting Live
                </Badge>
                <h5 className="text-muted mb-3">Voting Ends In:</h5>
                <div className="mb-4">
                  <CountdownTimer targetDate={stats.end_time} onEnd={() => refetch()} />
                </div>

                <div className="mx-auto my-4" style={{ maxWidth: '400px' }}>
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span>Student Voter Turnout</span>
                    <span>{stats.vote_percentage}%</span>
                  </div>
                  <ProgressBar now={stats.vote_percentage} variant="success" animated style={{ height: '12px' }} />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 rounded-pill fw-bold"
                  onClick={() => setActiveView('voting')}
                >
                  Vote Now
                </Button>
              </div>
            )}

            {/* PHASE 3: POST-VOTING */}
            {isPostVoting && (
              <div className="my-4">
                <Alert variant="secondary" className="d-inline-block px-4 py-2 mb-4">
                  Voting for Cycle #{stats.current_cycle} has ended.
                </Alert>

                <div className="mx-auto my-4" style={{ maxWidth: '400px' }}>
                  <div className="d-flex justify-content-between small fw-bold mb-1">
                    <span>Final Voter Turnout</span>
                    <span>{stats.vote_percentage}%</span>
                  </div>
                  <ProgressBar now={stats.vote_percentage} variant="secondary" style={{ height: '12px' }} />
                </div>

                <Button
                  variant="dark"
                  size="lg"
                  className="px-5 rounded-pill fw-bold"
                  onClick={() => setActiveView('results')}
                >
                  View Election Results
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ElectionPage;