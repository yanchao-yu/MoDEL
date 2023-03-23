import Bot from '../svgs/bot.svg';
import UserIcon from '../assets/profile.svg'
import { Uploader } from "uploader";
import { Link, useParams } from 'react-router-dom';
import { UploadButton } from "react-uploader";
import { useState } from 'react';
import Dropdown from "react-dropdown";
import * as React from "react";
import Select from "react-select";
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import {sampleInputData, sampleOutputData} from '../hooks/sampleData'



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
        if (e?.key === 'Enter') {
            const d = type === 'input' ? input : output
            const text = JSON.parse(d || "");
            getKeys(text, type)
        }
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

    return (
        <div style={{ width: '80%', margin: "0 auto" }}>

            <Link className="nav-link" to="/home">
                &#8592; Back to Home Page
            </Link>
            <div>
                <div className="bot-information text-center">
                    <h3>
                        <img src={Bot} width={20} /> {"Log PlayBack"}
                    </h3>
                </div>
                <div id="chat-window" style={{ height: "60vh" , width:'100%'}}>
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
                    <div>
                        <label>Please provide an server input example (JSON object) </label>
                        <textarea className='logplaybackInput'
                                id={"user_input_json"}
                                name="input"
                               // type={"text"}
                                style={{height: '20%', width:'100%'}}
                                onKeyDown={(e) => enterKeyHandler(e, "input")}
                                  onChange={(e: any) => setInput(e.target.value)} />
                    </div>
                    <div>
                        <label>Please tell me where I should provide the user input: </label>
                        <select
                            className="styled-select"
                            name="UserInputKey"
                            id="UserInputKey"
                            style={{ width: '40%', margin: "0 auto" }}
                            onChange={(e) => setUserInputKey(e.target.value)}
                        >
                            {input_keys}
                        </select>

                    </div>
                    <div>
                        <label>Please provide an server output example (JSON object) </label>
                        <textarea className='logplaybackInput'
                                id={"sys_output_json"}
                                name="input"
                                style={{height: '20%', width:'100%'}}
                                onKeyDown={(e) => enterKeyHandler(e, "output")}
                                  onChange={(e: any) => setOutput(e.target.value)} />
                    </div>
                    <div>
                        <label>Please tell me where I can find the system response: </label>
                        <select className="styled-select"
                                name="SysOutputKey"
                                id="SysOutputKey"
                                style={{ width: '40%', margin: "0 auto" }}
                                onChange={(e) => setSysOutputKey(e.target.value)}
                        >
                            {output_keys}
                        </select>
                    </div>
                </div>

                {input && output && sysoutput_key && userinput_key ? (
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
                ) : null}
            </div>
        </div>
    );
}

export default LogPlayback;