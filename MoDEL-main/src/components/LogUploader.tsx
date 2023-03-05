import * as React from 'react';
import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";
import { ChangeEvent, useState } from 'react';
import { DataContext } from '../app/store'

export default function LogUploader({ session_id }) {
    const [files, setFiles] = useState<File[]>();

    const dataCtx =React.useContext(DataContext)
    const { setData } = dataCtx;
    console.log({files})
    // Initialize once (at the start of your app).
    const uploader = Uploader({
        apiKey: "free" // Get production API keys from Upload.io
    });

    // Configuration options: https://upload.io/uploader#customize
    const options = { multi: true };

    const onCompleteSuccess = (files: any) => {
        if (files.length) {
            const filesObject: File[] = [];
            const reader = new FileReader();

            files.map((file : any) => {
                const fileExt = file.originalFile.mime.split('/')[1];
                console.log('File extension is '+fileExt);
                filesObject.push(file.originalFile.file);
                reader.readAsText(file.originalFile.file);
            })
            reader.onload = function(event : any) {
                const text = event.target.result;
                const lines = text.split('\n');
                setData(lines);
              };
            setFiles(filesObject);
        }
    }

  return (
    <div>
        <UploadButton uploader={uploader}
                      options={options}
                      onComplete={onCompleteSuccess}>
            {({onClick}) =>
                <button onClick={onClick}>
                    Upload a file...
                </button>
            }
        </UploadButton>
    </div>
  );
}
