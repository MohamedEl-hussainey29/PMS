import noDataImg from "../../../../assets/Adobe Express - file.png";
 interface NoDataProps{
  item : string;
 }
export default function NoData({item = "Data"}:NoDataProps) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center px-3 py-4"
      style={{minHeight: "250px",}}
    >
      <img src={noDataImg} alt="noData" className="img-fluid"
        style={{width: "140px",maxWidth: "60%",objectFit: "contain"}}
      />
      <h3 className="mt-3 mb-2 fw-bold" style={{ color: "rgba(73, 73, 73, 1)", fontSize: "clamp(20px, 4vw, 28px)"}} >
        No {item}!
      </h3>
      <p className="mb-0" style={{ color: "rgba(73, 73, 73, 0.6)", fontSize: "clamp(14px, 2vw, 16px)", maxWidth: "320px"}}>
        There are no {item} to show here!
      </p>
    </div>
  );
}
