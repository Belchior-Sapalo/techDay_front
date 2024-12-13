import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../utils/apiServices";

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [user, setUser] = useState({})
    const [remainingTime, setRemainingTime] = useState(null);
    const [durationTimeOut, setDurationTimeOut] = useState(false);
    const navigate = useNavigate()

    const handleGetCompetitorInfo = async ()=>{
        try {
          const res = await ApiServices.handleGetCompetitorInfo()

          if (res.ok){
            setUser(res.user)
          }else{
            throw new Error(res.msg)
          }
        } catch (error) {
          alert(error.message)
      }
    }

    return (
        <AppContext.Provider value={{handleGetCompetitorInfo, user, remainingTime, setRemainingTime, durationTimeOut, setDurationTimeOut}}>
            {children}
        </AppContext.Provider>
    )
}