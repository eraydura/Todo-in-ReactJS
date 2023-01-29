import { useState } from "react";
import { storage } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./todoimage.css";
 
function TodoImage()  {
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [finish, setFinish] = useState(false);
    const navigate = useNavigate();
 
    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    const handleUpload = () => {
        if (!file) {
            alert("Please upload an image first!");
        }
        const uid= window.location.href.split("?")[1].split(":")[1]
        const storageRef = ref(storage, `/files/${uid}.png`);
        const uploadTask = uploadBytesResumable(storageRef, file);
 
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
 
                // update progress
                setPercent(percent);
                if(percent==100){
                  setFinish(true);
                }
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                });
            }
        );
    };
 
    return (
        <div>
            <input className="imageinput" type="file" onChange={handleChange} accept="/image/*" />
            <button className="imageinput" onClick={handleUpload}>Upload to Firebase</button>
            <p className="imageinput"> { finish!=true ? percent +'% done' :  'Refresh the page' }</p>
        </div>
    );
}

export default TodoImage;
