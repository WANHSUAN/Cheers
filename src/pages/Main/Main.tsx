import {Timestamp, collection, getDocs} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled, {keyframes} from "styled-components/macro";
import {AuthContext} from "../../Context/AuthContext";
import Scroll from "../../components/Scroll/Scroll";
import {db} from "../../utils/firebase";
import Calendar from "../Calendar/Calendar";
import MainMap from "../Main/MainMap";
import main from "../Question/main.png";
import Hashtag from "./Hashtag";
import "./styles.css";

const Icons = styled.i`
  opacity: 0.2;
  font-size: calc(0.3rem + 1vw);
  color: transparent;
  transition: opacity 0.3s 0.1s ease;
  -webkit-text-stroke: 3px rgba(0, 0, 0, 0.5);
`;

const LabelText = styled.span``;

const LabelCheck = styled.span`
  display: inline-block;
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0, 0.1);
  background: white;
  vertical-align: middle;
  width: 33px;
  height: 33px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.3s ease;

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }

  &:hover {
    border: 3px solid rgba(0, 0, 0, 0.2);
  }
`;

const Icon = keyframes`
from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }`;

const Check = keyframes`
  0% {
    width: 1.5em;
    height: 1.5em;
    border-width: 3px;
  }
  10% {
    width: 1.5em;
    height: 1.5em;
    opacity: 0.1;
    background: rgba(0, 0, 0, 0.2);
    border-width: 8px;
  }
  12% {
    width: 1.5em;
    height: 1.5em;
    opacity: 0.4;
    background: rgba(0, 0, 0, 0.1);
    border-width: 0;
  }
  50% {
    width: 2em;
    height: 2em;
    background: #00d47877;
    border: 0;
    opacity: 0.6;
  }
  100% {
    width: 2em;
    height: 2em;
    background: #00d47877;
    border: 0;
    opacity: 1;
  }
  `;

const EventCheckbox = styled.input`
  display: none;

  &:checked + ${LabelText} ${LabelCheck} {
    animation: ${Check} 0.5s cubic-bezier(0.895, 0.03, 0.685, 0.22) forwards;

    ${Icons} {
      opacity: 1;
      transform: scale(0);
      color: white;
      -webkit-text-stroke: 0;
      animation: ${Icon} 0.3s cubic-bezier(1, 0.008, 0.565, 1.65) 0.1s 1
        forwards;
    }
  }
`;

const EventLabel = styled.label``;

const EventCenter = styled.div`
  width: 40px;

  @media (max-width: 768px) {
    width: 30px;
  }
`;

const IconLink = styled.link``;

const SpecialBar = styled.span`
  color: black;
  font-weight: 700;
`;

const More = styled.button`
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  font-size: 1rem;
  position: relative;
  margin-top: 60px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #fff;

  @media (max-width: 1280px) {
    width: 50px;
    height: 50px;
    font-size: 0.9rem;
    line-height: 50px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 0.7rem;
    line-height: 40px;
  }

  @media (max-width: 414px) {
    margin-top: 100px;
  }

  &:active {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    color: #d19b18;

    &:after {
      border-color: #d19b18;
    }

    &:before {
      background-color: #fff;
    }
  }

  &:after {
    transition: 0.3s all ease;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    border: 2px solid #fff;
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    background: #d19b18;
    z-index: -1;
  }

  &:hover {
    &:after {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
`;

const Section2 = styled.div``;

const BarLink = styled.div`
  &:hover {
    cursor: pointer;
    transform: scale(2);
    transition: transform 0.5s ease;
  }
`;

const LinkImage = styled.image`
  filter: brightness(0.9);

  &:hover {
    border: 1px solid #fff;
  }
`;

const Rotate = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
  }
`;

const LinkText = styled.text`
  animation: ${Rotate} normal infinite 20s linear;
  -webkit-animation: ${Rotate} normal infinite 20s linear;
  transform-origin: 50% 50%;
