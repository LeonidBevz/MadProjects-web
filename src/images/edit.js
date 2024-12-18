const EditIco = ({ color = "white",className = "", onClick=()=>{}}) => (
      <svg onClick={onClick} className = { className }  viewBox="0 0 29 29" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.3192 24.409L24.7838 9.94444L18.9851 4.14575L4.52051 18.6104V24.409H10.3192ZM18.9851 6.70276L22.2268 9.94444L19.8891 12.2821L16.6475 9.04043L18.9851 6.70276ZM15.3689 10.3189L18.6107 13.5606L9.57027 22.601H6.32858V19.3593L15.3689 10.3189Z"/>
    </svg>

  );
  
  export default EditIco;