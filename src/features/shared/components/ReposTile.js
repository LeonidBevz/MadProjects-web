import React from "react";
import { useNavigate } from "react-router-dom";
import UpArrowIco from "images/arrowupico";
import DownArrowIco from "images/arrowdown";
import CrossIco from "images/cross";
import RightArrowIco from "images/arrowrightico";
import { useTheme } from "../contexts/ThemeContext";

const ReposTile = ({repos, setRepos, handleAddRepo, noBS}) => {
    const {isNightTheme} = useTheme()
    const navigate = useNavigate()
    
    const moveUp = (index) => {
        if (index > 0) {
          const newRepos = [...repos];
          [newRepos[index], newRepos[index - 1]] = [newRepos[index - 1], newRepos[index]];
          setRepos(newRepos);
        }
    };
      
    const moveDown = (index) => {
        if (index < repos.length - 1) {
          const newRepos = [...repos];
          [newRepos[index], newRepos[index + 1]] = [newRepos[index + 1], newRepos[index]];
          setRepos(newRepos); 
        }
    };
      
    const deleteRepo = (index) => {
        const newRepos = repos.filter((_, i) => i !== index);
        setRepos(newRepos); 
    };

    return (
      <div className={noBS ? "info-tile info-tile-no-shadow" : "info-tile"}>
        {repos.map((repo, index)=>(
          <div className="sprint" key={index}>
            <div className="settings-flex">
              <p onClick={()=>navigate(`repolink`)}>{repo.name}</p>
              <div className="icons-container">
                <UpArrowIco className="settings-arrow" onClick={()=>moveUp(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                <DownArrowIco className="settings-arrow" onClick={()=>moveDown(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
                <CrossIco className="settings-cross" onClick={()=>deleteRepo(index)} color={isNightTheme ? "#d4d3cf" : "black"}/>
              </div>
            </div>
            <div className="grad-separator"></div>
          </div>
        ))}
        <div className="sprint">
          <div className="settings-flex" onClick={handleAddRepo}>
            <p>Добавить...</p>
            <RightArrowIco className="sprints-flex-img" color={isNightTheme ? "#d4d3cf" : "black"}/>
          </div>
          <div className="grad-separator"></div>
        </div>
      </div>
    );
  }
  
  export default ReposTile;
