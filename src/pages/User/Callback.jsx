import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  // 소셜 로그인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code !== null && state !== null) {
      handleNaverLogin(code, state);
    }
    if (code !== null && state === null) {
      handleGithubLogin(code);
    }
  }, []);

  const handleNaverLogin = async (code, state) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/login/naver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, state }),
      },
    );

    if (response.status === 200) {
      // accessToken을 세션 스토리지에 저장 (추후 변경 가능성 있음)
      const data = await response.headers.get("Authorization");
      const accessToken = data.split(" ")[1];
      sessionStorage.setItem("accessToken", accessToken);

      // 쿠키도 추가해야해 !!!!!
      response.headers.get("Set-Cookie");
      navigate("/");
      window.location.reload();
    } else {
      console.error("Failed to fetch token");
    }
  };

  // 깃허브 로그인 핸들러
  const handleGithubLogin = async code => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/login/github`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      },
    );

    if (response.status === 200) {
      // accessToken을 세션 스토리지에 저장 (추후 변경 가능성 있음)
      const data = await response.headers.get("Authorization");
      const accessToken = data.split(" ")[1];
      sessionStorage.setItem("accessToken", accessToken);
      // 쿠키도 추가해야해 !!!!!
      response.headers.get("Set-Cookie");

      navigate("/");
      window.location.reload();
    } else {
      console.error("Failed to fetch token");
    }
  };

  //   useEffect(() => {
  //     async function loginProcess() {
  //       try {
  //         // 여기서 로그인 API 호출 등 처리
  //         // 예: await fetch( ... )

  //         // 로그인 성공 후 이전 페이지로 뒤로 가기
  //         navigate(-1);  // 브라우저 히스토리 스택에서 한 단계 뒤로
  //       } catch (error) {
  //         console.error(error);
  //         // 실패 시 홈으로 이동 등 처리
  //         navigate("/", { replace: true });
  //       }
  //     }

  //     loginProcess();
  //   }, []);

  //   return <div>로그인 처리 중입니다...</div>;
};

export default Callback;
