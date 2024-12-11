import Cookies from "js-cookie";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [user, setUser] = useState({})
    const navigate = useNavigate()

    const handleGetCompetitorName = ()=>{
        const url = "http://localhost:8080/competitor/getName"
    
        fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${Cookies.get("token")}`
          },
          body: JSON.stringify({token: Cookies.get("token")})
        }).then((res)=>{
          if (res.status !== 200){
            throw new Error()
          }
          return res.json()
        }).then(resObj => {
          setUser({name: resObj.name, score: resObj.score})
        }).catch(()=>{
          navigate("/serverError")
        })
      }


    return (
        <AppContext.Provider value={{handleGetCompetitorName, user}}>
            {children}
        </AppContext.Provider>
    )
}