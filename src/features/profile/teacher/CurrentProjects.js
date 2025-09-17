import React, { useState, useEffect } from "react";
import Table from "features/profile/components/Table";
import EmptyTable from "features/profile/components/EmptyTable";
import { useGetAllProjects, useGetCuratorGroupsJwt, useGetUnmarkedProjects } from "../hooks/useProfile";
import Loading from "features/shared/components/Loading";
import ObjectSearchDropDown from "features/shared/components/ObjectSearchDropDown";

const CurrentProjectsPage = () => {
    const [chosenGroup, setChosenGroup] = useState(null)
    const [chosenApproveStatus, setChosenApproveStatus] = useState( {title: "Одобрен", value: "Approved"})
    const [chosenRateStatus, setChosenRateStatus] = useState(null)
    const [chosenRate, setChosenRate] = useState(null)
    const [fetchData, setFetchData] = useState({projectGroupId: null,
        status: null, 
        mark: null, 
        marked: null})

    useEffect(()=>{
        setFetchData({
            projectGroupId: chosenGroup ? chosenGroup.id : null,
            status: chosenApproveStatus ? chosenApproveStatus.value : null, 
            mark: chosenRate ? chosenRate.value : null, 
            marked: chosenRateStatus ? chosenRateStatus.value : null 
        })
    },[chosenGroup, chosenApproveStatus, chosenRateStatus, chosenRate])

    const approveStatuses =[
        {title: "Одобрен", value: "Approved"},
        {title: "Отклонен", value: "Unapproved"},
        {title: "Ожидает одобрения", value: "Pending"}
    ]
    const rateStatuses =[
        {title: "Оценен", value: true},
        {title: "Не оценен", value: false}
    ]
    const rates =[
        {title: "Отлично", value: 5},
        {title: "Хорошо", value: 4},
        {title: "Удовл.", value: 3},
        {title: "Неудовл.", value: 2},
    ]

    const titles = [
        {name: "Название", key: "name", type: "link"},
        {name: "Группа проектов", key: "group",type: "text"},
        {name: "Команда", key: "formatedteam",type: "text"}, 
        {name: "Дата создания", key: "formateddate",type: "text"}
    ]


    const [table,setTable] = useState([])


    const {data, isLoading: isUpdateLoadig, error: updateError } = useGetAllProjects(fetchData)
    useEffect(()=>{
        if (!data) return
      
        const newTable = data.map(project=>({
            name: project.title,
            formateddate: project.createDate,
            linkto: `/${project.id}/activity`,
            formatedteam: project.members.map(member => (member.lastName + " "+ member.firstName + " " + member.secondName +" (" + member.group + ")")).join('\n'),
            group: project.groupTitle
        }))
        setTable(newTable)
    },[data])
   
    const {data: projectsGroups, isLoading, error} = useGetCuratorGroupsJwt()

    if (isLoading) {
        return(
            <div className="loading-page page">
                <Loading/>
            </div>
        )
    }

    if (error){
        return(
            <div>
                {`Ошибка загрузки ${error.status}`}
            </div>
        )
    }

    return (
      <div className="info-page page">  
        <div className="info-container">
            <h2>Все проекты</h2>
            <div className="table-tile" style={{marginBottom: "150px", overflow: "visible"}}>
                <div className="table-rate-flex" style={{marginBottom: "10px"}}>
                    <div className="flex1">
                      <ObjectSearchDropDown values={projectsGroups} displayKey={"title"} chosenOption={chosenGroup} setChosenOption={setChosenGroup} emptyMessage={"Группа проектов"}/> 
                    </div>
                </div>
                <div className="table-rate-flex" style={{marginBottom: "10px", flexWrap: "wrap"}}>
                    <div className="flex1">
                      <ObjectSearchDropDown values={approveStatuses} displayKey={"title"} chosenOption={chosenApproveStatus} setChosenOption={setChosenApproveStatus} emptyMessage={"Статус одобрения"}/> 
                    </div>
                    <div className="flex1">
                      <ObjectSearchDropDown values={rateStatuses} displayKey={"title"} chosenOption={chosenRateStatus} setChosenOption={setChosenRateStatus} emptyMessage={"Статус оценивания"}/> 
                    </div>
                    <div className="flex1">
                      <ObjectSearchDropDown values={rates} displayKey={"title"} chosenOption={chosenRate} setChosenOption={setChosenRate} emptyMessage={"Оценка"}/> 
                    </div>
                </div>

                {table.length === 0 ? <EmptyTable text={"Ничего не найдено, измените фильтры "}/> : <Table titles={titles} data={table}/>}    
            </div>
        </div>
      </div>
    );
  }
  
  export default CurrentProjectsPage;