`;

const LinkSvg = styled.svg`
  width: 60%;
  height: 200px;
  transform-box: fill-box;
  fill: #d19b18;
  stroke: #d19b18;
  stroke-width: 0.05em;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Flow = keyframes`
0% {
  transform: translate(-50%, -75%) rotate(0deg);
}
100% {
  transform: translate(-50%, -75%) rotate(360deg);
}`;

const Liquid = styled.div`
  position: absolute;
  top: -50px;
  left: 0;
  width: 200px;
  height: 200px;
  background: #d19a18;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
  transition: 0.5s;

  &::after {
    content: "";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -75%);
    background: #000;

    border-radius: 40%;
    background: rgba(20, 20, 20, 0.5);
    animation: ${Flow} 10s linear infinite;
  }

  &::before {
    content: "";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -75%);
    background: #000;

    border-radius: 45%;
    background: rgba(20, 20, 20, 1);
    animation: ${Flow} 5s linear infinite;
  }
`;

const TestSelect = styled.span`
  position: relative;
  color: #fff;
  font-size: 20px;
  z-index: 1;

  @media (max-width: 1280px) {
    font-size: 8px;
  }
`;

const Blink = keyframes`
0%,
  22%,
  36%,
  75% {
    color: #e4d4b1;
    text-shadow: 0 0 0.6rem #e4d4b1, 0 0 1.5rem #e4d4b1,
      -0.2rem 0.1rem 1rem #e2b03a, 0.2rem 0.1rem 1rem #e2b03a,
      0 -0.5rem 2rem #d19b18, 0 0.5rem 3rem #d19b18;
  }
  28%,
  33% {
    color: #e2b03a;
    text-shadow: none;
  }
  82%,
  97% {
    color: #d19b18;
    text-shadow: none;
  }`;

const Shine = keyframes`
  0% {
    color: #7f5c0b;
    text-shadow: none;
  }
  100% {
    color: #e4d4b1;
    text-shadow: 0 0 0.6rem #e4d4b1, 0 0 1.5rem #e4d4b1,
      -0.2rem 0.1rem 1rem #e2b03a, 0.2rem 0.1rem 1rem #e2b03a,
      0 -0.5rem 2rem #d19b18, 0 0.5rem 3rem #d19b18;
  }`;

const FastFlicker = styled.span`
  width: 450px;
  animation: ${Shine} 2s forwards, ${Blink} 10s 1s infinite;
`;

const FlickerItem = styled.span`
  width: 280px;
  animation: ${Shine} 2s forwards, ${Blink} 3s 2s infinite;
`;

const Flicker = keyframes`from {
    opacity: 1;
  }

  4% {
    opacity: 0.9;
  }

  6% {
    opacity: 0.85;
  }

  8% {
    opacity: 0.95;
  }

  10% {
    opacity: 0.9;
  }

  11% {
    opacity: 0.922;
  }

  12% {
    opacity: 0.9;
  }

  14% {
    opacity: 0.95;
  }

  16% {
    opacity: 0.98;
  }

  17% {
    opacity: 0.9;
  }

  19% {
    opacity: 0.93;
  }

  20% {
    opacity: 0.99;
  }

  24% {
    opacity: 1;
  }

  26% {
    opacity: 0.94;
  }

  28% {
    opacity: 0.98;
  }

  37% {
    opacity: 0.93;
  }

  38% {
    opacity: 0.5;
  }

  39% {
    opacity: 0.96;
  }

  42% {
    opacity: 1;
  }

  44% {
    opacity: 0.97;
  }

  46% {
    opacity: 0.94;
  }

  56% {
    opacity: 0.9;
  }

  58% {
    opacity: 0.9;
  }

  60% {
    opacity: 0.99;
  }

  68% {
    opacity: 1;
  }

  70% {
    opacity: 0.9;
  }

  72% {
    opacity: 0.95;
  }

  93% {
    opacity: 0.93;
  }

  95% {
    opacity: 0.95;
  }

  97% {
    opacity: 0.93;
  }

  to {
    opacity: 1;
  }`;

