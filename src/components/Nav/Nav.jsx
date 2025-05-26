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

  const getAccessToken = () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
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
          response.headers.get("Set-Cookie");

          setIsToken(true);
        }
      }

      if (response.status === 401) {
        setIsToken(false);
        // alert("사용자 정보가 만료되었습니다. 다시 로그인 해주세요.");
        // navigate("/");
      }
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생", error);
      setIsToken(false);
      // navigate("/");
    }
  };

  // 로그인 유지를 위한 토큰 검증
  useEffect(() => {
    const token = getAccessToken();
    const storedUsername = sessionStorage.getItem("username");

    if (token) {
      setIsToken(true);
    } else if (!token && !nick) {
      handleUpdateToken();
    }

    if (storedUsername) {
      setUsername(storedUsername);
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

  return (
    <NavBody>
      <NavLogo
        src="/images/NCBT_logo.png"
        alt="logo"
        onClick={() => navigate("/")}
      />
      <ControllerBox>
        {windowWidth >= 768 && (
          <>
            <SubjectTitle>
              <NavTitle
                isActive={subjectName === "NCA"}
                onClick={() => navigate("/NCA/practice")}
              >
                NCA
              </NavTitle>
              <NavTitle
                isActive={subjectName === "NCP200"}
                onClick={() => navigate("/NCP200/practice")}
              >
                NCP200
              </NavTitle>
              <NavTitle
                isActive={subjectName === "NCP202"}
                onClick={() => navigate("/NCP202/practice")}
              >
                NCP202
              </NavTitle>
              <NavTitle
                isActive={subjectName === "NCP207"}
                onClick={() => navigate("/NCP207/practice")}
              >
                NCP207
              </NavTitle>
              <NavTitle
                isActive={exam === "exam"}
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
                <ProfileIcon
                  ref={profileIconRef}
                  className="bi bi-person-circle"
                  onClick={openProfile}
                ></ProfileIcon>
                <Username onClick={openProfile} ref={profileTextRef}>
                  <b>{username}</b>
                </Username>
                {isProfileOpen && (
                  <ProfileMenu ref={profileMenuRef}>
                    <UserProfile onClick={() => navigate(`/bookmarks`)}>
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
            {!isToken ? (
              <>
                <ListIcon className="bi bi-list" onClick={openList} />
                {isListOpen && (
                  <MobileList>
                    <MobileLogin onClick={() => openModal("login")}>
                      Login
                    </MobileLogin>
                    {/* <MobileRegister onClick={() => openModal("register")}>
                      회원가입
                    </MobileRegister> */}
                  </MobileList>
                )}
              </>
            ) : (
              <>
                <ProfileIcon
                  ref={profileIconRef}
                  className="bi bi-person-circle"
                  onClick={openProfile}
                />
                <Username onClick={openProfile} ref={profileTextRef}>
                  <b>{username}</b>
                </Username>
                {isProfileOpen && (
                  <MobileList ref={profileMenuRef}>
                    <UserProfile onClick={() => navigate(`/bookmarks`)}>
                      북마크
                    </UserProfile>
                    <MobileLogout onClick={logout}>로그아웃</MobileLogout>
                  </MobileList>
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
  top: 4.1rem;
  right: 1rem;
  background-color: ${props => props.theme.mainColor};
  padding: 1rem;
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
  color: ${props => props.theme.white};

  &:hover {
    text-decoration: underline;
  }
`;

const MobileList = styled.div`
  position: absolute;
  top: 4.1rem;
  right: 0.4rem;
  background-color: ${props => props.theme.mainColor};
  padding: 1rem;
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
  color: ${props => props.theme.white};

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
  color: ${props => props.theme.white};
  cursor: pointer;

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;

// ver2

const NavTitle = styled.div`
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#02C95F" : "#333333")};
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};

  &:hover {
    text-decoration: underline red wavy 2px;
  }
`;
