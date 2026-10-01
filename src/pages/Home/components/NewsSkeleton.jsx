import React from 'react';
import { Row, Col, Card, Placeholder } from 'react-bootstrap';

const NewsSkeleton = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer-placeholder {
            background: linear-gradient(
              90deg, 
              #f0f2f5 25%, 
              #e1e4e8 50%, 
              #f0f2f5 75%
            ) !important;
            background-size: 200% 100% !important;
            animation: shimmer 2s infinite linear !important;
            border: none !important;
            border-radius: 4px;
          }
          .skeleton-card {
            border-radius: 1rem !important; /* matches rounded-4 */
          }
        `}
      </style>
      
      {/* Desktop Skeleton (3 Cards) */}
      <Row className="d-none d-md-flex g-4">
        {[1, 2, 3].map((i) => (
          <Col md={4} key={`desktop-skel-${i}`}>
            <Card className="skeleton-card h-100 border-0 shadow-sm overflow-hidden">
              {/* Image Area */}
              <div style={{ height: '220px', position: 'relative' }}>
                <Placeholder as="div" animation="glow" className="h-100">
                  <Placeholder className="w-100 h-100 shimmer-placeholder" style={{ borderRadius: 0 }} />
                </Placeholder>
                {/* Date Badge Skeleton */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', width: '60px', height: '25px' }}>
                   <Placeholder as="div" animation="glow">
                      <Placeholder className="w-100 h-100 shimmer-placeholder" style={{ borderRadius: '8px' }} />
                   </Placeholder>
                </div>
              </div>

              <Card.Body className="p-4 d-flex flex-column">
                {/* Title Lines */}
                <Placeholder as="div" animation="glow" className="mb-3">
                  <Placeholder xs={10} className="shimmer-placeholder mb-2" style={{ height: '1.2rem' }} />
                  <Placeholder xs={7} className="shimmer-placeholder" style={{ height: '1.2rem' }} />
                </Placeholder>

                {/* Summary Lines */}
                <Placeholder as="div" animation="glow" className="mb-4 flex-grow-1">
                  <Placeholder xs={12} size="xs" className="shimmer-placeholder mb-1" />
                  <Placeholder xs={12} size="xs" className="shimmer-placeholder mb-1" />
                  <Placeholder xs={9} size="xs" className="shimmer-placeholder" />
                </Placeholder>

                {/* Footer Link Skeleton */}
                <div className="pt-3 border-top mt-auto">
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={4} className="shimmer-placeholder" style={{ height: '1rem' }} />
                  </Placeholder>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mobile Skeleton */}
      <div className="d-md-none d-flex flex-column gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={`mobile-skel-${i}`} className="skeleton-card shadow-sm border-0 overflow-hidden">
            <Row className="g-0 align-items-stretch">
              <Col xs={4}>
                <div style={{ height: '100%', minHeight: '140px' }}>
                  <Placeholder as="div" animation="glow" className="h-100">
                    <Placeholder className="w-100 h-100 shimmer-placeholder" style={{ borderRadius: 0 }} />
                  </Placeholder>
                </div>
              </Col>
              <Col xs={8}>
                <Card.Body className="p-3 h-100 d-flex flex-column">
                  {/* Date text */}
                  <Placeholder as="div" animation="glow" className="mb-2">
                    <Placeholder xs={4} size="sm" className="shimmer-placeholder" />
                  </Placeholder>
                  {/* Title */}
                  <Placeholder as="div" animation="glow" className="mb-2">
                    <Placeholder xs={11} className="shimmer-placeholder" style={{ height: '0.9rem' }} />
                    <Placeholder xs={8} className="shimmer-placeholder" style={{ height: '0.9rem', marginTop: '4px' }} />
                  </Placeholder>
                  {/* Summary */}
                  <Placeholder as="div" animation="glow" className="mb-3">
                    <Placeholder xs={12} size="xs" className="shimmer-placeholder" />
                  </Placeholder>
                  {/* Read More link */}
                  <Placeholder as="div" animation="glow" className="mt-auto">
                    <Placeholder xs={5} size="sm" className="shimmer-placeholder" />
                  </Placeholder>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </>
  );
};

export { NewsSkeleton };