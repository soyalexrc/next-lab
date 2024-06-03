'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
// import Tesseract from "tesseract.js";

export default function ImageCapturer() {
    const [result, setResult] = useState<any>()
    const triggerInput = () => {
        const input = document.getElementById('pictureInput');
        input?.click();
    }

    const takePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        const fileUrl = URL.createObjectURL(file);
        const formData = new FormData();

        formData.append('image', file)

        const fileBase64: any = await toBase64(file)

        const response = await fetch('/api/image-text-detector/analyzeimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: fileBase64.split(',')[1]
            })
        });

        const json = await response.json();
        console.log(json);
        setResult(json);
    }

        const toBase64 = (file: File) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();

                fileReader.readAsDataURL(file);

                fileReader.onload = () => {
                    resolve(fileReader.result);
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
        };


    return(
        <div>
            <input id='pictureInput' type="file" accept="image/*" capture="environment" className='hidden' onChange={takePicture}/>
            <button onClick={triggerInput}>take picture</button>

            {
                result &&
                <p>
                    {JSON.stringify(result, null, 2)}
                </p>
            }
        </div>
    )
}
