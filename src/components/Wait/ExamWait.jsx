import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useResponsive from "../../hooks/useResponsive";
import { useNavigate, useParams } from "react-router-dom";

const ExamWait = ({ onStart }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const { name: subjectName } = useParams();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  // 반응형
  const { windowWidth, isMobile, isTablet, isDesktop, getDeviceType } =
    useResponsive();

  const handleNavigate = subject => {
    closeModal();
    navigate(`/${subject}/exam`);
  };

  const closeModal = () => {
    setModal(false);
  };

  // 모달 외부 클릭 시 닫히는 기능
  const modalRef = useRef();
  const handleClickOutside = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isMobile && (
        <MobileContainer>
          <h3>{subjectName} 모의고사 시작 전 안내사항 🔥</h3>
          <MainContent>
            <h5>1. 시험 시간은 총 60분이며, 객관식 60문제가 주어집니다.</h5>
            <h5>
              2. 전체 문제 중 60% 이상 정답을 맞추면 합격입니다. (36문제 이상)
            </h5>
            <h5>3. 로그인한 사용자만 점수가 저장되어 랭킹에 반영됩니다.</h5>
            <h5>
              4. 시험이 끝나지 않은 상태에서 종료하면 진행사항이 저장되지
              않습니다.
            </h5>
          </MainContent>
          <label>
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={e => setIsAgreed(e.target.checked)}
              style={{
                width: "1.3rem",
                height: "1.3rem",
              }}
            />
            <span> 위 안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
          </label>
          <ButtonBox>
            <Button onClick={() => setModal(true)}>과목 변경</Button>
            <StyledButton onClick={onStart} disabled={!isAgreed}>
              시험 시작
            </StyledButton>
          </ButtonBox>
        </MobileContainer>
      )}
      {isTablet && (
        <MainContainer>
          <h1> {subjectName} 모의고사 시작 전 안내사항 🔥</h1>
          <MainContent>
            <h3>1. 시험 시간은 총 60분이며, 객관식 60문제가 주어집니다.</h3>
            <h3>
              2. 전체 문제 중 60% 이상 정답을 맞추면 합격입니다. (36문제 이상)
            </h3>
            <h3>3. 로그인한 사용자만 점수가 저장되어 랭킹에 반영됩니다.</h3>
            <h3>
              4. 시험이 끝나지 않은 상태에서 종료하면 진행사항이 저장되지 않으니
              주의 바랍니다.
            </h3>
          </MainContent>
          <label>
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={e => setIsAgreed(e.target.checked)}
              style={{
                width: "1.3rem",
                height: "1.3rem",
              }}
            />
            <span> 위 안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
          </label>
          <ButtonBox>
            <Button onClick={() => setModal(true)}>과목 변경</Button>
            <StyledButton onClick={onStart} disabled={!isAgreed}>
              시험 시작
            </StyledButton>
          </ButtonBox>
        </MainContainer>
      )}
      {isDesktop && (
        <MainContainer>
          <h1> {subjectName} 모의고사 시작 전 안내사항 🔥 </h1>
          <MainContent>
            <h3>1. 시험 시간은 총 60분이며, 객관식 60문제가 주어집니다.</h3>
            <h3>
              2. 전체 문제 중 60% 이상 정답을 맞추면 합격입니다. (36문제 이상)
            </h3>
            <h3>3. 로그인한 사용자만 점수가 저장되어 랭킹에 반영됩니다.</h3>
            <h3>
              4. 시험이 끝나지 않은 상태에서 종료하면 진행사항이 저장되지 않으니
              주의 바랍니다.
            </h3>
          </MainContent>
          <label>
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={e => setIsAgreed(e.target.checked)}
              style={{
                width: "1.3rem",
                height: "1.3rem",
              }}
            />
            <span> 위 안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
          </label>
          <ButtonBox>
            <Button onClick={() => setModal(true)}>과목 변경</Button>
            <StyledButton onClick={onStart} disabled={!isAgreed}>
              시험 시작
            </StyledButton>
          </ButtonBox>
        </MainContainer>
      )}
      {modal && (
        <ModalBackground>
          <ModalContainer ref={modalRef}>
            <ModalButtonBox>
              <h3>과목 변경</h3>
              <ModalButton onClick={() => handleNavigate("NCA")}>
                NCA
              </ModalButton>
              <ModalButton onClick={() => handleNavigate("NCP200")}>
                NCP200
              </ModalButton>
              <ModalButton onClick={() => handleNavigate("NCP202")}>
                NCP202
              </ModalButton>
              <ModalButton onClick={() => handleNavigate("NCP207")}>
                NCP207
              </ModalButton>
              <ModalButton onClick={() => closeModal()}>취소</ModalButton>
            </ModalButtonBox>
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  );
};

const MobileContainer = styled.div`
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 40rem;

  h3 {
    margin: 2rem 0;
  }

  h5 {
    color: #808080;
  }

  label {
    margin-top: 2rem;
    font-size: 1rem;
    color: #3b82f6;
  }
`;

const MainContainer = styled.div`
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin: 2rem 0;
  }

  label {
    margin-top: 2rem;
    font-size: 1.1rem;
    color: #3b82f6;
  }
`;

const StyledButton = styled.button`
  width: 10rem;
  font-size: 1rem;
  margin: 3rem 1rem;
  transition: all 0.2s ease-in-out;

  background-color: ${props => (props.disabled ? "#D1D5DB" : "#02c95f")};
  color: white;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    background-color: #02c95f;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0.5rem 0;
    color: gray;
  }
`;

// ver2

const ButtonBox = styled.div`
  display: flex;
`;

const ModalButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  width: 10rem;
  font-size: 1rem;
  margin: 3rem 1rem;
`;

const ModalButton = styled.button`
  margin: 1rem;
  border: 1px solid #333333;
  background-color: white;
  color: #333333;

  &:hover {
    color: #333333;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 25rem;
  height: 32rem;
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: white;
  position: absolute;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  position: relative;
  text-align: center;

  .closeAuthModalButton {
    position: absolute;
    top: 3%;
    right: 5%;
    background: none;
    border: none;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    color: black;

    &:hover {
      color: ${props => props.theme.subColor};
      box-shadow: none;
    }
  }
`;

export default ExamWait;
