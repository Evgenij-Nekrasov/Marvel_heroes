import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = (props) => {
   const [chars, setChars] = useState([]);
   const [offset, setOffset] = useState(210);
   const [newItemLoading, setNewItemLoading] = useState(false);
   const [charEnded, setCharEnded] = useState(false);

   const { loading, error, getAllCharacters } = useMarvelService();

   //Почему возникает бесконечный цикл без пустого массива
   useEffect(() => {
      onRequest(offset, true);
   }, []);
   //как это работает и зачем вообще нужна эта конструкция?Без неё все норм
   const onRequest = (offset, initial) => {
      initial ? setNewItemLoading(false) : setNewItemLoading(true);
      getAllCharacters(offset).then(onCharsLoaded);
   };

   const onCharsLoaded = (newChars) => {
      let ended = false;
      if (newChars.length < 9) {
         ended = true;
      }
      //Как соблюдается последовательсность вызовов за счет колбэк функции ниже?
      setChars((chars) => [...chars, ...newChars]);
      setNewItemLoading((newItemLoading) => false);
      setOffset((offset) => offset + 9);
      setCharEnded((charEnded) => ended);
   };

   const arrRefs = useRef([]);

   //Зачем сначала удаляем все char__item_selected
   //Зачем current?
   const focusOnItem = (id) => {
      arrRefs.current.forEach((ref) =>
         ref.classList.remove("char__item_selected")
      );
      arrRefs.current[id].classList.add("char__item_selected");
      arrRefs.current[id].focus();
   };

   const items = renderItems(chars);

   function renderItems(arr) {
      const items = arr.map((item, i) => {
         let imgStyle = { objectFit: "cover" };
         if (
            item.thumbnail ===
            "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
         ) {
            imgStyle = { objectFit: "unset" };
         }

         return (
            <li
               className="char__item"
               tabIndex={0}
               ref={(el) => (arrRefs.current[i] = el)}
               key={item.id}
               onClick={() => {
                  props.onCharSelected(item.id);
                  focusOnItem(i);
               }}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     props.onCharSelected(item.id);
                     focusOnItem(i);
                  }
               }}
            >
               <img src={item.thumbnail} alt={item.name} style={imgStyle} />
               <div className="char__name">{item.name}</div>
            </li>
         );
      });
      return <ul className="char__grid">{items}</ul>;
   }

   const errorMessage = error ? <ErrorMessage /> : null;
   const spinner = loading && !newItemLoading ? <Spinner /> : null;

   return (
      <div className="char__list">
         {errorMessage}
         {spinner}
         {items}
         <button
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{ display: charEnded ? "none" : "block" }}
            onClick={() => onRequest(offset)}
         >
            <div className="inner">load more</div>
         </button>
      </div>
   );
};

CharList.propTypes = {
   onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
