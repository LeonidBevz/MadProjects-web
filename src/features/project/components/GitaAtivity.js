import React, {useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import Commit from "./Commit"
import Activity from "./Activity"
import SearchDropDown from "features/shared/components/SearchDropDown"
import { useGetRepoData, useGetRepos } from "../hooks/useGitActivity"
import Loading from "features/shared/components/Loading"
import { useAuth } from "features/shared/contexts/AuthContext"
import GitLogo from "images/gitlogo.svg"

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
      const users = repoData.authors
      
      const formattedData = repoData.commits.map(commit => {
        const user = users.find(user => user.githubId === commit.authorGithubId);
        return {
          name: (commit.message && commit.message.split("\n")[0]) || 'Unknown', 
          date: commit.date,
          username: user ? user.id : 'Unknown User',
          link: `https://github.com/${chosenRepo}/commit/${commit.sha}`,
          profilepic: user ? user.githubAvatar : 'No Profile Pic',
          profilelink: user ? user.profileLink : "no link" 
        };
      });
      setAllCommits(formattedData)

      const userSet = new Set();
      repoData.authors.forEach(user => userSet.add(user.id));
      userSet.add("Все")
      setMembersList(Array.from(userSet))
      setChosenMember("Все")

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
        return ((commit.username === chosenMember) || (chosenMember=== "Все")) && commitYear === parseInt(year);
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
          <h2>{`Общая активность на GitHub`}</h2>
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
            <h2>{`Общая активность на GitHub`}</h2>
            <div className="commits-tile">
              <div className="git-not-auth-container">
                <img className="git-logo" src={GitLogo} alt="HitHub"/>
                <span style={{marginBottom: "10px"}}> GitHub не втроризован.</span> 
                <button onClick={handleGitAuth}>Авторизовать</button>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div className="commits-container">
          <h2>{`Общая активность на GitHub`}</h2>
          <div className="commits-tile">
            {reposError.message}
          </div>
        </div>
      )
    }
    if (!accessToken){
      return (
        <div className="commits-container">
          <h2>{`Общая активность на GitHub`}</h2>
          <div className="commits-tile">
            Отсутствует токен авторизации      
          </div>
        </div>
      )
    }
      
    return(
      <div className="commits-container">
        {year && <h2>{`Общая активность за ${year} год`}</h2>}
        {!year && <h2>{`Общая активность на GitHub`}</h2>}
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
                  <SearchDropDown values={membersList} chosenOption={chosenMember} setChosenOption={setChosenMember} emptyMessage={"Выберите участника"}/>
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