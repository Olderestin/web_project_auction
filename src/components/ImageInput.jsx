import { useState } from "react"
import '../styles/ImageInput.scss'


function ImageInput({ auctionImages, setAuctionImages }) {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleImageChange = (e) => {
        setAuctionImages((prevImages) => {
            const updatedImages = prevImages.concat(...e.target.files);
            console.log('Updated Auction Images:', updatedImages);
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
    
      const renderPhotos = (source) => {
        return source.map((photo) => {
          return <img src={photo} alt="" key={photo} />;
        });
      };

    return (
        <>
        <label className="custom-file-upload">
          <input type="file" id="file" multiple accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
          <i></i> Upload photos
        </label> 
            <div className="result">{renderPhotos(selectedFiles)}</div>
        </>
      );
}

export default ImageInput;