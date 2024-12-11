const API_BASE_URL = "http://localhost:8080"
const response = {ok: false, msg: ""}
import Cookies from "js-cookie";
export const ApiServices = {
    handleLogin: async (creadentials) => {
        const url = `${API_BASE_URL}/competitor/auth/login`;

        creadentials.password = creadentials.bi;
        const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(creadentials),
        })

        const data = await res.json()
        if (res.ok){
            response.ok = true
            response.token = data.token
        }else{
            response.ok = false;
            response.msg = data.msg
        }
        return response;
    },
    handleRegister: async (creadentials) => {
        const url = `${API_BASE_URL}/competitor/auth/register`;
        creadentials.password = creadentials.bi;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(creadentials),
        })

        const data = await res.json()
        if (res.ok){
            response.ok = true
        }else{
            response.ok = false;
            response.msg = data.message
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
        })

        const data = await res.json()
        if (res.ok){
            response.ok = true
            response.resObj = data;
        }else{
            response.ok = false
            response.msg = data.message
        }

        return response
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
        })

        const data = await res.json()
        if (res.ok){
            response.ok = true
            response.resObj = data;
        }else{
            response.ok = false
            response.msg = data.message
        }
        return response
      }
}