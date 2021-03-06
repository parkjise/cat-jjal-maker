import logo from './logo.svg';
import React from "react"
import './App.css';
import Tit from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };
  const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
  };
    function CatItem(props) {
      return (
        <li>
          <img src={props.img} alt="고양이" style={{width:"150px",border:"1px solid #000"}}/>
        </li>
      )
    }

    function Favorites({favorites}) {
      if(favorites.length === 0) {
        return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
      }
      return (
        <ul className="favorites">
          {favorites.map((cat) => (<CatItem img={cat} key={cat} />))}
        </ul> 
      )
    }
    const MainCard = ({img,onHeartClick,alreadyFavorite}) => {
      const heartIcon = alreadyFavorite ? "💖" : "🤍";
      return (
        <div className="main-card">
          <img src={img} alt="고양이" width="400" />
          <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
      )
    }

    const FormWrap = ({updateMainCat}) => {
      const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
      const [value,setValue] = React.useState('');
      const [erroMessage,setErrorMessage] = React.useState('');
      function handleInputChange(e) {
        const userValue = e.target.value;
        setErrorMessage('')
        if(includesHangul(userValue)){
          setErrorMessage('한글은 입력할 수 없습니다')
        }
        setValue(userValue.toUpperCase());
      }
      function handleFormSubmit(e){
        e.preventDefault();
        setErrorMessage('')
        if(value === '') {
          setErrorMessage('빈 값으로 만들 수 없습니다');
          return;
        }
        updateMainCat(value);
      }
      return (
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="name" placeholder="영어 대사를 입력해주세요" onChange={handleInputChange} value={value}/>
          <button type="submit">생성</button>
          <p style={{color:'red'}}>{erroMessage}</p>
        </form>
      )
    }
    const App = () => {
      const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
      const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
      const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";
      // const [counter,setCounter] = React.useState(jsonLocalStorage.getItem('counter'));
      const [counter,setCounter] = React.useState(() => {
        return jsonLocalStorage.getItem('counter') || []
      })
      const [nameCat,setNameCat]= React.useState(CAT1);
      // const [favorites,setFavorites] = React.useState(jsonLocalStorage.getItem('favorites') || []);
      const [favorites,setFavorites] = React.useState(() => {
        return jsonLocalStorage.getItem('favorites') || []
      })
      const alreadyFavorite = favorites.includes(nameCat)

      async function setInitialCat(){
        const newCat =  await fetchCat('First cat');
        console.log(newCat)
        setNameCat(newCat);
      }

      React.useEffect(() => {
        setInitialCat();
      },[])
      React.useEffect(() => {
        console.log('Hello')
      },[])

      async function updateMainCat(value) {
        const newCat =  await fetchCat(value);
        setNameCat(newCat);
        const nextCounter = counter + 1;
        // setCounter(nextCounter);
        setCounter((prev) => {
          const nextCounter = prev + 1;
          jsonLocalStorage.setItem('counter',nextCounter);
          return nextCounter;
        });
      }
      
      function handleHeartClick() {
        const nextFavorites = [...favorites,nameCat]
        setFavorites(nextFavorites);
        jsonLocalStorage.setItem('favorites',nextFavorites)
      }

      const counterTitle = counter === null ? "" : counter + "번째 "
     return (
       <div>
        <Tit>{counterTitle}고양이 가라사대</Tit>
        <FormWrap updateMainCat={updateMainCat}/>
        <MainCard img={nameCat} onHeartClick = {handleHeartClick} alreadyFavorite = {alreadyFavorite}/>
        <Favorites favorites={favorites} />
       </div>
       )
    }

export default App;
