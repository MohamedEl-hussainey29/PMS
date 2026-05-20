import deleteConfirm from '../../../../assets/deleteConfirmation.jpg'
import Modal from 'react-bootstrap/Modal';

interface DeleteConfirmationProps {
  show: boolean;
  handleClose: () => void;
  onDelete: (id: number) => void;
  item: string;
  itemData: {
    id: number;
    title: string;
  } | null;
}

export default function DeleteConfirmation({show,handleClose,onDelete,item,itemData}: DeleteConfirmationProps) {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-danger rounded-circle fw-bold m-3" onClick={handleClose}>X</button>
        </div>
        <Modal.Body>
          <div className="text-center">
          <img src={deleteConfirm} alt="noData" className="img-fluid" style={{width:"250px" ,  height:"250px", objectFit:"contain"}}  />
            <h3 className='my-2' style={{color:'rgba(73, 73, 73, 1)'}}>Delete this {item}!</h3>
            <p style={{color:'rgba(73, 73, 73, 0.6)'}}>are you sure you want to delete {itemData?.title} ? if you are sure just click on delete it</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button  className="btn btn-outline-danger fw-bold" onClick={()=>onDelete(itemData!.id)}>
            Delete this item
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
