import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './PageBanner.css';

/**
 * PageBanner — Split-layout hero banner.
 *
 * Layout (LTR)
 * Layout (RTL)
 *
 * The photo is fully visible with no dark overlay.
 * A diagonal white clip-path separates the image from the text side.
 *
 * Props:
 *  - image        : path to background photo
 *  - titleEn / titleAr
 *  - subtitleEn / subtitleAr
 *  - descEn / descAr
 */
const PageBanner = ({
  image,
  mobileImage,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  descEn,
  descAr,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // For Arabic (RTL) the image goes to the right and text to the left
  const imageSide = (
    <div className="page-banner__image-side">
      {mobileImage ? (
        <picture className="page-banner__picture">
          <source media="(max-width: 768px)" srcSet={mobileImage} />
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="page-banner__bg"
          />
        </picture>
      ) : (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="page-banner__bg"
        />
      )}
    </div>
  );

  const textSide = (
    <div className="page-banner__text-side">
      <div className="page-banner__content">
        <h1 className="page-banner__title">
          {isAr ? titleAr : titleEn}
        </h1>
        <h2 className="page-banner__subtitle">
          {isAr ? subtitleAr : subtitleEn}
        </h2>
        <p className="page-banner__desc">
          {isAr ? descAr : descEn}
        </p>
      </div>
    </div>
  );

  // Decorative dot grid
  const dots = (
    <div className="page-banner__dots" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );

  return (
    <div className="page-banner" dir={isAr ? 'rtl' : 'ltr'}>
      {imageSide}
      {textSide}
      {dots}
    </div>
  );
};

export default PageBanner;
