import Cookies from "js-cookie";
const API_BASE_URL = "http://localhost:8080";
//const API_BASE_URL = "http://10.42.0.115:8080";
const response = { ok: false, msg: "" };

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
  handleLogin: async (creadentials) => {
    const url = `${API_BASE_URL}/competitor/auth/login`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(creadentials),
    });
    const data = await res.json();
    if (res.ok) {
      response.ok = true;
      response.token = data.token;
      response.role = data.role;
    } else {
      response.ok = false;
      response.msg = creadentials.isAdmin
        ? "Credenciais inválidas"
        : data.message;
    }
    return response;
  },
  handleGetCompetitorInfo: async () =>{
    const url = `${API_BASE_URL}/competitor/info`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${Cookies.get("token")}`
      },
      body: JSON.stringify({token: Cookies.get("token")})
    })

    const data = await res.json();
    if (res.ok) {
      response.ok = true;
      response.user = {name: data.name, score: data.score};
    } else {
      response.ok = false;
      response.msg = data.message;
    }
    return response;
  },
  handleRegister: async (creadentials) => {
    const url = `${API_BASE_URL}/competitor/auth/register`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(creadentials),
    });

    const data = await res.json();
    if (res.ok) {
      response.ok = true;
    } else {
      response.ok = false;
      response.msg = data.message;
    }
    return response;
  },
  handleTestCode: async (requestBody) => {
    const url = `${API_BASE_URL}/code/test`;
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

    return response;
  },
  handleSubmitCode: async (requestBody) => {
    const url = `${API_BASE_URL}/code/process`;
    requestBody.currentProblemId = Cookies.get("currentProblemId");
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
    return response;
  },
  handleRegisterProblem: async (problem) => {
    const url = `${API_BASE_URL}/problems/register`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(problem),
    });

    const data = await res.json();
    if (res.ok) {
      response.ok = true;
    } else {
      response.ok = false;
      response.msg = data.message;
    }
    return response;
  },
  handleGetProblemList: async () => {
    const url = `${API_BASE_URL}/problems`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      }
    });

    const data = await res.json();
    if (res.ok) {
      response.ok = true;
      response.problemList = data;
    } else {
      response.ok = false;
      response.msg = data.message;
    }
    return response;
  },
  handleUpdateProblemVisibility: async (problemId) => {
    const url = `${API_BASE_URL}/problems/update/${problemId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      }
    });

    const data = await res.json();
    if (res.ok) {
      response.ok = true;
    } else {
      response.ok = false;
      response.msg = data.message;
    }
    return response;
  },
  handleGetNextProblem: async ()  => {
    const url = `${API_BASE_URL}/problems/next`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
    const data = await res.json()
    if (res.ok){
      response.ok = true
      response.problem = data 
    }else{
      response.ok = false
      response.msg = data.message
    }
    return response;
  },
  handleCheckIfFirstProblemIsVisible: async ()  => {
    const url = `${API_BASE_URL}/problems/next`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
    if (res.ok){
      response.ok = true
    }else{
      response.ok = false
    }
    return response;
 },
  handleCheckIfNextProblemIsReady: async ()  => {
     const url = `${API_BASE_URL}/problems/verify/${Cookies.get("currentProblem")}`;
 
     const res = await fetch(url, {
       method: "GET",
       headers: {
         Authorization: `Bearer ${Cookies.get("token")}`,
       },
     })
 
     if (res.ok){
       response.ok = true
     }else{
       response.ok = false
     }
     return response;
  },
  handleFinishChalange: async () => {
    const url = `${API_BASE_URL}/problems/finish`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })

    if (res.ok){
      response.ok = true
    }else{
      response.ok = false
      const data = await res.json()
      response.msg = data.message
    }
    return response;
  },
  handleCheckIfChalangeIsFinished: async () => {
    const url = `${API_BASE_URL}/problems/finished`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })

    const data = await res.json()
    if (res.ok){
      response.ok = true
      response.finished = data
    }else{
      response.ok = false
      response.msg = data.message
    }
    return response;
  },
  handleGetChallengeResults: async () => {
    const url = `${API_BASE_URL}/competitor/results`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("token")}`
      }
    })

    const data = await res.json();
    console.log(data)
    if (res.ok) {
      response.ok = true;
      response.competitorList = data
    } else {
      response.ok = false;
      response.msg = data.message;
    }
    return response;
  }
};
