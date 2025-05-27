import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AuthModal from "../Modal/AuthModal";
import { useNavigate, useParams } from "react-router-dom";

const Nav = ({ nick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isToken, setIsToken] = useState(false);
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || "",
  );

  const navigate = useNavigate();

  const { name: subjectName, exam } = useParams();

  // base64 디코딩 후 UTF-8로 복원하는 함수
  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(str),
          c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
        )
        .join(""),
    );
  }

  const getAccessToken = () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return null;

    try {
      // atob → UTF-8 복원
      const payloadStr = b64DecodeUnicode(token.split(".")[1]);
      const payload = JSON.parse(payloadStr);
      const exp = payload.exp * 1000;
      sessionStorage.setItem("username", payload.sub);
      const currentTime = new Date().getTime();

      if (currentTime > exp) {
        sessionStorage.removeItem("accessToken");
        return null;
      }

      return token;
    } catch (error) {
      console.error("토큰 검증 중 오류:", error);
      sessionStorage.removeItem("accessToken");
      return null;
    }
  };

  const handleUpdateToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/refreshToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        const newAccessToken = response.headers.get("Authorization");
        if (newAccessToken) {
          const accessToken = newAccessToken.split(" ")[1];
          sessionStorage.setItem("accessToken", accessToken);
          setIsToken(true);
          return true; // 성공 반환
        } else {
          // Authorization 헤더가 없는 경우
          console.log("Authorization 헤더가 응답에 없습니다.");
          setIsToken(false);
          return false;
        }
      }

      if (response.status === 401) {
        setIsToken(false);
        return false;
      }
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생", error);
      setIsToken(false);
      return false;
    }
  };

  const getCookie = name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // 로그인 유지를 위한 토큰 검증
  useEffect(() => {
    const token = getAccessToken();
    const refreshToken = getCookie("refreshToken");

    if (token) {
      setIsToken(true);
    } else if (refreshToken) {
      handleUpdateToken();
    } else {
      setIsToken(false);
    }
  }, []);

  const openModal = type => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const openList = () => {
    setIsListOpen(prev => !prev);
  };

  const openProfile = () => {
    setIsProfileOpen(prev => !prev);
  };

  const logout = () => {
    setIsToken(false);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username", username);
    deleteCookie();
    navigate("/");
  };

  const deleteCookie = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/form/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        sessionStorage.removeItem("accessToken");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 720) {
        setIsListOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ProfileMenu 외부 클릭 시 닫기
  const profileMenuRef = useRef(null);
  const profileIconRef = useRef(null);
  const profileTextRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !profileIconRef.current.contains(event.target) &&
        !profileTextRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 모바일 내비게이션
  const handleNavigate = subject => {
    setIsListOpen(false);
    navigate(`/${subject}/practice`);
    window.location.reload();
  };

  const handleOpenModal = () => {
    setIsListOpen(false);
    openModal("login");
  };

  const handleExam = subject => {
    setIsListOpen(false);
    navigate(`/${subject}/exam`);
  };

  const handleBookmark = () => {
    setIsProfileOpen(false);
    navigate(`/bookmarks`);
  };

  // MobileList 외부 클릭 시 닫기
  const listRef = useRef(null); // MobileList 참조용
  const logoRef = useRef(null); // NavLogo도 제외 대상

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isListOpen &&
        listRef.current &&
        !listRef.current.contains(event.target) &&
        !logoRef.current?.contains(event.target)
      ) {
        setIsListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isListOpen]);

  const handleNavigatePractice = name => {
    navigate(`/${name}/practice`);
    window.location.reload();
  };

  return (
    <NavBody>
      <ControllerBox>
        {windowWidth >= 768 && (
          <>
            <NavLogo
              src="/images/NCBT_logo.png"
              alt="logo"
              onClick={() => navigate("/")}
            />
            <SubjectTitle>
              <NavTitle
                $isActive={subjectName === "NCA"}
                onClick={() => handleNavigatePractice("NCA")}
              >
                NCA
              </NavTitle>
              <NavTitle
                $isActive={subjectName === "NCP200"}
                onClick={() => handleNavigatePractice("NCP200")}
              >
                NCP200
              </NavTitle>
              <NavTitle
                $isActive={subjectName === "NCP202"}
                onClick={() => handleNavigatePractice("NCP202")}
              >
                NCP202
              </NavTitle>
              <NavTitle
                $isActive={subjectName === "NCP207"}
                onClick={() => handleNavigatePractice("NCP207")}
              >
                NCP207
              </NavTitle>
              <NavTitle
                $isActive={exam === "exam"}
                onClick={() => navigate(`/${subjectName}/exam`)}
              >
                실전 모의고사
              </NavTitle>
            </SubjectTitle>
            {!isToken ? (
              <>
                <Login onClick={() => openModal("login")}>Log In</Login>
                {/* <Register onClick={() => openModal("register")}>
                  회원가입
                </Register> */}
              </>
            ) : (
              <>
                <Login ref={profileIconRef} onClick={openProfile}>
                  <Username onClick={openProfile} ref={profileTextRef}>
                    <b onClick={openProfile}>{username}</b>
                  </Username>
                </Login>
                {isProfileOpen && (
                  <ProfileMenu ref={profileMenuRef}>
                    <UserProfile onClick={() => handleBookmark()}>
                      북마크
                    </UserProfile>
                    <LogoutButton onClick={logout}>로그아웃</LogoutButton>
                  </ProfileMenu>
                )}
              </>
            )}
          </>
        )}
        {windowWidth < 768 && (
          <>
            <>
              <NavLogo
                ref={logoRef}
                src="/images/NCBT_logo.png"
                alt="logo"
                onClick={openList}
              />
              {isListOpen && (
                <MobileList ref={listRef}>
                  {!isToken && (
                    <MobileLogin onClick={() => openModal("login")}>
                      로그인
                    </MobileLogin>
                  )}
                  <MobileLogin onClick={() => handleNavigate("NCA")}>
                    NCA
                  </MobileLogin>
                  <MobileLogin onClick={() => handleNavigate("NCP200")}>
                    NCP200
                  </MobileLogin>
                  <MobileLogin onClick={() => handleNavigate("NCP202")}>
                    NCP202
                  </MobileLogin>
                  <MobileLogin onClick={() => handleNavigate("NCP207")}>
                    NCP207
                  </MobileLogin>
                  <MobileLogin onClick={() => handleExam(subjectName)}>
                    실전 모의고사
                  </MobileLogin>
                  {/* <MobileRegister onClick={() => openModal("register")}>
                      회원가입
                    </MobileRegister> */}
                </MobileList>
              )}
            </>
            {!isToken ? (
              <>
                <MobileDiv>{subjectName}</MobileDiv>
              </>
            ) : (
              <>
                <MobileDiv>{subjectName}</MobileDiv>
                <MobileLogin ref={profileIconRef} onClick={openProfile}>
                  <Username onClick={openProfile} ref={profileTextRef}>
                    <b onClick={openProfile}>{username}</b>
                  </Username>
                </MobileLogin>
                {isProfileOpen && (
                  <MobileUserList ref={profileMenuRef}>
                    <UserProfile onClick={() => handleBookmark()}>
                      북마크
                    </UserProfile>
                    <UserProfile onClick={logout}>로그아웃</UserProfile>
                  </MobileUserList>
                )}
              </>
            )}
          </>
        )}
      </ControllerBox>
      {isModalOpen && (
        <AuthModal
          type={modalType}
          closeModal={closeModal}
          openModal={openModal}
        />
      )}
    </NavBody>
  );
};

