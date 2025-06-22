import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";


const User = () => {
  const [items, setItem] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsDetails, setItemsDetails] = useState({ name: "", type: "", description: "" });
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImage, setAdditionalImage] = useState([]);

  const itemModalRef = useRef(null);
  const addModalRef = useRef(null);

  const handleAddItemChange = (e) => {
    if (e.target.name === 'coverImage') {
      setCoverImage(e.target.files[0]);
    } else if (e.target.name === 'additionalImage') {
      setAdditionalImage(Array.from(e.target.files));
    } else {
      setItemsDetails({ ...itemsDetails, [e.target.name]: e.target.value });
    }
  };

  const onEnquireClick = async(itemId)=>{
    try {
      const URL = `http://localhost:4000/api/v1/user/enquire/${itemId}`;
      const response  = await fetch(URL,{
        method:"GET",
        headers:{
          "auth-token":localStorage.getItem('token'),
        }
      })
      const data = await response.json();
      if(response.ok){
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, type, description } = itemsDetails;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
      formData.append('description', description);
      formData.append('itemImage', coverImage);
      additionalImage.forEach((file) => {
        formData.append('additionalImage', file);
      });

      const URL = "http://localhost:4000/api/v1/user/add-item";
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem('token')
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setItemsDetails({ name: "", type: "", description: "" });
        setCoverImage(null);
        setAdditionalImage([]);
        getItems();
        const modalInstance = Modal.getInstance(addModalRef.current);
        if (modalInstance) modalInstance.hide();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      const modal = new Modal(itemModalRef.current);
      modal.show();
    }, 100);
  };

  const getItems = async () => {
    try {
      const URL = "http://localhost:4000/api/v1/user/get-items";
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem('token'),
        }
      });
      const data = await response.json();
      if (response.ok) {
        setItem(data.item);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <div className='container my-3'>
        <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#exampleModal1">Add Item</button>
        <div className='row'>
          {items.map((item) => {
            const carouselId = `carousel-${item._id}`;
            const allImages = [item.itemImage, ...(item.additionalImage || [])];

            return (
              <div className='col-12 col-md-3 my-3' key={item._id}>
                <div className="card" style={{ width: "18rem", cursor: "pointer" }} onClick={() => handleCardClick(item)}>
                  <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          data-bs-target={`#${carouselId}`}
                          data-bs-slide-to={index}
                          className={index === 0 ? "active" : ""}
                          aria-current={index === 0 ? "true" : undefined}
                          aria-label={`Slide ${index + 1}`}
                        ></button>
                      ))}
                    </div>
                    <div className="carousel-inner">
                      {allImages.map((img, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                          <img src={img} className="d-block w-100" alt={`Slide ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                    {allImages.length > 1 && (
                      <>
                        <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="card-body" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{handleCardClick}}>
                    <h5 className="card-title">{item.name}</h5>
                    <p className="text-muted">{item.type}</p>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={itemModalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {selectedItem && (
              <>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">{selectedItem.name}</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="card-body">
                    <div id={`modal-carousel-${selectedItem._id}`} className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-indicators">
                        {[selectedItem.itemImage, ...(selectedItem.additionalImage || [])].map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            data-bs-target={`#modal-carousel-${selectedItem._id}`}
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}`}
                          ></button>
                        ))}
                      </div>
                      <div className="carousel-inner">
                        {[selectedItem.itemImage, ...(selectedItem.additionalImage || [])].map((img, index) => (
                          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <img src={img} className="d-block w-100" alt={`Slide ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                      {selectedItem.additionalImage && selectedItem.additionalImage.length > 0 && (
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target={`#modal-carousel-${selectedItem._id}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target={`#modal-carousel-${selectedItem._id}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                    <h5 className="card-title mt-3">{selectedItem.name}</h5>
                    <p className="text-muted">{selectedItem.type}</p>
                    <p className="card-text">{selectedItem.description}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={()=>{onEnquireClick(selectedItem._id)}}>Enquire</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={addModalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add Item</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddItemSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Item name:</label>
                  <input type="text" className="form-control" id="name" name='name' onChange={handleAddItemChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Item Type:</label>
                  <input type="text" className="form-control" id="type" name='type' onChange={handleAddItemChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Item Description:</label>
                  <input type="text" className="form-control" id="description" name='description' onChange={handleAddItemChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="itemImage" className="form-label">Cover Image (Required):</label>
                  <input type="file" className="form-control" id="itemImage" name='coverImage' required onChange={handleAddItemChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="additionalImage" className="form-label">Additional Image (Optional):</label>
                  <input type="file" className="form-control" id="additionalImage" name='additionalImage' multiple onChange={handleAddItemChange} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
