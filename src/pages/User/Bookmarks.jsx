import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosConfig from "../../utils/axiosConfig";
import useResponsive from "../../hooks/useResponsive";
import styled from "styled-components";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();
  console.log(username);

  // 유저의 북마크 정보 가져오기
  useEffect(() => {
    getBookmarks();
  }, []);

  const getBookmarks = async () => {
    try {
      const response = await axiosConfig.get(`/bookmarks/${username}`);
      if (response.status === 400) {
        alert("북마크한 문제가 없습니다. 메인 화면으로 이동합니다.");
        navigate(`/`);
      }

      if (response.status === 200) {
        console.log(response.data);
        setBookmarks(response.data);
      }
    } catch (err) {
      console.log(err);
      alert(`서버 오류입니다. 관리자에게 문의해주세요.`);
      navigate(`/`);
    }
  };

  // json 파일에서 실제 문제 데이터 가져오기

  // 반응형
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <>
      {isDesktop && (
        <DesktopContainer>
          <DesktopBookmark>
            <h2>북마크한 문제</h2>
            {bookmarks.map((el, index) => {
              return <DesktopButton key={index}>{el.subjectId}</DesktopButton>;
            })}
          </DesktopBookmark>
          <DesktopDescriptions>뭄ㄴ제덜</DesktopDescriptions>
        </DesktopContainer>
      )}
    </>
  );
};

const DesktopContainer = styled.div`
  margin: 5rem 0;
  display: grid;
  grid-template-columns: 3fr 7fr;
  gap: 1rem;
`;

const DesktopBookmark = styled.div`
  margin: 0 3rem;
  border-right: 1px solid gray;
`;

const DesktopButton = styled.button`
  margin-top: 1rem;
`;

const DesktopDescriptions = styled.div``;

export default Bookmarks;
