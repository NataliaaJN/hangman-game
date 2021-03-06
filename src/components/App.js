import "../styles/App.scss";
import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import callToApi from "../services/api";
import Header from "./Header";
import Dummy from "./Dummy";
import Footer from "./Footer";
import Intructions from "./Instructions";
import Options from "./Options";
import Form from "./Form";

function App() {
  const [lastLetter, setLastLetter] = useState("");
  const [word, setWord] = useState("");
  const [userLetters, setUserLetters] = useState([]);

  useEffect(() => {
    callToApi().then((response) => {
      setWord(response);
    });
  }, []);

  const handleInput = (value) => {
    let inputValue = value;
    if (value.toLocaleLowerCase().match("^[a-zA-ZáäéëíïóöúüÁÄÉËÍÏÓÖÚÜñÑ]?")) {
      setLastLetter(inputValue);
    }
    if (inputValue) {
      const foundLetter = userLetters.find(
        (letter) => letter === inputValue[0]
      );
      if (!foundLetter) {
        setUserLetters([...userLetters, inputValue[0]]);
      }
    }
  };

  const renderSolutionLetters = () => {
    const wordLetters = word.split("");
    return wordLetters.map((letter, index) => {
      if (userLetters.includes(letter)) {
        return (
          <li key={index} className="letter">
            {letter}
          </li>
        );
      } else {
        return <li key={index} className="letter"></li>;
      }
    });
  };

  const renderErrorLetters = () =>
    userLetters
      .filter((letter) => !word.includes(letter))
      .map((letter, index) => (
        <li key={index} className="letter">
          {letter}
        </li>
      ));

  const numberOfErrors = userLetters.filter(
    (letter) => !word.includes(letter)
  ).length;

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
  };

  const handleNewWordInput = (value) => {
    setWord(value)
    setUserLetters([])
    setLastLetter("")
  };

  return (
    <div className="page">
      <Header />

      <main className="main">
        <Switch>
          <Route exact path="/">
            <section>
              <div className="solution">
                <h2 className="title">Solución:</h2>
                <ul className="letters">{renderSolutionLetters()}</ul>
              </div>
              <div className="error">
                <h2 className="title">Letras falladas:</h2>
                <ul className="letters">{renderErrorLetters()}</ul>
              </div>
              <Form lastLetter={lastLetter} handleInput={handleInput} />
            </section>
          </Route>
          <Route path="/instructions">
            <Intructions />
          </Route>

          <Route path="/options">
            <Options handleFormSubmit={handleFormSubmit} handleNewWordInput={handleNewWordInput} />
          </Route>
        </Switch>
        <Dummy numberOfErrors={numberOfErrors} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