const Sign = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(
    ellipse 50% 35% at 50% 50%,
    #7f5c0b,
    transparent
  );
  font-size: 4rem;
  color: #e4d4b1;
  margin-bottom: 40px;
  text-shadow: 0 0 0.6rem #e4d4b1, 0 0 1.5rem #d19b18,
    -0.2rem 0.1rem 1rem #e2b03a, 0.2rem 0.1rem 1rem #e2b03a,
    0 -0.5rem 2rem #d19b18, 0 0.5rem 3rem #d19b18;
  animation: ${Shine} 2s forwards, ${Flicker} 3s infinite;

  @media (max-width: 1280px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SignSecond = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(
    ellipse 50% 35% at 50% 50%,
    #7f5c0b,
    transparent
  );
  font-size: 4rem;
  color: #e4d4b1;
  text-shadow: 0 0 0.6rem #e4d4b1, 0 0 1.5rem #d19b18,
    -0.2rem 0.1rem 1rem #e2b03a, 0.2rem 0.1rem 1rem #e2b03a,
    0 -0.5rem 2rem #d19b18, 0 0.5rem 3rem #d19b18;
  animation: ${Shine} 2s forwards, ${Flicker} 3s infinite;

  @media (max-width: 1280px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Wrapper = styled.div`
  text-align: center;
  max-width: 1100px;
  width: 80%;
  margin: 0 auto;
  padding-top: 60px;
  font-size: 16px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ArrowWrapper = styled.div`
  cursor: pointer;
  margin-top: 50px;
  display: table;
  width: 100%;
  height: 100%;
`;

const WrapperInner = styled.div`
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  height: 100%;
`;

const elasticus = keyframes`
  0% {
    transform-origin: 0% 0%;
    transform: scale(1, 0);
  }
  50% {
    transform-origin: 0% 0%;
    transform: scale(1, 1);
  }
  50.1% {
    transform-origin: 0% 100%;
    transform: scale(1, 1);
  }
  100% {
    transform-origin: 0% 100%;
    transform: scale(1, 0);
  }
`;

const ScrollDown = styled.div`
  display: block;
  position: relative;
  padding-top: 79px;
  text-align: center;

  &::before {
    content: " ";
    animation: ${elasticus} 1.2s cubic-bezier(1, 0, 0, 1) infinite;
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -1px;
    width: 2px;
    height: 90px;
    background: #d19b18;

    @media (max-width: 768px) {
      height: 40px;
    }
  }

  @media (max-width: 768px) {
    padding-top: 30px;
  }
`;

const ArrowDown = styled.span`
  display: block;
  margin: 0 auto;
  width: 10px;
  height: 80px;

  &::after {
    content: "";
    display: block;
    margin: 0;
    padding: 0;
    width: 8px;
    height: 8px;
    border-top: 2px solid #d19b18;
    border-right: 2px solid #d19b18;
    behavior: url(-ms-transform.htc);
    transform: rotate(135deg);
  }

  @media (max-width: 768px) {
    height: 50px;
  }
`;

const ScrollTitle = styled.span`
  display: block;
  text-transform: uppercase;
  color: #d19b18;
  font-size: 2rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 414px) {
    font-size: 1rem;
  }
`;

const Jump = keyframes`
  from, to { transform: scale(1, 1); }
  25% { transform: scale(0.95, 1.05); }
  50% { transform: scale(1.05, 0.95); }
  75% { transform: scale(0.955, 1.055); }
`;

const Test = styled(Link)`
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 250px;
  right: 50px;
  z-index: 1;
  border: none;
  background-color: #d19b18;
  color: #fff;
  border-radius: 50%;
  padding-top: 20px;
  cursor: pointer;
  overflow: hidden;
  animation: ${Jump} 1s infinite;
  text-decoration: none;

  &:hover {
    background-color: #fff;
    color: #d19b18;
    transition: ease 0.5s;

    ${Liquid} {
      top: -100px;
    }
  }

  @media (max-width: 1280px) {
    width: 70px;
    height: 70px;
    padding-top: 10px;
    right: 40px;
    bottom: 200px;
  }

  @media (max-width: 1024px) {
    width: 60px;
    height: 60px;
    font-size: 0.8rem;
    right: 35px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Slogan = styled.p`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  font-size: 8rem;
  color: #fff;
  letter-spacing: 10px;
  text-align: center;
  animation: ${fadeIn} 1.5s ease-in-out;

  @media (max-width: 1280px) {
    font-size: 6rem;
    top: 26.5%;
  }

  @media (max-width: 768px) {
    font-size: 4rem;
  }

  @media (max-width: 580px) {
    font-size: 3rem;
  }

  @media (max-width: 414px) {
    font-size: 2rem;
  }
`;

const MainImg = styled.img`
  width: 100%;
  height: 550px;
  margin-top: 270px;
  vertical-align: bottom;
  object-fit: cover;

  @media (max-width: 768px) {
    margin-top: 155px;
    height: 300px;
  }

  @media (max-width: 580px) {
    margin-top: 125px;
    height: 250px;
  }

  @media (max-width: 414px) {
    margin-top: 95px;
    height: 200px;
  }
`;

const fadeInPosition = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.div`
  font-size: 4rem;
  color: #fff;
  padding: 50px;
  text-align: center;
  margin: 300px 0;
  animation: ${fadeInPosition} 1s ease-in-out;

  @media (max-width: 768px) {
    margin: 200px 0;
  }

  @media (max-width: 660px) {
    display: none;
  }
`;

const AllBarTitleSection = styled.div`
  text-align: left;
`;

const AllBarSubTitle = styled.p`
  color: #d19b18;
  font-size: 2rem;
  margin-bottom: 20px;
  scroll-margin-top: -96vh;

  @media (max-width: 1280px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AllBarTitle = styled.h2`
  color: #fff;
  font-size: 4rem;
  margin-bottom: 20px;

  @media (max-width: 1280px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AllBarSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 100px;
  justify-content: center;

  @media (max-width: 1280px) {
    gap: 20px;
  }
`;

const BarSection = styled(Link)`
  text-decoration: none;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const BarTitle = styled.div`
  width: 250px;
  font-size: 1rem;
  font-family: "Noto Sans TC", sans-serif;
  padding-top: 10px;
  color: #ffffffb9;
  margin: 20px 0;
`;

const CalendarSection = styled.div``;

const CalendarSubTitle = styled.p`
  color: #d19b18;
  margin: 200px 0 10px 0;
  font-size: 2rem;

  @media (max-width: 1280px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CalendarTitle = styled.h2`
  color: #fff;
  margin-bottom: 150px;
  font-size: 4rem;

  @media (max-width: 1280px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 414px) {
    margin-bottom: 50px;
  }
`;

const CalendarColorSection = styled.div`
  max-width: 678px;
  width: 75%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
`;

const ColorItem = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColorToday = styled.div`
  width: 30px;
  height: 30px;
  background-color: #c48370;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 580px) {
    width: 10px;
    height: 10px;
  }
`;
const ColorEvent = styled.div`
  width: 30px;
  height: 30px;
  background-color: #ff8800a0;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 580px) {
    width: 10px;
    height: 10px;
  }
`;
const ColorSelected = styled.div`
  width: 30px;
  height: 30px;
  background-color: #e6af70b7;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 580px) {
    width: 10px;
    height: 10px;
  }
