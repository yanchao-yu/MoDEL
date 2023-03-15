import Bot from '../svgs/bot.svg';
import UserIcon from '../assets/profile.svg'
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { useState } from 'react';
import Dropdown from "react-dropdown";
import * as React from "react";
import Select from "react-select";



const botIcon = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';

const LogPlayback = () => {

    const [files, setFiles] = useState<File[]>();
    const [data, setData] = useState<any>([]);
    const [input, setInput] = useState<any>('');
    const [userinput_key, setUserInputKey] = useState<any>('');
    const [sysoutput_key, setSysOutputKey] = useState<any>('');
    const [output, setOutput] = useState<any>('');
    const [input_keys, setInputKeys] = useState<any>([]);
    const [output_keys, setOutputKeys] = useState<any>([]);

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
        // console.log({ value: e.target.value, key: e.key })
        if (e?.key === 'Enter') {
            const d = type === 'input' ? input : output
            const text = JSON.parse(d || "");
            getKeys(text, type)
        }
    }

    const getKeysFromInput = () => {
        const object = JSON.parse(input|| "");
        let object_keys = Object.keys(object)
        let keys_object = object_keys.length > 0
            && object_keys.map((item, i) => {
                return (
                    <option key={i} value={item}>{item}</option>
                )
            }, this);
        return keys_object
    }

    const getKeysFromOutput = () => {
        const object = JSON.parse(output|| "");
        let object_keys = Object.keys(object)
        let keys_object = object_keys.length > 0
            && object_keys.map((item, i) => {
                return (
                    <option key={i} value={item}>{item}</option>
                )
            }, this);
        return keys_object
    }

    const getKeys = (json_str: any, stype: string) => {
        let object_keys = Object.keys(json_str)
        let keys_object = object_keys.length > 0
            && object_keys.map((item, i) => {
                return (
                    <option key={i} value={item}>{item}</option>
                )
            }, this);

        console.log("keys_object: " + keys_object)
        if (stype === 'input'){
            setInputKeys(keys_object)
        }
        else if (stype === 'output'){
            setOutputKeys(keys_object)
        }
    }


    const onInputSelect = (option: any) => {
        setUserInputKey(option.value)
    }
    const onOutputSelect = (option: any) => {
        setSysOutputKey(option.value)
    }

    const handleInputChange = (input: string) => {
        console.log(input);
        // setOptions(
        //     initialOptions.filter(opt => {
        //         console.log(opt);
        //         return (
        //             opt && opt.value && opt.value.contains && opt.value.contains(input)
        //         );
        //     })
        // );
    };

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
                        <input className='logplaybackInput' id={"user_input_json"} name="input" type={"text"} onKeyDown={(e) => enterKeyHandler(e, "input")} onChange={(e: any) => setInput(e.target.value)} />
                    </div>
                    <div>
                        <label>Please tell me where I should provide the user input: </label>
                        <select
                            className="styled-select"
                            name="UserInputKey"
                            id="UserInputKey"
                            onChange={(e) => setUserInputKey(e.target.value)}
                        >
                            {input_keys}
                        </select>

                    </div>
                    <div>
                        <label>Please provide an server output example (JSON object) </label>
                        <input className='logplaybackInput' id={"sys_output_json"} name="input" type={"text"} onKeyDown={(e) => enterKeyHandler(e, "output")} onChange={(e: any) => setOutput(e.target.value)} />
                    </div>
                    <div>
                        <label>Please tell me where I can find the system response: </label>
                        <select className="styled-select"
                                name="SysOutputKey"
                                id="SysOutputKey"
                                onChange={(e) => setSysOutputKey(e.target.value)}>
                            {output_keys}
                        </select>
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