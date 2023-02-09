import * as React from 'react';
import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";

export default function LogUploader({ session_id }) {
    // Initialize once (at the start of your app).
    const uploader = Uploader({
        apiKey: "free" // Get production API keys from Upload.io
    });

    // Configuration options: https://upload.io/uploader#customize
    const options = { multi: true };

  return (
    <div>
        <UploadButton uploader={uploader}
                      options={options}
                      onComplete={files => alert(files.map(x => x.fileUrl).join("\n"))}>
            {({onClick}) =>
                <button onClick={onClick}>
                    Upload a file...
                </button>
            }
        </UploadButton>
    </div>
  );
}
