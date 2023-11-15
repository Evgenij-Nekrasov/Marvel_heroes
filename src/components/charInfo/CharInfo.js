import { Component } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

class CharInfo extends Component {
   state = {
      loading: false,
      error: false,
      selectedChar: null,
   };

   marvelService = new MarvelService();

   componentDidMount() {
      this.updateChar();
   }

   componentDidUpdate(prevProps) {
      if (this.props.charId !== prevProps.charId) {
         this.updateChar();
      }
   }
   //Как это работает
   updateChar = () => {
      const { charId } = this.props;
      if (!charId) {
         return;
      }

      this.onCharLoading();

      this.marvelService
         .getCharacter(charId)
         .then(this.onCharLoaded)
         .catch(this.onError);
   };

   onCharLoading = () => {
      this.setState({
         loading: true,
      });
   };

   onCharLoaded = (selectedChar) => {
      this.setState({ selectedChar, loading: false });
   };

   onError = () => {
      this.setState({
         loading: false,
         error: true,
      });
   };
   //Как работает 66-ая строчка?
   render() {
      const { loading, error, selectedChar } = this.state;

      const skeleton = loading || error || selectedChar ? null : <Skeleton />;
      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error || !selectedChar) ? (
         <View char={selectedChar} />
      ) : null;

      return (
         <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
         </div>
      );
   }
}

const View = ({ char }) => {
   const { name, description, thumbnail, homepage, wiki, comics } = char;

   let imgStyle = { objectFit: "cover" };
   if (
      thumbnail ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
   ) {
      imgStyle = { objectFit: "contain" };
   }

   return (
      <>
         <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgStyle} />
            <div>
               <div className="char__info-name">{name}</div>
               <div className="char__btns">
                  <a href={homepage} className="button button__main">
                     <div className="inner">homepage</div>
                  </a>
                  <a href={wiki} className="button button__secondary">
                     <div className="inner">Wiki</div>
                  </a>
               </div>
            </div>
         </div>
         <div className="char__descr">{description}</div>
         <div className="char__comics">Comics:</div>
         <ul className="char__comics-list">
            {comics.length < 10
               ? "There are no comics for this character"
               : null}

            {comics.map((item, i) => {
               return (
                  //Как понимает, что {i} это char.id
                  <li key={i} className="char__comics-item">
                     {item.name}
                  </li>
               );
            })}
         </ul>
      </>
   );
};

CharInfo.propTypes = {
   charId: PropTypes.number,
};

export default CharInfo;
