import React, { useState, useEffect, useCallback } from "react";

type Props = {
  slides: any;
};

const ImageSlider = ({ slides }: Props) => {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(false);
  const length = slides.length;

  const nextSlide = useCallback(() => {
    if (!pause) setCurrent(current === length - 1 ? 0 : current + 1);
  }, [current, length, pause]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!Array.isArray(slides) || length <= 0) {
    return null;
  }

  return (
    <div className="flex flex-row justify-center mt-5">
      {slides.map((slide, index) => {
        return (
          <div key={index} className="flex justify-center">
            {index === current && (
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-3/4 md:h-3/4"
                onMouseEnter={() => {
                  setPause(true);
                }}
                onMouseLeave={() => {
                  setPause(false);
                }}
              />
            )}
          </div>
        );
      })}

      <button
        className="absolute mt-40 left-5 lg:mt-0 lg:top-80 lg:left-20 bg-white rounded-3xl"
        onClick={prevSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m11 15-3-3m0 0 3-3m-3 3h8M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z"
          />
        </svg>
      </button>
      <button
        className="absolute mt-40 right-5 lg:mt-0 lg:top-80 lg:right-20 bg-white rounded-3xl"
        onClick={nextSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m13 9 3 3m0 0-3 3m3-3H8m13 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ImageSlider;
