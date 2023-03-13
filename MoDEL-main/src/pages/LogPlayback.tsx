import Bot from '../svgs/bot.svg';
import UserIcon from '../assets/profile.svg'
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { useState } from 'react';
const botIcon = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';

const LogPlayback = () => {

    const [files, setFiles] = useState<File[]>();
    const [data, setData] = useState<any>([]);
    const [input, setInput] = useState<any>('');
    const [output, setOutput] = useState<any>('');

    const uploader = Uploader({
        apiKey: "free" // Get production API keys from Upload.io
    });

    const onCompleteSuccess = (files: any) => {
        if (files.length) {
            const filesObject: File[] = [];
            const reader = new FileReader();

            files.map((file: any) => {
                const fileExt = file.originalFile.mime.split('/')[1];
                console.log('File extension is ' + fileExt);
                filesObject.push(file.originalFile.file);
                reader.readAsText(file.originalFile.file);
            })
            reader.onload = function (event: any) {
                const text = event.target.result;
                setData(JSON.parse(text));
            };
            setFiles(filesObject);
        }
    }

    const enterKeyHandler = (e: any, type: string) => {
        console.log({ value: e.target.value, key: e.key })
        if (e?.key === 'Enter') {
            const d = type === 'input' ? input : output
            const text = JSON.parse(d || "");
            setData((preState: any) => ([...preState, text]))
        }
    }

    console.log({ data });

    return (
        <div style={{ width: 400, margin: "0 auto" }}>
            <div>
                <div className="bot-information text-center">
                    <h3>
                        <img src={Bot} width={20} /> {"CoronaBot Demo"}
                    </h3>
                </div>
                <div id="chat-window" style={{ height: "60vh" }}>
                    {data?.map((item: any, index: number) => (
                        <div
                            key={index}
                            style={{
                                borderRadius: 20,
                                margin: '5px 15px',
                                textAlign: 'left',
                                position: 'relative',
                                alignSelf: item.speaker === 'bot' ? 'start' : 'end',
                            }}
                        >
                            <span style={{ display: 'inline-block', marginRight: 5 }}>
                                {item.speaker === 'bot' ? (
                                    <img
                                        src={'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'}
                                        width={25}
                                    />
                                ) : <img
                                    src={UserIcon}
                                    width={25}
                                />
                                }</span>
                            <span
                                style={{
                                    background: item.speaker === 'bot' ? 'aliceblue' : '#f2f2f1',
                                    padding: 8,
                                    display: 'inline-block',
                                    maxWidth: 220,
                                    borderRadius:
                                        item.speaker === 'bot'
                                            ? '2px 12px 12px 12px'
                                            : '12px 2px 12px 12px',
                                }}
                            >
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div>
                    <p>"speaker":"bot","text": "..."</p>
                    <div>
                        <label>Please provide an server input example (JSON object) </label>
                        <input className='logplaybackInput' name="input" type={"text"} onKeyDown={(e) => enterKeyHandler(e, "input")} onChange={(e: any) => setInput(e.target.value)} />
                    </div>
                    <div>
                        <label>Please provide an server output example (JSON object) </label>
                        <input className='logplaybackInput' name="input" type={"text"} onKeyDown={(e) => enterKeyHandler(e, "output")} onChange={(e: any) => setOutput(e.target.value)} />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <UploadButton uploader={uploader}
                        onComplete={onCompleteSuccess}>
                        {({ onClick }) =>
                            <button className='logPlayback' onClick={onClick}>
                                Upload Log File
                            </button>
                        }
                    </UploadButton>
                </div>
            </div>
        </div>
    );
}

export default LogPlayback;