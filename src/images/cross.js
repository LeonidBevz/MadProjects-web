const CrossIco = ({ color = "white",className = "", onClick=()=>{}}) => (   
    <svg onClick={onClick} className = { className }   viewBox="0 0 10 9" stroke={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M9 0.5L1 8.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 0.5L9 8.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
  );
  
  export default CrossIco;