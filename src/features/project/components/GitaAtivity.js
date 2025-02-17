import React, {useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import Commit from "./Commit"
import Activity from "./Activity"
import SearchDropDown from "features/shared/components/SearchDropDown"
import { useGetRepoData, useGetRepos } from "../hooks/useGitActivity"
import Loading from "features/shared/components/Loading"
import { useAuth } from "features/shared/contexts/AuthContext"
import GitLogo from "images/gitlogo.svg"
import ObjectSearchDropDown from "features/shared/components/ObjectSearchDropDown"

const GitActivity = () => {
    const {accessToken} = useAuth()
    const navigate = useNavigate()
    const {projectId} = useParams()

    const [year,setYear] = useState()
    const [chosenRepo, setChosenRepo] = useState()
    const [chosenBranch, setChosenBranch] = useState()
    const [chosenRepoSha, setChosenRepoSha] = useState()
    const [chosenMember, setChosenMember] = useState() 

    const [membersList, setMembersList] = useState([])
    const [yearsList, setYearsList] = useState([])
    const [branchesNames, setBranchesNames] = useState([])

    const [allCommits, setAllCommits] = useState( [])
    const [commitsToDisplay, setCommitsToDisplay] = useState();
    const [activities, setActivities] = useState() //1:57, 2:33

    const { data: branchesData, isLoading: isReposLoading, error: reposError } = useGetRepos({ projectId: projectId}); 
    const { data: repoData, isLoading: isRepoLoading, error: isRepoError } = useGetRepoData({ sha: chosenRepoSha, repoName: chosenRepo});
    
    function formatDate(date) {
      const dateParts = date.slice(0, 10).split('-'); 
      const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; 
      return formattedDate;
    }
    function groupCommitsByDay(commits) {
      const formatDate = date => new Date(date).toISOString().split('T')[0];

      const grouped = commits.reduce((acc, commit) => {
        const day = formatDate(commit.date);
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(commit);
        return acc;
      }, {});
    
      return Object.values(grouped);
    }

    useEffect(()=>{
      if (!branchesData) return

      const branchNames = branchesData.flatMap(
        repo => repo.repoBranches.map(branch => branch.name)
      );
      setBranchesNames(branchNames)

      const mainBranch = branchNames.find(branch => branch.includes('main'));
      if (!mainBranch) return
      setChosenBranch(mainBranch)
    },[branchesData])

    useEffect(()=>{
      if (!chosenBranch) return
      //console.log(branchesData)
      const newChosenRepo = branchesData.flatMap(repo => 
        repo.repoBranches.map(branch => ({
            repoName: repo.name,
            branchName: branch.name,
            branchSha: branch.sha
        }))
    ).find(branch => branch.branchName === chosenBranch);
    setChosenRepoSha(newChosenRepo.branchSha)
    setChosenRepo(newChosenRepo.repoName)
    
    // eslint-disable-next-line
    },[chosenBranch])

    useEffect(()=>{
    
      if (!repoData) return     
      const usersObject = [];
      let unknownCount = 0;

      let unknownGithubIds = []

      let animals = []

      const authIds = repoData.authors
        .filter(author => author.githubMeta !== null)
        .map(author => author.githubMeta.githubId);
      //console.log(authIds)

      if (repoData.authors.some(author => author.githubMeta === null)){
        unknownGithubIds = Array.from(
          new Set(
            repoData.commits
              .map(commit => commit.authorGithubId) 
              .filter(githubId => !authIds.includes(githubId)) 
          )
        );
        
        animals = [
          "Тупорылый крокодил",
          "Неизвестный психролют",
          "Сумасшедший муравей",
          "Неизвестный Сладкогуб",
          "Кусака мучитель",
          "Ежемуха свирепая",
          "Неизвестная лягушка",
          "Неизвестный барсук",
          "Неизвестная обезьяна",
          "Неизвестный лемур",
          "Неизвестная сова",
          "Неизвестный морж",
          "Неизвестная зебра",
          "Неизвестный медведь",
          "Неизвестная черепаха"
        ];
      }
     
      repoData.authors.forEach(user => {
        let name;
      
        if (user.profile) {
          const initials = user.profile.firstName.slice(0, 1) + "." + (user.profile.secondName?.slice(0, 1) || "") + ".";
          name = `${user.profile.lastName} ${initials}`;
      
          usersObject.push({
            id: user.githubMeta.githubId,
            name: name,
            githubAvatar: user.githubMeta.githubAvatar,
            profileLink: user.githubMeta.profileLink
          });
        } else {
          unknownCount++;
          if (unknownCount > 15){
            name = animals[unknownCount - 1] + unknownCount - 1;
          }
          else {
            name = animals[unknownCount - 1];
          }
      
         const unknownGithubId = unknownGithubIds[unknownCount - 1]; 

          usersObject.push({
            id: unknownGithubId, 
            name: name,
            githubAvatar: "/baseProfilePic.png",
            profileLink: "unknown"
          });
        }
      });

      usersObject.unshift({ name: "Все" });
      //console.log(usersObject,repoData.commits )


      const formattedData = repoData.commits.map(commit => {
        const user = usersObject.find(user => user.id === commit.authorGithubId);
        if (!user) return{
          name: (commit.message && commit.message.split("\n")[0]) || 'Unknown', 
          date: commit.date,
          username: "name",
          link: `https://github.com/${chosenRepo}/commit/${commit.sha}`,
          profilepic: "githubAvatar",
          profilelink: "user.profileLink"
        }
        return {
          name: (commit.message && commit.message.split("\n")[0]) || 'Unknown', 
          date: commit.date,
          username: user.name,
          link: `https://github.com/${chosenRepo}/commit/${commit.sha}`,
          profilepic: user.githubAvatar,
          profilelink: user.profileLink
        };        
      });
      setAllCommits(formattedData)

      setChosenMember({name: "Все"})
      setMembersList(usersObject)
 
      if (formattedData.length === 0){
        return
      }
      const maxDate = new Date(formattedData[0].date)
      const minDate  = new Date(formattedData[formattedData.length-1].date);

      setYear(maxDate.getFullYear())

      const startYear = minDate.getFullYear();
      const endYear = maxDate.getFullYear();
      const yearsArray = [];

      for (let year = startYear; year <= endYear; year++) {
        yearsArray.push(year);
      setYearsList(yearsArray)
      }
      // eslint-disable-next-line
    },[repoData])

    useEffect(()=>{
      if (!year && !chosenMember) return

      const filteredCommits = allCommits.filter(commit => {
        const commitDate = new Date(commit.date);
        const commitYear = commitDate.getFullYear();
        return ((commit.username === chosenMember.name) || (chosenMember.name === "Все")) && commitYear === parseInt(year);
      });
      

      setCommitsToDisplay(groupCommitsByDay(filteredCommits))
    },[chosenMember, year, allCommits])

    useEffect(()=>{
      if (!commitsToDisplay) return
      
      function getDayOfYear(dateStr) {
        const date = new Date(dateStr);
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear - 1;
      }
      const commitCount = {};
      commitsToDisplay.forEach(commitList => {
        commitList.forEach(commit => {
          const dayOfYear = getDayOfYear(commit.date);
          
          if (!commitCount[dayOfYear]) {
            commitCount[dayOfYear] = 1;
          } else {
            commitCount[dayOfYear]++;
          }
        });
      });

      setActivities(commitCount)

    },[commitsToDisplay])

    const handleGitAuth = async ()=>{
      navigate(`/git/auth?code=&state=${accessToken}`)
    }

    if (isReposLoading){
      return (
        <div className="commits-container">
          <h2>{`Активность на GitHub`}</h2>
          <div className="commits-tile">
            <Loading/>        
          </div>
        </div>
      )
    }
    if (reposError){
      if (reposError.status===425){
        return (
          <div className="commits-container">
            <h2>{`Активность на GitHub`}</h2>
            <div className="commits-tile">
              <div className="git-not-auth-container">
                <img className="git-logo" src={GitLogo} alt="HitHub"/>
                <span style={{marginBottom: "10px"}}> GitHub не авторизован.</span> 
                <button onClick={handleGitAuth}>Авторизовать</button>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div className="commits-container">
          <h2>{`Активность на GitHub`}</h2>
          <div className="commits-tile">
            {reposError.message}
          </div>
        </div>
      )
    }
    if (!accessToken){
      return (
        <div className="commits-container">
          <h2>{`Активность на GitHub`}</h2>
          <div className="commits-tile">
            Отсутствует токен авторизации      
          </div>
        </div>
      )
    }
      
    if (branchesNames?.length === 0){
      return (
        <div className="commits-container">
          <h2>{`Активность на GitHub`}</h2>
          <div className="commits-tile">
            <span> В проекте не привязаны репозитории, добавить их может создатель проекта в настройках </span>
          </div>
        </div>
      )
    }
    return(
      <div className="commits-container">
        {year && <h2>{`GitHub активность за ${year} год`}</h2>}
        {!year && <h2>{`Активность на GitHub`}</h2>}
        <div className="commits-tile">
          <div className="commits-controls-container">
            <div className="controls-block repo">
                <p>Репозиторий</p>
                <div className="flex1">
                  <SearchDropDown values={branchesNames} chosenOption={chosenBranch} setChosenOption={setChosenBranch} emptyMessage={"Выберите репозиторий"}/>
                </div>
            </div> 
          </div>
          <div className="commits-controls-container">
            {membersList.length>0 && (
              <div className="controls-block member">
                <p>Участник</p>
                <div className="flex1">
                  <ObjectSearchDropDown values={membersList} displayKey={"name"} chosenOption={chosenMember} setChosenOption={setChosenMember} emptyMessage={"Выберите участника"}/>
                </div>
              </div>
            )}
            {yearsList.length> 0&& (
              <div className="controls-block year">
                <p>Год</p>
                <div className="flex1">
                  <SearchDropDown values={yearsList} chosenOption={year} setChosenOption={setYear} emptyMessage={"Выберите год"}/>
                </div>
              </div>
            )}
          </div>
          {activities && (
            <Activity year={year} activities={activities} isRepoError={isRepoError} isRepoLoading={isRepoLoading}/>
          )}
          {isRepoLoading && (
            <Loading/>
          )} 
          {commitsToDisplay && !isRepoLoading && (
            <div className="commits">
              {commitsToDisplay.map((commitList,i)=>(
                <div key={i} >
                  <p>{`Коммиты за ${formatDate(commitsToDisplay[i][0].date)}`}</p>
                  <div className="commits-date-container">
                    {commitsToDisplay[i].map((commit,j)=>(
                      <Commit 
                        name={commit.name} 
                        date={commit.date} 
                        username={commit.username} 
                        link={commit.link} 
                        profilepic={commit.profilepic}
                        key={j}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}

export default GitActivity