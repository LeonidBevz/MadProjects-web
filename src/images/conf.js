const ConfirmIco = ({ color = "white", className = "", onClick=()=>{}}) => (   
    <svg onClick={onClick} className = {`${className} svg-trans`} stroke={color} viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 4.92484L5.1669 8.4248L12.5 1.4248" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
  
export default ConfirmIco;