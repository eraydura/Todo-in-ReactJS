import { useState } from "react";
import { storage } from "../firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./todoimage.css";
 
function TodoImage() {
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
 
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
            <p><button className="imageinput" onClick={handleUpload}>Upload to Firebase</button></p>
            <p className="imageinput">{percent} "% done"</p>
        </div>
    );
}
 
export default TodoImage;