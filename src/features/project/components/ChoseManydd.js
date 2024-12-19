import React, {useState, useEffect, useRef} from "react";
import "css/dropdown.css"
import crossIMG from "images/cross.svg"


const ChoseManyDropDown = ({ values, displayKey, selectedValues, setSelectedValues, emptyMessage}) => {
    const [isDropdownOpen,setIsDropdownOpen] = useState(false);
    const [searchValue,setSearchValue]= useState("")
    const [filteredValues, setFilteredValues] = useState(values)
    const container = useRef()
    const dropdown = useRef()
    const scrollContainer = useRef()
    const input = useRef()
    const [initialSelected, setInitialSelected] = useState(selectedValues)

    const handleDropdownClick = ()=>{
        setIsDropdownOpen(true)
    }

    const handleLiClicked = (item)=>{
        if (!selectedValues.some(value => value.id === item.id)) {
            setSelectedValues([...selectedValues, item]);
            setTimeout(() => {
                if (scrollContainer.current) {
                    scrollContainer.current.scrollLeft = scrollContainer.current.scrollWidth;
                }
            }, 0); 
        }
        setSearchValue('');
        if (input.current){
            input.current.focus()
        }
    }
    const handleRemoveTag = (tagToRemove) => {
        setSelectedValues(selectedValues.filter((tag) => tag !== tagToRemove));
    };

    const handleSValueChange = (event) =>{
      setSearchValue(event.target.value);
    }

    useEffect(() => {
      if (searchValue.trim() === '') {
        setFilteredValues(values);
        return;
      }
      
      const searchTimer = setTimeout(async() => {
        const searchLower = searchValue.toLowerCase()
        
        setFilteredValues(values.filter(item => item[displayKey].toLowerCase().includes(searchLower)));
      }, 250); // Ждем пока пользователь закончит ввод
  
      return () => clearTimeout(searchTimer);
      // eslint-disable-next-line
    }, [searchValue, values]);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (container.current  && !(container.current.contains(event.target) || dropdown.current.contains(event.target))) {
            setIsDropdownOpen(false);
          }
        };
    
        if (isDropdownOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          setSearchValue("")
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line 
      }, [isDropdownOpen]);

    return (
      <>
        <div className="values-container">
          {selectedValues.map((value, index) => (
            <span key={index} className="item ">
              {value[displayKey]}
              {!initialSelected.some(item=>item.id === value.id) && (
                <img type="button" onClick={() => handleRemoveTag(value)} src={crossIMG} alt="close"/>
              )}
            </span>
          ))}
        </div>
        <div className="wrapper" ref={scrollContainer}>
          <div className={isDropdownOpen ? `chose-many-dd-container isddactive` : "chose-many-dd-container"} ref={container}>
            <div className={"chose-many-dd-button"}>
                <input 
                  className={isDropdownOpen ? "input-active": ""}
                  placeholder={emptyMessage}
                  value={searchValue}
                  onChange={handleSValueChange}
                  onClick={handleDropdownClick }
                  maxLength="64"
                  ref={input}
                  style={{color: "var(--main-text-color)"}}
                />
            </div>         
          </div>
          
        </div>
        {isDropdownOpen && (
          <div className={"chose-many-dd"} ref={dropdown}>
            <ul>
              {filteredValues.length===0 && (
                <p className="ddsearch-note">Ничего не найдено</p>
              )}
              {filteredValues.map((item, index) => (
                <li className={selectedValues.some(value => value.id === item.id) ? "liactive":""} key={index} onClick={()=>handleLiClicked(item)}>{item[displayKey]}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
}

export default ChoseManyDropDown