const PlusIco = ({ color = "white" ,className = "", onClick=(() => {}) }) => (
    <svg className = {`${className} svg-trans`} onClick={onClick} viewBox="0 0 23 23" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.2191 4.79175C12.2191 4.3948 11.8973 4.073 11.5003 4.073C11.1034 4.073 10.7816 4.3948 10.7816 4.79175V10.7813H4.79199C4.39504 10.7813 4.07324 11.1031 4.07324 11.5001C4.07324 11.897 4.39504 12.2188 4.79199 12.2188H10.7816V18.2084C10.7816 18.6054 11.1034 18.9272 11.5003 18.9272C11.8973 18.9272 12.2191 18.6054 12.2191 18.2084V12.2188H18.2087C18.6056 12.2188 18.9274 11.897 18.9274 11.5001C18.9274 11.1031 18.6056 10.7813 18.2087 10.7813H12.2191V4.79175Z"/>
    </svg>
);
  
export default PlusIco;