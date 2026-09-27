import React from 'react';
import { Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetAdminAnalysis } from '../../../features/admin/hooks/useAdmin';

const METRICS_MAP = [
  {
    key: 'users',
    label: 'Registered Users',
    icon: 'bi-people-fill',
    badgeBg: 'bg-primary',
    borderAccent: '#0d6efd',
    route: '/admin/users',
    desc: 'Total active accounts',
  },
  {
    key: 'certificates',
    label: 'Certificates Issued',
    icon: 'bi-award-fill',
    badgeBg: 'bg-success',
    borderAccent: '#198754',
    route: '/admin/certificates',
    desc: 'Verified PDF credentials',
  },
  {
    key: 'events',
    label: 'Platform Events',
    icon: 'bi-calendar-event-fill',
    badgeBg: 'bg-warning',
    borderAccent: '#ffc107',
    route: '/admin/events',
    desc: 'Scheduled activities',
  },
  {
    key: 'posts',
    label: 'Published Posts',
    icon: 'bi-journal-text',
    badgeBg: 'bg-info',
    borderAccent: '#0dcaf0',
    route: '/admin/posts',
    desc: 'News & announcements',
  },
  {
    key: 'forms',
    label: 'Form Responses',
    icon: 'bi-ui-checks-grid',
    badgeBg: 'bg-dark',
    borderAccent: '#212529',
    route: '/admin/forms',
    desc: 'Feedback & submissions',
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: analysis, isLoading, isError, refetch, isFetching } = useGetAdminAnalysis();

  const totalEntities = analysis
    ? Object.values(analysis).reduce((acc, curr) => acc + (Number(curr) || 0), 0)
    : 0;

  return (
    <div className="dashboard-container pb-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Platform Overview</h4>
          <p className="text-muted small mb-0">
            Real-time telemetry and management metrics across systems.
          </p>
        </div>
        <Button
          variant="white"
          size="sm"
          className="border shadow-sm d-flex align-items-center gap-2 px-3 fw-semibold text-secondary"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <i className={`bi bi-arrow-clockwise ${isFetching ? 'spin' : ''}`}></i>
          {isFetching ? 'Refreshing...' : 'Sync Telemetry'}
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <Row className="g-3">
          {[1, 2, 3, 4, 5].map((idx) => (
            <Col key={idx} xs={12} sm={6} lg={4} xl={2.4}>
              <Card className="border-0 shadow-sm p-3 placeholder-glow">
                <div className="placeholder col-6 mb-2 rounded"></div>
                <div className="placeholder col-4 h2 rounded"></div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Error Alert */}
      {isError && (
        <Card className="border-0 bg-danger-subtle text-danger p-4 text-center mb-4 shadow-sm">
          <i className="bi bi-exclamation-octagon fs-2 mb-2"></i>
          <div className="fw-bold">Failed to load platform telemetry</div>
          <div className="mt-3">
            <Button variant="danger" size="sm" onClick={() => refetch()}>
              Retry Connection
            </Button>
          </div>
        </Card>
      )}

      {/* Main Grid */}
      {analysis && (
        <>
          <Row className="g-3 mb-4">
            {METRICS_MAP.map((item) => {
              const count = analysis[item.key] ?? 0;
              const percentage = totalEntities > 0 ? ((count / totalEntities) * 100).toFixed(1) : 0;

              return (
                <Col key={item.key} xs={12} sm={6} lg={4} xl={2.4}>
                  <Card
                    className="w-100 border-0 shadow-sm h-100 position-relative overflow-hidden metric-card"
                    style={{
                      cursor: 'pointer',
                      borderLeft: `4px solid ${item.borderAccent}`,
                      backgroundColor: '#ffffff',
                    }}
                    onClick={() => navigate(item.route)}
                  >
                    <Card.Body className="p-3 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-muted fw-semibold small text-uppercase">
                            {item.label}
                          </span>
                          <div
                            className={`rounded-2 text-white p-2 d-flex align-items-center justify-content-center ${item.badgeBg}`}
                            style={{ width: '32px', height: '32px' }}
                          >
                            <i className={`bi ${item.icon} fs-6`}></i>
                          </div>
                        </div>

                        <div className="d-flex align-items-baseline gap-2 my-1">
                          <span className="display-6 fw-bold text-dark font-monospace">
                            {count.toLocaleString()}
                          </span>
                          <span className="badge bg-light text-secondary border small">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className="text-muted fs-7 text-truncate">{item.desc}</span>
                        <i className="bi bi-chevron-right text-muted fs-7"></i>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Breakdown Bar */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Platform Entity Breakdown</h6>
                  <span className="text-muted small">
                    Relative ratio of recorded records across systems ({totalEntities} total)
                  </span>
                </div>
                <Badge bg="dark" className="font-monospace px-2 py-1">
                  System Health: Nominal
                </Badge>
              </div>

              <ProgressBar className="rounded-3 overflow-hidden mb-3" style={{ height: '14px' }}>
                <ProgressBar variant="primary" now={(analysis.users / totalEntities) * 100} key={1} />
                <ProgressBar variant="success" now={(analysis.certificates / totalEntities) * 100} key={2} />
                <ProgressBar variant="warning" now={(analysis.events / totalEntities) * 100} key={3} />
                <ProgressBar variant="info" now={(analysis.posts / totalEntities) * 100} key={4} />
                <ProgressBar variant="dark" now={(analysis.forms / totalEntities) * 100} key={5} />
              </ProgressBar>

              <div className="d-flex flex-wrap gap-3 pt-2 border-top">
                {METRICS_MAP.map((m) => (
                  <div key={m.key} className="d-flex align-items-center gap-2 small">
                    <span
                      className={`rounded-circle d-inline-block ${m.badgeBg}`}
                      style={{ width: '8px', height: '8px' }}
                    ></span>
                    <span className="text-secondary">{m.label}:</span>
                    <strong className="text-dark font-monospace">{analysis[m.key] ?? 0}</strong>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      <style>{`
        .metric-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important;
        }
        .fs-7 {
          font-size: 0.78rem;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;