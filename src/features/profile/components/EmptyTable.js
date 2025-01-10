const EmptyTable = ({text, linktext="", linkto}) =>{
    return (
        <span>{text}<a href={linkto}>{linktext}</a></span>
    )
}
export default EmptyTable