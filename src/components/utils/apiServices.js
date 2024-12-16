import Cookies from "js-cookie";
const API_BASE_URL = "http://localhost:8080";
// const API_BASE_URL = "http://54.217.130.114:8080";

export const ApiServices = {
  getUrl: () => {
    return API_BASE_URL;
  },

  isAdmin: () => {
    return Cookies.get("token") && Cookies.get("role") === "ADMIN";
  },

  isAuthenticated: () => {
    return Cookies.get("token") !== null;
  },

  handleLogin: async (credentials) => {
    const url = `${API_BASE_URL}/competitor/auth/login`;
    const response = { ok: false, msg: "" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.token = data.token;
        response.role = data.role;
      } else {
        response.ok = false;
        response.msg = credentials.isAdmin
          ? "Credenciais inválidas"
          : data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleLogin:", error);
    }

    return response;
  },

  handleGetCompetitorInfo: async () => {
    const url = `${API_BASE_URL}/competitor/info`;
    const response = { ok: false, msg: "" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ token: Cookies.get("token") }),
      });

      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.user = { name: data.name, score: data.score };
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleGetCompetitorInfo:", error);
    }

    return response;
  },

  handleRegister: async (credentials) => {
    const url = `${API_BASE_URL}/competitor/auth/register`;
    const response = { ok: false, msg: "" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        response.ok = true;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleRegister:", error);
    }

    return response;
  },

  handleTestCode: async (requestBody) => {
    const url = `${API_BASE_URL}/code/test`;
    const response = { ok: false, msg: "" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.resObj = data;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleTestCode:", error);
    }

    return response;
  },

  handleSubmitCode: async (requestBody) => {
    const url = `${API_BASE_URL}/code/process`;
    requestBody.currentProblemId = Cookies.get("currentProblemId");
    const response = { ok: false, msg: "" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.resObj = data;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleSubmitCode:", error);
    }

    return response;
  },

  handleRegisterProblem: async (problem) => {
    const url = `${API_BASE_URL}/problems/register`;
    const response = { ok: false, msg: "" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(problem),
      });

      if (res.ok) {
        response.ok = true;
      } else {
        const data = await res.json();
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleRegisterProblem:", error);
    }

    return response;
  },
  handleGetProblemList: async () => {
    const url = `${API_BASE_URL}/problems`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.problemList = data;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleGetProblemList:", error);
    }
  
    return response;
  },
  
  handleUpdateProblemVisibility: async (problemId) => {
    const url = `${API_BASE_URL}/problems/update/${problemId}`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleUpdateProblemVisibility:", error);
    }
  
    return response;
  },
  
  handleGetTimeLeft: async (problemId) => {
    const url = `${API_BASE_URL}/problems/${problemId}/time-left`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.timeLeftInSeconds = data.body.timeLeftInSeconds;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleGetTimeLeft:", error);
    }
  
    return response;
  },
  
  handleGetNextProblem: async () => {
    const url = `${API_BASE_URL}/problems/next`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.problem = data;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleGetNextProblem:", error);
    }
  
    return response;
  },
  
  handleGetCurrentProblem: async () => {
    const url = `${API_BASE_URL}/problems/${Cookies.get("currentProblemId")}`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.problem = data;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleGetCurrentProblem:", error);
    }
  
    return response;
  },
  
  handleCheckIfFirstProblemIsVisible: async () => {
    const url = `${API_BASE_URL}/problems/next`;
    const response = { ok: false };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      response.ok = res.ok;
    } catch (error) {
      response.ok = false;
      console.error("Error in handleCheckIfFirstProblemIsVisible:", error);
    }
  
    return response;
  },
  
  handleCheckIfNextProblemIsReady: async () => {
    const url = `${API_BASE_URL}/problems/verify/${Cookies.get("currentProblem")}`;
    const response = { ok: false };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      response.ok = res.ok;
    } catch (error) {
      response.ok = false;
      console.error("Error in handleCheckIfNextProblemIsReady:", error);
    }
  
    return response;
  },
  
  handleFinishChalange: async () => {
    const url = `${API_BASE_URL}/problems/finish`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      if (res.ok) {
        response.ok = true;
      } else {
        const data = await res.json();
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleFinishChalange:", error);
    }
  
    return response;
  },
  
  handleCheckIfChalangeIsFinished: async () => {
    const url = `${API_BASE_URL}/problems/finished`;
    const response = { ok: false, msg: "", finished: false };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.finished = data.finished;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleCheckIfChalangeIsFinished:", error);
    }
  
    return response;
  },
  
  handleGetChallengeResults: async () => {
    const url = `${API_BASE_URL}/competitor/results`;
    const response = { ok: false, msg: "" };
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        response.ok = true;
        response.competitorList = data;
      } else {
        response.ok = false;
        response.msg = data.message;
      }
    } catch (error) {
      response.ok = false;
      response.msg = "Erro ao conectar com o servidor.";
      console.error("Error in handleGetChallengeResults:", error);
    }
  
    return response;
  }
};

