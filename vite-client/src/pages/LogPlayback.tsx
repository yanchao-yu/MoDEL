import Bot from '../svgs/bot.svg';
import { Uploader } from "uploader";
import { Link} from 'react-router-dom';
import { UploadButton } from "react-uploader";
import {useEffect, useRef, useState} from 'react';
import * as React from "react";
import xtype from "xtypejs"
import {Tabs, Tab, Form, InputGroup, Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { JsonViewer } from '@textea/json-viewer'


const LogPlayback = () => {

    const [files, setFiles] = useState<File[]>();
    const [data, setData] = useState<any>([]);
    const [input, setInput] = useState<any>('');
    const [userinput_key, setUserInputKey] = useState<any>('');
    const [sysoutput_key, setSysOutputKey] = useState<any>('');
    const [output, setOutput] = useState<any>('');
    const [input_keys, setInputKeys] = useState<any>([]);
    const [output_keys, setOutputKeys] = useState<any>([]);
    const [chats, updateChats]= useState<any>([]);
    const [jsons, setFilterJsons]= useState<any>([]);

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
            updateChats([]);
            setFilterJsons([]);

            reader.onload = function (event: any) {
                const text = event.target.result;
                sortChatData(JSON.parse(text));
            };
            setFiles(filesObject);
        }
    }

    function extracted(d: any, key: string, text: string, role: string) {
        console.log("[extracted] [" + role + "] [" + key + "]: " + text);
        console.log("[extracted]" + Object.keys(jsons).length);
        updateChats((chats: any) => [...chats, {text: text, speaker: role}]);
        setFilterJsons((jsons: any) => [...jsons, d]);
    }

    const sortChatData = (data) =>{
        setData(data);
        const data_type = xtype(data)
        // console.log("xtype: " + data_type)
        // Check whether the system receive a JSON Array
        if (data_type === 'single_elem_array' || data_type === 'multi_elem_array'){
            // iterate each element in the JSON Array
            data.forEach(
                function(d: any){
                    console.log("d: " + JSON.stringify(d))

                    // console.log("cannot find keys")
                    try {
                        const input_sub_keys = userinput_key.split('.');
                        let temp_in_data = Object.assign({}, d);
                        console.log("[Input] temp_in_data: " + JSON.stringify(temp_in_data));
                        console.log("[Input] input_sub_keys: " + input_sub_keys);
                        input_sub_keys.forEach(
                            function (k: any) {
                                console.log("[Input] k: " + k);
                                if (temp_in_data.hasOwnProperty(k)) {
                                    temp_in_data = temp_in_data[k]
                                    console.log("[Input] temp_in_data(k=" + k + "): " + JSON.stringify(temp_in_data))
                                    const tmp_data_type = xtype(temp_in_data)
                                    console.log("[Input] tmp_data_type : " + tmp_data_type)
                                    // if (tmp_data_type === "single_char_string" || tmp_data_type === "multi_char_string" || tmp_data_type === 'empty_string' || tmp_data_type === "whitespace") {
                                    if (["single_char_string","multi_char_string", 'empty_string', "whitespace"].includes(tmp_data_type)) {

                                        if (d.hasOwnProperty('speaker')) {
                                            if (d['speaker'] === 'user') {
                                                console.log("[extracted] from : user 1");
                                                extracted(d, userinput_key, temp_in_data, 'user');
                                                return;
                                            }
                                        }
                                        else{
                                            console.log("[extracted] from : user 2");
                                            extracted(d, userinput_key, temp_in_data, 'user');
                                            return;
                                        }
                                    }
                                    else if (["single_elem_array"].includes(tmp_data_type)){
                                        if (d.hasOwnProperty('speaker')) {
                                            if (d['speaker'] === 'user') {
                                                console.log("[extracted] from : user 3");
                                                extracted(d, userinput_key, temp_in_data[0], 'user');
                                                return;
                                            }
                                        }
                                        else{
                                            console.log("[extracted] from : user 4");
                                            extracted(d, userinput_key, temp_in_data[0], 'user');
                                            return;
                                        }
                                    }
                                } else {
                                    console.log("[extracted] ERROR: "+ temp_in_data);
                                    temp_in_data = {};
                                    throw new Error();
                                }
                            });
                    }
                    catch (e) {
                    }

                    try {
                    const out_sub_keys = sysoutput_key.split('.');
                    let temp_out_data = Object.assign({}, d);
                    console.log("[Output] temp_out_data: " + JSON.stringify(temp_out_data));
                    console.log("[Output] out_sub_keys: " + out_sub_keys);
                    out_sub_keys.forEach(
                        function(k: any){
                            console.log("[Input] k: " + k);
                            if (temp_out_data.hasOwnProperty(k)) {
                                temp_out_data = temp_out_data[k]
                                console.log("[Output] temp_out_data(k="+ k +"): " + JSON.stringify(temp_out_data))
                                const tmp_data_type = xtype(temp_out_data)
                                console.log("[Output] tmp_data_type : " + tmp_data_type)
                                // if (tmp_data_type === "single_char_string" || tmp_data_type === "multi_char_string" || tmp_data_type === 'empty_string' || tmp_data_type === "whitespace") {
                                if (["single_char_string","multi_char_string", 'empty_string', "whitespace"].includes(tmp_data_type)) {
                                    if (d.hasOwnProperty('speaker')) {
                                        if (d['speaker'] === 'bot') {
                                            console.log("[extracted] from : bot 1");
                                            extracted(d, sysoutput_key, temp_out_data,'bot');
                                            return;
                                        }
                                    }
                                    else{
                                        console.log("[extracted] from : bot 2");
                                        extracted(d, sysoutput_key, temp_out_data, 'bot');
                                        return;
                                    }

                                }
                                else if (["single_elem_array"].includes(tmp_data_type)){
                                    if (d.hasOwnProperty('speaker')) {
                                        if (d['speaker'] === 'bot') {
                                            console.log("[extracted] from : bot 3");
                                            extracted(d, userinput_key, temp_out_data[0], 'bot');
                                            return;
                                        }
                                    }
                                    else{
                                        console.log("[extracted] from : bot 4");
                                        extracted(d, userinput_key, temp_out_data[0], 'bot');
                                        return;
                                    }
                                }
                            } else {
                                console.log("[extracted] ERROR: "+ temp_out_data);
                                temp_out_data = {};
                                throw new Error();
                            }
                        });
                    }
                    catch (e) {
                    }
                }
            )
        }
    }

    const enterKeyHandler = (type: string) => {
        const d = type === 'input' ? input : output
        const text = JSON.parse(d || "");
        getKeys(text, type)
    }

    const getKeys = (json: any, stype: string) => {
        let keys: JSX.Element[] = []

        const data_type = xtype(json)
        // Check whether the system receive a JSON Array
        if (data_type === 'single_elem_array' || data_type === 'multi_elem_array'){
            // iterate each element in the JSON Array
            json.forEach(
                function(d: any){
                    let object_keys = Object.keys(d)
                    keys.push(<option value="" selected disabled hidden>Choose here</option>)
                    object_keys.forEach(
                        function(k: any){
                            keys.push(<option key={k} value={k}>{k}</option>)
                            // Check whether the value is another JSON Object
                            const value_type = xtype(json[k])
                            if ( value_type ===  "single_prop_object" || value_type === 'multi_prop_object'){
                                let sub_keys = Object.keys(json[k])
                                let sub_keys_str = sub_keys.length > 0
                                    && sub_keys.map((sub_key, j) => {
                                        keys.push(<option key={k+'.'+j} value={k+'.'+sub_key}>{k+'.'+sub_key}</option>)
                                    });
                            }
                        });
                }
            )
        }

        // Check whether the system receive a JSON Object
        else if ( data_type ===  "single_prop_object" || data_type === 'multi_prop_object'){
            let object_keys = Object.keys(json)
            // iterate each key in the JSON object
            keys.push(<option value="" selected disabled hidden>Choose here</option>)
            object_keys.forEach(
                function(key: any){
                    keys.push(<option key={key} value={key}>{key}</option>)
                    const value_type = xtype(json[key])
                    // Check whether the value is another JSON Object
                    if ( value_type ===  "single_prop_object" || value_type === 'multi_prop_object'){
                        let sub_keys = Object.keys(json[key])
                        sub_keys.forEach(
                            function(sub_key: any){
                                keys.push(<option key={key+'.'+sub_key} value={key+'.'+sub_key}>{key+'.'+sub_key}</option>)
                            });
                    }
                }
            );
        }
        // Add keys and object into the input config
        if (stype === 'input'){
            setInputKeys(keys)
        }
        // Add keys and object into the output config
        else if (stype === 'output'){
            setOutput(json)
            setOutputKeys(keys)
        }
    }

    const AutoScrollConversations = () => {
        const containerRef = useRef();
        useEffect(() => containerRef.current.scrollIntoView());
        return <div style={{ width: "85%" }} ref={containerRef} />;
    };

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
                <Tabs justify className="mb-3">

                    <Tab eventKey="chat" title="Chat Window">
                        <div className="Conversation">
                            <div id="Conversation" className="tabcontent">
                                <div id="chat-window" style={{ height: "50vh" , width:'100%'}}>
                                    {chats?.map((item, index) => (
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
                                                      src='https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
                                                      width={25}
                                                  />
                                              ) : null}
                                            </span>
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
                                    <AutoScrollConversations />
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="log" title="JSON Log">
                        <div className="JSON Response">
                            <div id="JSON" className="tabcontent">
                                <JsonViewer  style={{ height: "50vh" , width:'100%'}}
                                    value={jsons}
                                    theme={"dark"}
                                />
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                <div>
                    <Form.Group className="mb-3" controlId="loginput-form">
                        <InputGroup className="mb-2">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="example of user query in JSONObject"
                                onChange={(e: any) => setInput(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={() => enterKeyHandler("input")}>Go</Button>
                        </InputGroup>
                        <Form.Label>Please tell me where I should provide the user input:</Form.Label>
                        <Form.Select
                            value={userinput_key}
                            onChange={(e) => setUserInputKey(e.target.value)}
                        >
                            {input_keys}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="logoutput_form">
                        <Form.Label>Please provide an server output example (JSON object)</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="example of system response in JSONObject"
                                onChange={(e: any) => setOutput(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={() => enterKeyHandler("output")}>Go</Button>
                        </InputGroup>
                        <Form.Label>Please tell me where I can find the system response:</Form.Label>
                        <Form.Select
                            value={sysoutput_key}
                            onChange={(e) => setSysOutputKey(e.target.value)}
                        >
                            {output_keys}
                        </Form.Select>
                    </Form.Group>
                </div>

                {sysoutput_key && userinput_key ? (
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