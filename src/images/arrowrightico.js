const RightArrowIco = ({ color = "white",className = "", onClick=()=>{}}) => (
    <svg onClick={onClick} className = {`${className} svg-trans`}  viewBox="0 0 22 21" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M13.7248 4.78596C13.4685 4.52968 13.053 4.52968 12.7967 4.78596C12.5404 5.04224 12.5404 5.45776 12.7967 5.71404L15.0769 7.99419C15.6043 8.52161 15.9716 8.88965 16.2344 9.19931C16.4702 9.47704 16.5896 9.67146 16.6541 9.84375H2.76074C2.39831 9.84375 2.10449 10.1376 2.10449 10.5C2.10449 10.8624 2.39831 11.1562 2.76074 11.1562H16.6541C16.5896 11.3285 16.4702 11.523 16.2344 11.8007C15.9716 12.1103 15.6043 12.4784 15.0769 13.0058L12.7967 15.286C12.5404 15.5423 12.5404 15.9577 12.7967 16.214C13.053 16.4703 13.4685 16.4703 13.7248 16.214L16.0049 13.9338L16.0248 13.914C16.5277 13.4111 16.9334 13.0055 17.235 12.6501C17.5456 12.2843 17.7843 11.9289 17.9191 11.5139C18.1332 10.855 18.1332 10.145 17.9191 9.48605C17.7843 9.07112 17.5456 8.7157 17.235 8.34984C16.9334 7.99453 16.5277 7.5889 16.0248 7.086L16.0049 7.06611L13.7248 4.78596Z" />
    </svg>
  );
  
  export default RightArrowIco;