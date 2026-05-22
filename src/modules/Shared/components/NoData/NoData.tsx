import noDataImg from '../../../../assets/Adobe Express - file.png'
export default function NoData() {
  return (
    <>
    <div className='text-center'>
      <img className='w-25 h-25' src={noDataImg} alt="noData" />
      <h3 className='my-2' style={{color:'rgba(73, 73, 73, 1)'}}>No Data!</h3>
      <p style={{color:'rgba(73, 73, 73, 0.6)'}}>There is no Data to Show here!</p>
    </div>
    </>
  )
}
