import React, { useContext, useEffect, useState } from "react";
import CodeEditor from "../../components/codeEditor/codeEditor";
import "../coderPage/coderPage.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

export default function CoderPage() {
  return (
    <main id="coder-page">
      <Header/>
      <section id="coder-section">
        <CodeEditor />
      </section>
      <Footer/>
    </main>
  );
}
