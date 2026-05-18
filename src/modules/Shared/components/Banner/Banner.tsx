import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Banner() {
  return <>
   <div className="banner bg-white position-relative mt-3">
    <div className="">
        <div className="row">
            <div className="col-md-6">
                <div className="inner bg-white rounded rounded-4 shadow p-4">

                   <div className="banner-title">
                     <h4>Tasks</h4>
                    <p style={{color: '#6F7881'}}>Lorem ipsum dolor sit amet,consecteture</p>
                   </div>

                   <div className="d-flex mt-5">
                    <div className="col-md-3">
                        <div className="inner py-3 px-4" style={{backgroundColor: '#E5E6F4'}}>
                            <span className="bg-danger" style={{width: '90px', height: '30px'}} >
                                <FontAwesomeIcon  icon={faChartSimple} style={{width: '30px', height: '30px'}}/></span>
                            <h5>Progress</h5>
                            <span>$ 7328.32</span>
                        </div>
                    </div>
                   </div>
                </div>
            </div>
            
        </div>
    </div>

   </div>
  
  </>
}
