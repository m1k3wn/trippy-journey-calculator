import { useState } from "react";
import Header from "./components/Header";
import Calculator from "./components/Calculator";

function App() {
  return (
    <div className="app-container">
      <Header />
      <Calculator />
    </div>
  );
}

export default App;
