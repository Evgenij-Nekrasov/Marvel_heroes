import { useState } from "react";
import { Helmet } from "react-helmet";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoudary from "../errorBoudary/ErrorBoudary";
import CharSearchForm from "../CharSearchForm/CharSearchForm";

import decoration from "../../resources/img/vision.png";
import "./mainPage.scss";

const MainPage = () => {
   const [selectedChar, setChar] = useState(null);
   const [show, setShow] = useState(false);

   const onCharSelected = (id) => {
      setChar(id);
   };

   return (
      <>
         <Helmet>
            <meta name="description" content="Marvel information portal" />
            <title>Marvel information portal</title>
         </Helmet>
         <TransitionGroup>
            <CSSTransition
               in={true}
               timeout={2000}
               classNames="fade"
               appear={true}
            >
               <ErrorBoudary>
                  <RandomChar />
               </ErrorBoudary>
            </CSSTransition>
            <div className="char__content">
               <CSSTransition
                  in={true}
                  timeout={2000}
                  classNames="fade"
                  appear={true}
               >
                  <ErrorBoudary>
                     <CharList onCharSelected={onCharSelected} />
                  </ErrorBoudary>
               </CSSTransition>
               <div>
                  <ErrorBoudary>
                     <CharInfo charId={selectedChar} />
                  </ErrorBoudary>
                  <ErrorBoudary>
                     <CharSearchForm />
                  </ErrorBoudary>
               </div>
            </div>
         </TransitionGroup>
         <img className="bg-decoration" src={decoration} alt="vision" />
      </>
   );
};

export default MainPage;
