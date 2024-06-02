'use client';
import {useState} from "react";
import Image from "next/image";

export default function ImageCapturer() {
    const [image, setImage] = useState('')
    const triggerInput = () => {
        const input = document.getElementById('pictureInput');
        input?.click();
    }

    const takePicture = (event: any) => {
        console.log(event.target.files);
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    return(
        <div>
            <p>Image capturer</p>
            <input id='pictureInput' type="file" accept="image/*" capture="environment" className='hidden' onChange={takePicture}/>
            <button onClick={triggerInput}>take picture</button>

            {
                image &&
                <Image
                    src={image}
                    width={300}
                    height={300}
                    alt='Picture taken from phone'
                />
            }
        </div>
    )
}
