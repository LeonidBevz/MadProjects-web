const ChatAddIco = ({ color = "white", className = "", onClick=()=>{}}) => (
    <svg onClick={onClick} className = { className } stroke={color} fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.73307 12.4094L4.74905 11.6889L4.75652 11.6838C4.96833 11.5336 5.07521 11.4578 5.19445 11.4038C5.30144 11.3553 5.41552 11.32 5.5332 11.2986C5.66585 11.2745 5.80402 11.2745 6.08138 11.2745H11.8687C12.614 11.2745 12.9871 11.2745 13.272 11.1457C13.5229 11.0324 13.727 10.8514 13.8548 10.629C14 10.3764 14 10.046 14 9.3853V4.88948C14 4.22875 14 3.8979 13.8548 3.64529C13.727 3.42287 13.5225 3.24216 13.2716 3.12884C12.9864 3 12.6135 3 11.8668 3H4.13347C3.38673 3 3.01308 3 2.72787 3.12884C2.47698 3.24216 2.27315 3.42287 2.14533 3.64529C2 3.89815 2 4.2294 2 4.89143V11.6712C2 12.301 2 12.6159 2.14564 12.7777C2.2723 12.9183 2.46429 13.0002 2.66732 13C2.90077 12.9998 3.17829 12.8029 3.73307 12.4094Z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 7.05882H10.1176" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.05859 5L8.05859 9.11765"  strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  
  export default ChatAddIco;