export default Nav;

const NavBody = styled.div`
  width: 100%;
  height: 4rem;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const NavLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.9;
  cursor: pointer;
`;

const SubjectTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333333;
  width: 80%;
  margin: 0 10rem;

  @media (max-width: 720px) {
    padding-left: 0;
  }
`;

const ControllerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: -webkit-fill-available;
  color: #333333;
  gap: 1rem;
`;

const Username = styled.span`
  cursor: pointer;

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

const Login = styled.button`
  cursor: pointer;
  color: #333333;
  background-color: white;
  border: 1px solid #333333;

  font-size: 1rem;

  &:hover {
    color: #333333;
    font-weight: bold;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const Register = styled.span`
  cursor: pointer;
  font-weight: 700;

  &:hover {
    text-decoration: underline red wavy 2px;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const ProfileIcon = styled.i`
  font-size: 1.8rem;
  color: ${props => props.theme.white};
  cursor: pointer;
  z-index: 99;
`;

const ListIcon = styled.i`
  font-size: 1.8rem;
  color: ${props => props.theme.white};
  display: none;

  @media (max-width: 720px) {
    display: block;
  }

  &:hover {
    color: ${props => props.theme.hoverColor};
  }
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 4.3rem;
  right: 2.3rem;
  background-color: white;
  padding: 1rem;
  border: 1px solid #333333;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  z-index: 99;
`;

const LogoutButton = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: #333333;

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

const MobileList = styled.div`
  position: absolute;
  top: 4.3rem;
  background-color: white;
  padding: 1rem;
  border: 1px solid #333333;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 1rem;
  z-index: 9999;
`;

const MobileLogin = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: #333333;

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

const MobileRegister = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: ${props => props.theme.white};

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

const MobileLogout = styled.span`
  font-weight: 700;
  cursor: pointer;
  color: ${props => props.theme.white};

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

const UserProfile = styled.div`
  font-weight: 700;
  color: #333333;
  cursor: pointer;

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

// ver2

const NavTitle = styled.div`
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? "#02C95F" : "#333333")};
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

const MobileDiv = styled.div``;

const MobileUserList = styled.div`
  position: absolute;
  top: 4.3rem;
  right: 1rem;
  background-color: white;
  padding: 1rem;
  border: 1px solid #333333;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 1rem;
  z-index: 9999;
`;