`;

const ColorName = styled.div`
  color: #fff;
  font-size: 1.5rem;
  padding: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 580px) {
    font-size: 0.5rem;
    padding: 10px;
  }
`;

const MapSubTitle = styled.p`
  font-size: 2rem;
  margin: 200px 0 10px 0;
  color: #d19b18;

  @media (max-width: 1280px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MapTitle = styled.p`
  font-size: 4rem;
  color: #fff;

  @media (max-width: 1280px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AlertWrapper = styled.div`
  width: 100%;
`;

const Background = styled.div`
  max-width: 1100px;
  width: 100%;
  height: 100%;
  background-color: #0000009d;
  position: fixed;
  z-index: 2;
`;

const AlertSection = styled.div`
  width: 700px;
  height: 400px;
  background-color: #d19a18df;
  box-shadow: 5px 5px 5px #ffffff50;
  color: #ffffffe3;
  border-radius: 20px;
  text-align: left;
  padding: 40px;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  animation: ${fadeIn} 1s ease-in-out;

  @media (max-width: 1280px) {
    width: 500px;
    height: 300px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    width: 350px;
    height: 200px;
    padding: 10px;
  }

  @media (max-width: 414px) {
    width: 250px;
    height: 150px;
  }
`;

const AlertMessage = styled.div`
  font-size: 2rem;
  padding: 40px 20px;
  line-height: 60px;

  @media (max-width: 1280px) {
    font-size: 1.5rem;
    padding: 30px 10px;
    line-height: 45px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 20px 10px;
    line-height: 30px;
  }

  @media (max-width: 414px) {
    font-size: 0.8rem;
    padding: 10px;
    line-height: 30px;
  }
`;

const AlertCheck = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;

  @media (max-width: 1280px) {
    margin-top: 15px;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
  }

  @media (max-width: 414px) {
    margin-top: 0px;
  }
`;

const ButtonSection = styled.div``;

const CheckboxWrapper = styled.label`
  display: flex;
  width: 250px;
  text-align: left;
  margin: 30px;

  @media (max-width: 1280px) {
    width: 200px;
  }

  @media (max-width: 768px) {
    width: 150px;
    margin: 20px 10px;
  }

  @media (max-width: 414px) {
    width: 130px;
    margin: 10px;
  }
`;

const CheckboxLabel = styled.span`
  font-size: 30px;
  margin-left: 10px;

  @media (max-width: 1280px) {
    font-size: 20px;
    padding-top: 5px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 414px) {
    font-size: 10px;
    padding-top: 8px;
  }
`;

const StyledEnterButton = styled.button`
  width: 120px;
  height: 50px;
  border: none;
  font-size: 20px;
  border-radius: 8px;
  box-shadow: 3px 3px 8px #605d5d82;
  background-color: #ffffffe3;

  @media (max-width: 1280px) {
    width: 80px;
    height: 40px;
    font-size: 15px;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 25px;
    font-size: 10px;
  }

  @media (max-width: 414px) {
    width: 35px;
    font-size: 10px;
  }

  &:hover {
    background-color: #edb06e;
    transform: translateY(-3px);
    transition: ease 0.5s;
    cursor: pointer;
  }
`;

const EnterButton = styled(Link)`
  text-decoration: none;
  color: #000;

  &:hover {
    color: #000;
  }
`;

const CloseButton = styled.button`
  width: 120px;
  height: 50px;
  font-size: 20px;
  border: none;
  border-radius: 8px;
  margin-left: 20px;
  color: #000;
  box-shadow: 3px 3px 8px #605d5d82;
  background-color: #ffffffe3;

  @media (max-width: 1280px) {
    width: 80px;
    height: 40px;
    font-size: 15px;
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 25px;
    font-size: 10px;
    margin-left: 5px;
  }

  @media (max-width: 414px) {
    width: 35px;
    font-size: 10px;
  }

  &:hover {
    background-color: #edb06e;
    transform: translateY(-3px);
    transition: ease 0.5s;
    cursor: pointer;
  }
`;

interface IMainEvent {
  bar: string;
  content: string;
  time: Timestamp;
  id: string;
}

interface IAlertEvent {
  time: {
    seconds: number;
  };
  bar: string;
  id: string;
}

export interface IMainProps {}

const MainPage: React.FC<IMainProps> = (props: IMainProps) => {
  const [events, setEvents] = useState<IMainEvent[]>([]);
  const [showMore, setShowMore] = useState(false);
  const eventsCollectionRef = collection(db, "events");
  const [showButton, setShowButton] = useState(false);
  const {bars} = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getEvents = async () => {
      const data = await getDocs(eventsCollectionRef);
      setEvents(
        data.docs.map((doc) => ({
          ...(doc.data() as IMainEvent),
          id: doc.id,
        }))
      );
    };

    getEvents();

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (bars.length === 0) {
    return <p>Loading...</p>;
  }

  const slicedData = bars.slice(0, 8);

  const handleShowMore = () => {
    setShowMore(true);
  };

  return (
    <>
      <Wrapper>
        <Alert events={events} />
        <ImageContainer>
          <Slogan>
            YOUR
            <br />
            HAPPINESS
          </Slogan>
          <MainImg src={main} />
        </ImageContainer>
        <ArrowWrapper>
          <WrapperInner>
            <ScrollDown>
              <ArrowDown />
              <ScrollTitle>Scroll down</ScrollTitle>
            </ScrollDown>
          </WrapperInner>
        </ArrowWrapper>
        <Section2 id="section2" />

        <Title>
          <Sign>
            <FlickerItem>We've</FlickerItem>
            <FlickerItem>prepared</FlickerItem>
            <FlickerItem>various</FlickerItem>
          </Sign>
          <SignSecond>
            <FastFlicker>Types of BARS</FastFlicker>
            <FlickerItem>for You!</FlickerItem>
          </SignSecond>
        </Title>
        <Test to={"/question"}>
          <TestSelect>Select Your Type!</TestSelect>
          <Liquid />
        </Test>

        {showButton && <Scroll />}
        <Hashtag />
        <AllBarTitleSection>
          <AllBarSubTitle id="allbars">ALL BARS LIST</AllBarSubTitle>
          <AllBarTitle>
            The adventure <br />
            starts now
          </AllBarTitle>
        </AllBarTitleSection>
        <AllBarSection>
          {slicedData.map((item) => (
            <BarSection to={`/bars/${item.id}`} key={item.id}>
              <BarTitle>
                <BarLink>
                  <LinkSvg
                    viewBox="0 0 200 200"
                    width="100"
                    height="100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-labelledby="link1-title link1-desc"
                  >
                    <defs>
                      <clipPath id="circle-clip">
                        <path d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
                      </clipPath>
                    </defs>
                    <LinkImage
                      xlinkHref={item.img[2]}
                      clipPath="url(#circle-clip)"
                      height="100%"
                      width="100%"
                      preserveAspectRatio="xMidYMid slice"
                    />
                    <path
                      id="link-circle"
                      d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                      stroke="none"
                      fill="none"
                    />
                    <LinkText textLength="480" dy="-8px">
                      <textPath href="#link-circle" stroke="none">
                        {`${item.name.toUpperCase()}   ${item.name.toUpperCase()}`}
                      </textPath>
                    </LinkText>
                  </LinkSvg>
                </BarLink>
              </BarTitle>
            </BarSection>
          ))}

          {showMore && (
            <>
              {bars.slice(8).map((bar) => (
                <BarSection to={`/bars/${bar.id}`} key={bar.id}>
                  <BarTitle>
                    <BarLink>
                      <LinkSvg
                        viewBox="0 0 200 200"
                        width="100"
                        height="100"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-labelledby="link1-title link1-desc"
                      >
                        <defs>
                          <clipPath id="circle-clip">
                            <path d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
                          </clipPath>
                        </defs>
                        <LinkImage
                          xlinkHref={bar.img[2]}
                          clipPath="url(#circle-clip)"
                          height="100%"
                          width="100%"
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <path
                          id="link-circle"
                          d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                          stroke="none"
                          fill="none"
                        />
                        <LinkText textLength="480" dy="-8px">
                          <textPath href="#link-circle" stroke="none">
                            {bar.name.toUpperCase()} {bar.name.toUpperCase()}
                          </textPath>
                        </LinkText>
                      </LinkSvg>
                    </BarLink>
                  </BarTitle>
                </BarSection>
              ))}
            </>
          )}
        </AllBarSection>
        {!showMore && <More onClick={handleShowMore}>More</More>}
        <CalendarSection>
          <CalendarSubTitle>BAR EVENTS</CalendarSubTitle>
          <CalendarTitle>It's time to join the Bar Event!</CalendarTitle>
          <CalendarColorSection>
            <ColorItem>
              <ColorToday />
              <ColorName>Today</ColorName>
            </ColorItem>
            <ColorItem>
              <ColorEvent />
              <ColorName>Event</ColorName>
            </ColorItem>
            <ColorItem>
              <ColorSelected />
              <ColorName>Selected</ColorName>
            </ColorItem>
          </CalendarColorSection>
          <Calendar />
        </CalendarSection>
        <MapSubTitle>LOCATION</MapSubTitle>
        <MapTitle>Where is the Bar?</MapTitle>
        <MainMap />
      </Wrapper>
    </>
  );
};

const Alert = ({events}: {events: IAlertEvent[]}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const shouldShowAlert = () => {
    const cookies = document.cookie.split("; ");
    const hideAlertCookie = cookies.find((cookie) =>
      cookie.startsWith("hideAlert=")
    );
    return !hideAlertCookie || hideAlertCookie.split("=")[1] !== "true";
  };

  const isToday = new Date().toDateString();

  const hasEvent = events.map((event) => {
    const eventDate = new Date(event.time.seconds * 1000);
    return eventDate.toDateString() === isToday;
  });

  useEffect(() => {
    if (!hasEvent.includes(true)) {
      setShowAlert(false);
    }
  }, [hasEvent]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
  };

  const handleCloseClick = () => {
    setShowAlert(false);
    document.cookie = `hideAlert=true; expires=${new Date(
      Date.now() + 86400000
    ).toUTCString()};`;
  };

  if (!shouldShowAlert() || events.length === 0) {
    return null;
  }

  return (
    <>
      {showAlert && (
        <AlertWrapper>
          {events.map((event, index) => {
            return hasEvent[index] ? (
              <AlertSection key={index}>
                <AlertMessage>
                  今日 <SpecialBar>{event.bar}</SpecialBar> 有特別活動！
                  <br />
                  邀請您來共襄盛舉～
                </AlertMessage>
                <AlertCheck>
                  <CheckboxWrapper>
                    <IconLink
                      rel="stylesheet"
                      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                    />
                    <EventCenter>
                      <EventLabel>
                        <EventCheckbox
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleOnChange}
                        />
                        <LabelText>
                          <LabelCheck>
                            <Icons className="fa fa-check"></Icons>
                          </LabelCheck>
                        </LabelText>
                      </EventLabel>
                    </EventCenter>
                    <CheckboxLabel>今日不再顯示</CheckboxLabel>
                  </CheckboxWrapper>
                  <ButtonSection>
                    <StyledEnterButton>
                      <EnterButton to={`/events/${event.id}`} key={event.id}>
                        Enter
                      </EnterButton>
                    </StyledEnterButton>
                    <CloseButton onClick={handleCloseClick}>Close</CloseButton>
                  </ButtonSection>
                </AlertCheck>
              </AlertSection>
            ) : null;
          })}
          <Background />
        </AlertWrapper>
      )}
    </>
  );
};

export default MainPage;
