import { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

class RandomChar extends Component {
   //Чтобы не писать конструктор используем синтаксис полей классов?
   state = {
      char: {},
      loading: true,
      error: false,
   };
   //Public и Private..
   //Публичные(статичные) поля являются общими для всех экземпляров класса и к ним можно получить доступ, используя имя класса.
   //Доступ к приватным полям возможен только внутри класса, в котором они определены.
   //Почему синтаксис полей классов?
   //Экземпляры проходят через меньшее количество переходов состояний, поскольку объявленные поля присутствуют всегда.
   marvelService = new MarvelService();

   componentDidMount() {
      console.log("Mount");
      //методы нельзя использовать в конструкторе
      this.updateChar();
      //почему мы здесь вначале прописываем this
      // this.timerId = setTimeout(this.updateChar, 15000);
   }

   updateChar = () => {
      const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
      this.onCharLoading();
      this.marvelService
         .getCharacter(id)
         .then(this.onCharLoaded)
         .catch(this.onError);
   };

   onCharLoading = () => {
      this.setState({
         loading: true,
      });
   };

   onCharLoaded = (char) => {
      this.setState({ char, loading: false });
   };

   onError = () => {
      this.setState({
         loading: false,
         error: true,
      });
   };

   componentWillUnmount() {
      console.log("Unmount");
      clearTimeout(this.timerId);
   }

   render() {
      const { char, loading, error } = this.state;
      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error) ? <View char={char} /> : null;

      return (
         <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
               <p className="randomchar__title">
                  Random character for today!
                  <br />
                  Do you want to get to know him better?
               </p>
               <p className="randomchar__title">Or choose another one</p>
               <button
                  className="button button__main"
                  onClick={this.updateChar}
               >
                  <div className="inner">try it</div>
               </button>
               <img
                  src={mjolnir}
                  alt="mjolnir"
                  className="randomchar__decoration"
               />
            </div>
         </div>
      );
   }
}

const View = ({ char }) => {
   const { name, description, thumbnail, homepage, wiki } = char;
   let imgStyle = { objectFit: "cover" };
   if (
      thumbnail ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
   ) {
      imgStyle = { objectFit: "contain" };
   }

   return (
      <div className="randomchar__block">
         <img
            src={thumbnail}
            alt="Random character"
            className="randomchar__img"
            style={imgStyle}
         />
         <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">{description}</p>
            <div className="randomchar__btns">
               <a href={homepage} className="button button__main">
                  <div className="inner">homepage</div>
               </a>
               <a href={wiki} className="button button__secondary">
                  <div className="inner">Wiki</div>
               </a>
            </div>
         </div>
      </div>
   );
};

export default RandomChar;