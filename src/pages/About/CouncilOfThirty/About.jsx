import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLanguage } from "../../../context/LanguageContext";
import { useTeam } from "../../../features/ThirtiethCouncil/hooks/useThirtiethCouncil";
import "./About.css";

const ThirtiethCouncilAbout = () => {
  const { language } = useLanguage();
  const { data, isLoading, error } = useTeam();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedMembers = data
    ? [...data].sort((a, b) => a.display_order - b.display_order)
    : [];

  const MemberCard = ({ member, variant = "default" }) => {
    let cardClass = "member-card";
    if (variant === "large") cardClass += " card-large";
    else if (variant === "small") cardClass += " card-small";
    else if (variant === "medium") cardClass += " medium-size";

    return (
      <div className={cardClass}>
        <img
          src={
            member.profile_pic ||
            `https://ui-avatars.com/api/?background=0d6efd&color=fff&name=${encodeURIComponent(language === "en" ? member.name_en?.charAt(0) : member.name_ar?.charAt(0))}`
          }
          alt={language === "en" ? member.name_en : member.name_ar}
          className="member-img"
        />
        <div className="member-info">
          <h3 className="member-name">
            {language === "en"
              ? member.name_en.split(" ").slice(0, 2).join(" ")
              : member.name_ar.split(" ").slice(0, 2).join(" ")}
          </h3>
          <p className="member-role">{member.role}</p>
          <p className="member-bio">{member.bio}</p>
        </div>
      </div>
    );
  };

  const MemberListItem = ({ member }) => {
    return (
      <div className="member-list-item">
        <img
          src={
            member.profile_pic ||
            `https://ui-avatars.com/api/?background=0d6efd&color=fff&name=${encodeURIComponent(language === "en" ? member.name_en.charAt(0) : member.name_ar.charAt(0))}`
          }
          alt={language === "en" ? member.name_en : member.name_ar}
          className="member-list-img"
        />
        <div className="member-list-info">
          <h4 className="member-list-name">
            {language === "en"
              ? member.name_en.split(" ").slice(0, 2).join(" ")
              : member.name_ar.split(" ").slice(0, 2).join(" ")}
          </h4>
          <p className="member-list-role">{member.role}</p>
          <p className="member-list-bio">{member.bio}</p>
        </div>
      </div>
    );
  };

  const SkeletonLoader = () => {
    if (isDesktop) {
      return (
        <>
          <div className="single-large-card">
            <div className="member-card card-large skeleton-card">
              <div className="skeleton-img skeleton-img-large"></div>
              <div className="skeleton-text">
                <div className="skeleton-title skeleton-title-large"></div>
                <div className="skeleton-subtitle"></div>
                <div className="skeleton-line"></div>
              </div>
            </div>
          </div>
          <div className="two-col-grid">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="member-card medium-size skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-text">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-subtitle"></div>
                  <div className="skeleton-line"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="team-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="member-card skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-text">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-subtitle"></div>
                  <div className="skeleton-line"></div>
                </div>
              </div>
            ))}
          </div>
          <h3 className="section-title skeleton-title-section"></h3>
          <div className="small-cards-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="member-card card-small skeleton-card">
                <div className="skeleton-img skeleton-img-small"></div>
                <div className="skeleton-text skeleton-text-small">
                  <div className="skeleton-title skeleton-title-small"></div>
                  <div className="skeleton-subtitle skeleton-subtitle-small"></div>
                  <div className="skeleton-line skeleton-line-small"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
    return (
      <div className="team-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="member-card skeleton-card">
            <div className="skeleton-img"></div>
            <div className="skeleton-text">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading || error) {
    return (
      <div className="team-members-page">
        <Container className="py-5">
          <h1 className="text-center fw-bold mb-5 text-primary"></h1>
          <SkeletonLoader />
        </Container>
      </div>
    );
  }

  const firstMember = sortedMembers.find((m) => m.display_order === 1);
  const nextTwo = sortedMembers.filter(
    (m) => m.display_order >= 2 && m.display_order <= 3,
  );
  const middleGroup = sortedMembers.filter(
    (m) => m.display_order >= 4 && m.display_order <= 11,
  );
  const restGroup = sortedMembers.filter((m) => m.display_order >= 12);

  const firstEleven = sortedMembers.slice(0, 11);
  const remainingMembers = sortedMembers.slice(11);

  const DesktopLayout = () => (
    <>
      {firstMember && (
        <div className="single-large-card">
          <MemberCard member={firstMember} variant="large" />
        </div>
      )}
      {nextTwo.length > 0 && (
        <div className="two-col-grid">
          {nextTwo.map((member) => (
            <MemberCard key={member.user_id} member={member} variant="medium" />
          ))}
        </div>
      )}
      {middleGroup.length > 0 && (
        <div className="team-grid">
          {middleGroup.map((member) => (
            <MemberCard key={member.user_id} member={member} />
          ))}
        </div>
      )}
      {restGroup.length > 0 && (
        <>
          <h3 className="section-title"></h3>
          <div className="small-cards-grid">
            {restGroup.map((member) => (
              <MemberCard
                key={member.user_id}
                member={member}
                variant="small"
              />
            ))}
          </div>
        </>
      )}
    </>
  );

  const MobileLayout = () => (
    <>
      {firstEleven.length > 0 && (
        <div className="team-grid">
          {firstEleven.map((member) => (
            <MemberCard key={member.user_id} member={member} />
          ))}
        </div>
      )}
      {remainingMembers.length > 0 && (
        <div className="list-view-container">
          <h3 className="list-view-title"></h3>
          {remainingMembers.map((member) => (
            <MemberListItem key={member.user_id} member={member} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="team-members-page">
      <Container className="py-5">
        <h1 className="text-center fw-bold mb-5 text-primary"></h1>
        {isDesktop ? <DesktopLayout /> : <MobileLayout />}
      </Container>
    </div>
  );
};

export default ThirtiethCouncilAbout;
