import { useState } from "react"
import '../styles/ImageInput.scss'


function ImageInput({ auctionImages, setAuctionImages }) {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleImageChange = (e) => {
        setAuctionImages((prevImages) => {
            const updatedImages = prevImages.concat(...e.target.files);
            return updatedImages;
        });

        if (e.target.files) {
          const filesArray = Array.from(e.target.files).map((file) =>
            URL.createObjectURL(file)
          );
        
          setSelectedFiles((prevImages) => prevImages.concat(filesArray));
          Array.from(e.target.files).map(
            (file) => URL.revokeObjectURL(file)
          );
        }
      };
    
    return (
        <>
        <label className="custom-file-upload">
          <input type="file" id="file" multiple accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
          <i></i> Upload photos
        </label> 
            <div className="result">{
              selectedFiles.map((photo, index) => {
                return (
                <>
                <div className="img-and-delete-container">
                  <img src={photo} alt="" key={photo} />
                  <button type='button' onClick={() => {
                    setSelectedFiles((prevImages) => {
                      const updatedFiles = [...prevImages];
                      updatedFiles.splice(index, 1);
                      return updatedFiles;
                    });
                    setAuctionImages((prevImages) => {
                      const updatedFiles = [...prevImages];
                      updatedFiles.splice(index, 1);
                      return updatedFiles;
                    });
                  }}>Delete</button>
                </div>
                </>
                );
              })
            }</div>
        </>
      );
}

export default ImageInput;