import styled from "styled-components";
import useResponsive from "../../hooks/useResponsive";
import { useEffect, useState } from "react";
import axios from "axios";

const RankTool = ({ subjectProp }) => {
  const [rankingData, setRankingData] = useState([]);
  const subjectName = subjectProp;

  useEffect(() => {
    if (rankingData.length === 0) {
      getRankingData();
    }
  }, [subjectName]);

  const getRankingData = async () => {
    const response = await axios
      .post(`${process.env.REACT_APP_BASE_URL}/ranking/v2`, {
        title: subjectName,
      })
      .catch(err => {
        console.log(err);
      });

    setRankingData(response.data);
  };

  // 반응형
  const { isTablet, isDesktop } = useResponsive();

  const emoji = "( ͡~ ͜ʖ ͡°)";

  return (
    <>
      {(isDesktop || isTablet) && (
        <TooltipWrapper>
          <TooltipController>
            {emoji}
            <TooltipBox className="tooltip">
              {rankingData.map((item, index) => {
                const rankEmojis = ["👑", "🥈", "🥉"];
                const emoji = rankEmojis[index] || "🏅";

                return (
                  <Tooltip key={item.name}>
                    {emoji} {index + 1}등 {item.nickname} ({item.score}점)
                  </Tooltip>
                );
              })}
            </TooltipBox>
          </TooltipController>
        </TooltipWrapper>
      )}
    </>
  );
};

const TooltipWrapper = styled.div`
  position: absolute;
  top: 20%;
  right: 10%;
`;

const TooltipController = styled.div`
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  display: inline-block;
  animation: moveBox 2s infinite alternate;
  position: relative; /* TooltipBox 위치 기준 */

  &:hover .tooltip {
    display: flex;
    flex-direction: column;
  }

  @keyframes moveBox {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(20%);
    }
  }
`;

const TooltipBox = styled.div`
  display: none;
  position: absolute;
  top: 100%; /* 아래로 위치 */
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  background-color: #eeeeee;
  color: #333333;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 100;
`;

const Tooltip = styled.div`
  margin: 1rem 0;
`;

export default RankTool;
