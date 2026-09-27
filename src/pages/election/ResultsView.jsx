import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Spinner, Alert, Badge, Collapse } from 'react-bootstrap';
import { useElectionResults } from '../../features/election/hooks/useElection';

const ResultsView = ({ cycle, onBack }) => {
  const { data: results = [], isLoading, isError } = useElectionResults(cycle);
  const [expandedId, setExpandedId] = useState(null);

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a.place - b.place);
  }, [results]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRankBadgeClass = (place) => {
    if (place === 1) return 'bg-warning text-dark';
    if (place === 2) return 'bg-secondary text-white';
    if (place === 3) return 'bg-dark text-white';
    return 'bg-light text-dark border';
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading election results...</p>
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">Failed to load election results.</Alert>;
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" size="sm" onClick={onBack}>
          ← Back to Overview
        </Button>
        <h5 className="fw-bold mb-0">Election Cycle #{cycle} Results</h5>
      </div>

      {/* DESKTOP VIEW: Standard Data Table */}
      <Card className="w-100 border-0 shadow-sm d-none d-md-block">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Rank</th>
                <th>Candidate Name</th>
                <th>Department / Belonging</th>
                <th>Votes Received</th>
                <th>User ID</th>
                <th>Resolved Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((item) => (
                <tr key={item.user_id + '-' + item.place}>
                  <td>
                    <Badge bg={item.place === 1 ? 'warning' : item.place === 2 ? 'secondary' : item.place === 3 ? 'dark' : 'light'} text={item.place > 3 ? 'dark' : 'white'} className="fs-6">
                      #{item.place}
                    </Badge>
                  </td>
                  <td className="fw-bold">{item.name}</td>
                  <td><span className="text-capitalize">{item.belonging}</span></td>
                  <td className="fw-bold text-primary">{item.number_of_votes} votes</td>
                  <td><span className="font-monospace text-muted">{item.user_id}</span></td>
                  <td><small className="text-muted">{new Date(item.created_at).toLocaleDateString()}</small></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MOBILE VIEW: Compact Progressive Disclosure List */}
      <div className="d-md-none border rounded shadow-sm overflow-hidden bg-white mb-4">
        {sortedResults.map((item, index) => {
          const itemKey = `${item.user_id}-${item.place}`;
          const isExpanded = expandedId === itemKey;

          return (
            <div key={itemKey} className={index > 0 ? 'border-top' : ''}>
              {/* Single Clean Primary Row */}
              <div
                className={`d-flex align-items-center justify-content-between py-2 px-3 ${
                  isExpanded ? 'bg-light' : ''
                }`}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => toggleExpand(itemKey)}
              >
                {/* Left: Rank Badge & Candidate Name */}
                <div className="d-flex align-items-center gap-2 min-w-0 me-2">
                  <span
                    className={`badge ${getRankBadgeClass(item.place)} px-2 py-1 flex-shrink-0`}
                    style={{ minWidth: '32px', fontSize: '0.75rem' }}
                  >
                    #{item.place}
                  </span>
                  <span className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.875rem' }}>
                    {item.name}
                  </span>
                </div>

                {/* Right: Vote Count & Chevron Indicator */}
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <span className="fw-bold text-primary" style={{ fontSize: '0.875rem' }}>
                    {item.number_of_votes}{' '}
                    <span className="text-muted fw-normal" style={{ fontSize: '0.7rem' }}>
                      votes
                    </span>
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Collapsible Metadata Drawer */}
              <Collapse in={isExpanded}>
                <div>
                  <div
                    className="bg-light px-3 py-2 border-top text-muted"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <div className="mb-1">
                      <span className="fw-semibold text-muted me-1">Belonging / Dept:</span>
                      <span className="text-dark text-capitalize">{item.belonging}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-semibold text-muted me-1">INDEX:</span>
                        <span className="font-monospace text-dark">{item.user_id}</span>
                      </div>
                      <div>
                        <span className="fw-semibold text-muted me-1">Resolved:</span>
                        <span className="text-dark">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsView;