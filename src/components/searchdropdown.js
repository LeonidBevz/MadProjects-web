import React, {useState, useEffect, useRef} from "react";
import "./dropdown.css"
import UpArrowIco from "../images/arrowupico";
import DownArrowIco from "../images/arrowdown";
import useToken from "../hooks/useToken";


const SearchDropDown = ({values, chosenOption, setChosenOption, emptyMessage}) => {
    const [isDropdownOpen,setIsDropdownOpen] = useState(false);
    const [searchValue,setSearchValue]= useState("")
    const [filteredValues, setFilteredValues] = useState(values)
    const {isNightTheme} = useToken();

    const container = useRef()

    const handleLiClicked = (item)=>{
        setChosenOption(item)
        setSearchValue("")
        setIsDropdownOpen(false)
    }
    const handleSValueChange = (event) =>{
      setSearchValue(event.target.value);
    }

    useEffect(() => {
      if (searchValue.trim() === '') {
        setFilteredValues(values);
        return;
      }
  
      const searchTimer = setTimeout(async() => {
        setFilteredValues(values.filter(item => item.toLowerCase().includes(searchValue.toLowerCase())));
      }, 250); // Ждем пока пользователь закончит ввод
  
      return () => clearTimeout(searchTimer);
      // eslint-disable-next-line
    }, [searchValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (container.current  && !container.current.contains(event.target)) {
            setIsDropdownOpen(false);
          }
        };
    
        if (isDropdownOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          if (!values.includes(searchValue)){
            setSearchValue("")
          }
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line 
      }, [isDropdownOpen]);

    return (
      <div className="search-dd-container" ref={container}>
        <div className={isDropdownOpen ? "search-dd-button isddactive" : "search-dd-button"} onClick={()=>setIsDropdownOpen(!isDropdownOpen)}>
            <div className="input-text no-trans">{chosenOption}</div>
            {isDropdownOpen ? 
              <DownArrowIco color={isNightTheme ? "#d4d3cf" : "#D9D9D9"} className="search-dd-button-img"/>
              :<UpArrowIco color={isNightTheme ? "#d4d3cf" : "#D9D9D9"} className="search-dd-button-img"/>}
          </div>
        {isDropdownOpen && (
          <div className="search-dropdown">
            <input 
              className="search-dropdown-input"
              placeholder={emptyMessage}
              value={searchValue}
              onChange={handleSValueChange}
              required
            />
            <ul>
              {filteredValues.map((item, index) => (
                <li className={item===chosenOption ? "liactive":""} key={index} onClick={()=>handleLiClicked(item)}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
}

export default SearchDropDown