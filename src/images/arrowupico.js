const UpArrowIco = ({ color = "white",className = ""}) => (
    <svg className = {className} viewBox="0 0 11 6" fill="transparent" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5.5 5L10 1" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
  
  export default UpArrowIco;