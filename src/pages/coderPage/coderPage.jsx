import React, { useContext, useEffect, useState } from "react";
import CodeEditor from "../../components/codeEditor/codeEditor";
import "../coderPage/coderPage.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../components/context/appContext";

export default function CoderPage() {
  const navigate = useNavigate()
  const {user} = useContext(AppContext)

  // function handleGetCompetitorName(){
  //   const url = "http://localhost:8080/competitor/getName"

  //   fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //       "Authorization": `Bearer ${Cookies.get("token")}`
  //     },
  //     body: JSON.stringify({token: Cookies.get("token")})
  //   }).then((res)=>{
  //     if (res.status !== 200){
  //       throw new Error()
  //     }
  //     return res.json()
  //   }).then(resObj => {
  //     setUser({name: resObj.name, score: resObj.score})
  //   }).catch(()=>{
  //     navigate("/serverError")
  //   })
  // }
  // useEffect(()=>{
  // }, [])
  
  return (
    <main id="coder-page">
      <Header/>
      <section id="coder-section">
        <CodeEditor />
      </section>
    </main>
  );
}
