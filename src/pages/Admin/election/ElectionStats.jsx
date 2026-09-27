import React from 'react';
import { Row, Col, Card, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { formatDate } from './electionUtils';

export const ElectionStats = ({ stats, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Row className="g-3 mb-4">
        {[1, 2, 3, 4].map((idx) => (
          <Col key={idx} xs={12} sm={6} lg={3}>
            <Card className="w-100 border-0 shadow-sm p-3 placeholder-glow">
              <div className="placeholder col-6 mb-2 rounded"></div>
              <div className="placeholder col-4 h2 rounded"></div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger" className="border-0 shadow-sm mb-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Failed to load election statistics. Please check server connectivity.
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div className="mb-5">
      <h6 className="fw-bold text-uppercase text-muted small mb-3 tracking-wide">
        <i className="bi bi-graph-up me-2"></i>Private Election Telemetry
      </h6>
      <Row className="g-3 mb-3">
        {/* Metric 1: Voter Turnout */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="w-100 border-0 shadow-sm h-100 border-start border-primary border-4">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold small text-uppercase">Turnout Rate</span>
                <Badge bg="primary-subtle" text="primary" className="p-2 rounded-2">
                  <i className="bi bi-pie-chart-fill fs-6"></i>
                </Badge>
              </div>
              <div className="display-6 fw-bold text-dark font-monospace mb-1">
                {stats.vote_percentage ?? 0}%
              </div>
              <ProgressBar
                variant="primary"
                now={stats.vote_percentage ?? 0}
                style={{ height: '6px' }}
                className="mt-2 rounded-pill"
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Metric 2: Votes Cast */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="w-100 border-0 shadow-sm h-100 border-start border-success border-4">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold small text-uppercase">Total Votes</span>
                <Badge bg="success-subtle" text="success" className="p-2 rounded-2">
                  <i className="bi bi-check-circle-fill fs-6"></i>
                </Badge>
              </div>
              <div className="display-6 fw-bold text-dark font-monospace">
                {(stats.number_of_voters ?? 0).toLocaleString()}
              </div>
              <span className="text-muted fs-7">
                out of <strong>{(stats.student_body ?? 0).toLocaleString()}</strong> eligible
              </span>
            </Card.Body>
          </Card>
        </Col>

        {/* Metric 3: Tickets Distributed */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="w-100 border-0 shadow-sm h-100 border-start border-warning border-4">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold small text-uppercase">Tickets Claimed</span>
                <Badge bg="warning-subtle" text="warning" className="p-2 rounded-2">
                  <i className="bi bi-ticket-perforated-fill fs-6"></i>
                </Badge>
              </div>
              <div className="display-6 fw-bold text-dark font-monospace">
                {(stats.tickets_distributed ?? 0).toLocaleString()}
              </div>
              <span className="text-muted fs-7">
                {stats.student_body
                  ? ((stats.tickets_distributed / stats.student_body) * 100).toFixed(1)
                  : 0}
                % coverage
              </span>
            </Card.Body>
          </Card>
        </Col>

        {/* Metric 4: Recent Activity */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="w-100 border-0 shadow-sm h-100 border-start border-info border-4">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fw-semibold small text-uppercase">24h Activity</span>
                <Badge bg="info-subtle" text="info" className="p-2 rounded-2">
                  <i className="bi bi-lightning-charge-fill fs-6"></i>
                </Badge>
              </div>
              <div className="display-6 fw-bold text-dark font-monospace">
                {(stats.votes_in_last_day ?? 0).toLocaleString()}
              </div>
              <span className="text-muted fs-7">votes cast past 24 hours</span>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Timeline Info Bar */}
      <Card className="w-100 border-0 shadow-sm bg-white">
        <Card.Body className="p-1">
          <Row className="g-2 text-center text-sm-start">
            <Col xs={12} sm={true}>
              <div className="small text-muted">Ticket Claim Start</div>
              <div className="fw-semibold text-dark font-monospace small">
                {formatDate(stats.tickets_start_time)}
              </div>
            </Col>
            <Col xs={12} sm={true} className="border-start-sm">
              <div className="small text-muted">Voting Start Time</div>
              <div className="fw-semibold text-dark font-monospace small">
                {formatDate(stats.start_time)}
              </div>
            </Col>
            <Col xs={12} sm={true} className="border-start-sm">
              <div className="small text-muted">Voting End Time</div>
              <div className="fw-semibold text-dark font-monospace small">
                {formatDate(stats.end_time)}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};