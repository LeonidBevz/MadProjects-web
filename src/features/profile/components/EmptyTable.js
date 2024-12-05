const EmptyTable = ({text, linktext="", linkto}) =>{
    return (
        <div className="table-tile">
            <span>{text}<a href={linkto}>{linktext}</a></span>
        </div>
    )
}
export default EmptyTable