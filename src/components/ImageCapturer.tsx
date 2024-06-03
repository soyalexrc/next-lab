'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
// import Tesseract from "tesseract.js";

export default function ImageCapturer() {
    const [result, setResult] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>(null);
    const [debug, setDebug] = useState<any>({})

    const triggerInput = () => {
        const input = document.getElementById('pictureInput');
        input?.click();
    }

    const takePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const file = event.target.files![0];
        const fileUrl = URL.createObjectURL(file);
        const formData = new FormData();



        formData.append('image', file)

        const fileBase64: any = await toBase64(file)

        setDebug({
            files: event.target.files,
            imageBase64: fileBase64
        });

        await fetch('/api/image-text-detector/analyzeimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: fileBase64.split(',')[1]
            })
        }).then(async response => {
            const json = await response.json();
            setResult(json);
        }).catch(err => {
            setError(err);
        }).finally(() => {
            setLoading(false)
        })

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

    if (loading) {
        return (
            <div>loading...</div>
        )
    }

    if (error) {
        return (
            <div>
                {JSON.stringify(error, null, 2)}
            </div>
        )
    }


    return(
        <div>
            <input id='pictureInput' type="file" accept="image/*"  className='hidden' onChange={takePicture}/>
            <button onClick={triggerInput}>take picture</button>

            <pre>{JSON.stringify(debug, null, 2)}</pre>

            {
                result &&
                <p>
                    {JSON.stringify(result, null, 2)}
                </p>
            }
        </div>
    )
}
