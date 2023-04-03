import {match} from "assert";
import React, {useState} from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

export interface IRecommendationProps {}

const RecommendationPage: React.FC<IRecommendationProps> = (
  props: IRecommendationProps
) => {
  return (
    <Wrapper>
      <div>Recommendation</div>
    </Wrapper>
  );
};

export default RecommendationPage;
