import React, { useEffect, useRef } from 'react';
import gsap from 'gsap'; // gsap 라이브러리 import
//css
import '../../styles/common.css';
import '../../styles/main.css';
// img
import BestMenu from '../../img/bestmenu.png';
import CheesePopcon from '../../img/cheese_popcon.png';
import SweetPopcon from '../../img/sweet_popcon.png';

const Visual = () => {
  const fadeEls = useRef([]);

  useEffect(() => {
    fadeEls.current.forEach((fadeEl, index) => {
      gsap.to(fadeEl, {
        delay: (index + 1) * 0.7,
        opacity: 1,
        duration: 1
      });
    });
  }, []);

  return (
    <div>
      <section className="visual">
        <div className="inner">
          <div className="title fade-in" ref={el => (fadeEls.current[1] = el)}>
            <img src={BestMenu} alt="현재 인기있는 팝콘세트" id="popcon0" />
          </div>
          <div className="fade-in" ref={el => (fadeEls.current[2] = el)}>
            <img src={CheesePopcon} alt="치즈팝콘 2인 세트" className="popcon1 image" />
          </div>
          <div className="fade-in" ref={el => (fadeEls.current[3] = el)}>
            <img src={SweetPopcon} alt="카라멜팝콘 2인 세트" className="popcon2 image" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visual;