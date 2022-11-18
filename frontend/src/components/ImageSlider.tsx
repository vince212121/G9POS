import React, { useState } from "react";
import { SliderData } from "../assets/data";
//import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';

const ImageSlider = ({ slides }: { slides: { image: String }[] }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="flex flex-row justify-center mt-5">
      {/* <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
      <FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} /> */}
      <div className="absolute top-80 left-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          className="w-20 h-10"
          viewBox="0 0 24 24"
          onClick={prevSlide}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m11 15-3-3m0 0 3-3m-3 3h8M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z"
          />
        </svg>
      </div>
      {SliderData.map((slide, index) => {
        return (
          <div className="flex justify-center" key={index}>
            {index === current && (
              <img
                src={slide.image}
                alt="travel image"
                className="w-11/12 h-3/5 ml-0 "
              />
            )}
          </div>
        );
      })}
      <div className="absolute top-80 right-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          className="w-20 h-10"
          viewBox="0 0 24 24"
          onClick={nextSlide}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m13 9 3 3m0 0-3 3m3-3H8m13 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ImageSlider;
