import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosConfig from "../../utils/axiosConfig";
import useResponsive from "../../hooks/useResponsive";
import styled from "styled-components";

const Bookmarks = () => {
  const subjects = ["NCA", "NCP200", "NCP202", "NCP207"];
  const [selectedSubject, setSelectedSubject] = useState("NCA");
  const [bookmarkList, setBookmarkList] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();

  // 서버에서 유저의 북마크 정보 가져오기
  useEffect(() => {
    getBookmarks();
  }, [selectedSubject]);

  console.log(selectedSubject);

  const getBookmarks = async () => {
    try {
      const response = await axiosConfig.get(`/bookmarks/${selectedSubject}`);
      if (response.status === 204) {
        alert("북마크한 문제가 없습니다");
        return;
      }

      if (response.status === 200 && response.data) {
        setBookmarkList(response.data);
        loadQuestionData(response.data);
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data || "서버 오류입니다. 관리자에게 문의해주세요.";
      alert(errorMessage);
    }
  };

  // JSON 파일에서 문제 데이터 가져오기
  const loadQuestionData = async bookmarks => {
    const subjectIndex = subjects.indexOf(selectedSubject);
    if (subjectIndex === -1) return;

    try {
      const response = await fetch(`/data/${selectedSubject}.json`);
      const module = await response.json();

      const filteredQuestions = module.filter(question =>
        bookmarks.some(bookmark => bookmark.questionId === question.id),
      );

      setQuestionData(filteredQuestions);
    } catch (err) {
      console.error("JSON 파일 로드 실패:", err);
    }
  };

  const handleSubjectClick = subject => {
    setSelectedSubject(subject);
  };

  // 반응형
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <>
      {isDesktop && (
        <DesktopContainer>
          <DesktopBookmark>
            <h2 className="bookmark-title-list">북마크한 문제</h2>
            {subjects.map(el => (
              <button
                className="subject-btn"
                key={el}
                onClick={() => handleSubjectClick(el)}
              >
                {el}
              </button>
            ))}
          </DesktopBookmark>
          <DesktopDescriptions>
            {questionData.map((el, idx) => (
              <DesktopQuestions key={el.id}>
                <h3>
                  {idx + 1}. {el.question}
                </h3>
                <ul className="exmale-box">
                  {el.example.map((example, idx) => (
                    <li key={example.num}>
                      {idx + 1}.&nbsp;{example.text}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>정답:</strong> {el.answer}
                </p>
                <p>
                  <strong>설명:</strong> {el.explanation}
                </p>
              </DesktopQuestions>
            ))}
          </DesktopDescriptions>
        </DesktopContainer>
      )}
    </>
  );
};

const DesktopContainer = styled.div`
  margin: 5rem 0;
  display: grid;
  grid-template-columns: 3fr 7fr;
  padding: 2rem;
  gap: 1rem;
`;

const DesktopBookmark = styled.div`
  margin: 0 3rem;
  border-right: 1px solid gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .bookmark-title-list {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }

  .subject-btn {
    width: 12rem;
    height: 4rem;
  }
`;

const DesktopQuestions = styled.div`
  box-shadow: 1px 1px 1px 2px lightgray;
  border-radius: 15px;
  padding: 1rem;
  width: 80%;
  min-height: 20rem;
  margin-bottom: 1.6rem;

  h3 {
    margin-bottom: 1rem;
  }

  ul {
    margin-bottom: 4rem;
    list-style-type: disc;
    padding-left: 2rem;
  }
`;

const DesktopDescriptions = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Bookmarks;
