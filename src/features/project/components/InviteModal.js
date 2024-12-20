import React, {useRef, useEffect, useState}  from "react";
import { useGetInviteCode } from "../hooks/useProject";
import Loading from "features/shared/components/Loading";

const InviteModal = ({ onCancel, projectId}) => {
    const container = useRef(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [copied, setCopied] = useState(false);

    const {data, isLoading, error} = useGetInviteCode(projectId)

    useEffect(()=>{
        if (!error) return

        setErrorMessage("Что-то пошло не так ", error.status)
    },[error])

    useEffect(() => {
      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          onCancel();
        }
      };
      const handleClickOutside = (event) => {
        if (container.current  && !container.current.contains(event.target)) {
          onCancel();
        }
      };
  
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.removeEventListener('mousedown', handleClickOutside);
      };
      // eslint-disable-next-line
    }, []); 

    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(data.invite);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Ошибка копирования: ", err);
        }
      };
  
    return (
      <div className="settings-modal z15-level" ref={container}>
          {errorMessage && (<p className="error-message">{errorMessage}</p>)}
          {isLoading && (<Loading/>)}
          {!isLoading && (
            <div>
                <h2>Пригласить участников</h2>
                <p>Для приглашения участника отправьте ему многоразовый код, указанный ниже:</p>
                <div className="code-container">
                    <span onClick={handleCopy} className="invite-code">
                      {data.invite}
                    </span>
                    {copied && (
                      <span style={{ color: "green", fontSize: "14px", marginLeft: "5px" }}>Скопировано!</span>
                    )}
               </div>
                <div className="settings-flex-butt">
                  <button type="button" onClick={onCancel}>Отмана</button>
                </div>
            </div>
          )}
          
      </div>
    )
  }

export default InviteModal