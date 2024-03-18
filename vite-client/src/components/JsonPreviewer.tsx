// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../app/configContext";
import { Button, Form, InputGroup} from "react-bootstrap";
import Preloader from "./Preloader.js";
import xtype from 'xtypejs'
import { JSX } from 'react/jsx-runtime';

const JsonPreviewer = () => {
    const config = useContext(ConfigContext);
    const [bot_name, setBotName] = useState(config.chatData?.bot_name);
    const [bot_intro, setBotIntro] = useState(config.chatData?.bot_intro);
    const [development_platofrm, setPlatform] = useState("custom server");
    const [loading, setLoading] = useState(false);

    const [botIcon, setBotIcon] = useState(config.chatData?.botIcon);
    const [serverURL, setServerURL] = useState(config.chatData?.serverURL);
    const [input, setInput] = useState(config.chatData?.input);
    const [userInputObj, setInputObj] = useState(config.chatData?.userInputObj);
    const [userinput_key, setUserInputKey] = useState(config.chatData?.userinput_key);
    const [sysoutput_key, setSysOutputKey] = useState(config.chatData?.sysoutput_key);
    const [output, setOutput] = useState(config.chatData?.output);
    const [input_keys, setInputKeys] = useState(config.chatData?.input_keys);
    const [output_keys, setOutputKeys] = useState(config.chatData?.output_keys);

    const enterKeyHandler = (type: string) => {
        const d = type === 'input' ? input : output
        const text = JSON.parse(d || "");
        getKeys(text, type)
    }

    const getKeys = (json: {}[], stype: string) => {
        let keys: JSX.Element[] = []

    const data_type = xtype(json)
    // Check whether the system receive a JSON Array
    if (data_type === 'single_elem_array' || data_type === 'multi_elem_array'){
      // iterate each element in the JSON Array
      json.forEach(
          function(d: {}){
            let object_keys = Object.keys(d)
            object_keys.forEach(
                function(k){
                  keys.push(<option key={k} value={k}>{k}</option>)
                  // Check whether the value is another JSON Object
                  const value_type = xtype(json[k])
                  if ( value_type ===  "single_prop_object" || value_type === 'multi_prop_object'){
                    let sub_keys = Object.keys(json[k])
                    let sub_keys_str = sub_keys.length > 0
                        && sub_keys.map((sub_key, j) => {
                          keys.push(<option key={k+'.'+j} value={k+'.'+sub_key}>{k+'.'+sub_key}</option>)
                        });
                    console.log('sub_keys_str: ' + sub_keys_str)
                  }
                });
          }
      )
    }
    // Check whether the system receive a JSON Object
    else if ( data_type ===  "single_prop_object" || data_type === 'multi_prop_object'){
      let object_keys = Object.keys(json)
      // iterate each key in the JSON object
      object_keys.forEach(
          function(key: string){
            keys.push(<option key={key} value={key}>{key}</option>)
            const value_type = xtype(json[key])
            // Check whether the value is another JSON Object
            if ( value_type ===  "single_prop_object" || value_type === 'multi_prop_object'){
              let sub_keys = Object.keys(json[key])
              sub_keys.forEach(
                  function(sub_key){
                    keys.push(<option value={key+'.'+sub_key}>{key+'.'+sub_key}</option>)
                  });
            }
          }
      );
    }
    // Add keys and object into the input config
    if (stype === 'input'){
      setInputObj(json)
      setInputKeys(keys)
    }
    // Add keys and object into the output config
    else if (stype === 'output'){
      setOutput(json)
      setOutputKeys(keys)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e?.preventDefault();
      config.setSelectedChatOption("");
    setLoading(true);
    config.setChatData({
        "id": "",
        "development_platofrm": development_platofrm,
        "bot_name": bot_name,
        "bot_intro": bot_intro,
        "botIcon": botIcon,
        "serverURL": serverURL,
        "input":  input,
        "userInputObj": userInputObj,
        "userinput_key": userinput_key,
        "sysoutput_key": sysoutput_key,
        "output": output,
        "input_keys": input_keys,
        "output_keys": output_keys,
    })
  };

  return loading ? (
    <Preloader />
  ) : (
    <>
        <div className="w-100">
            <Form.Group className="mb-3" controlId="bot_form">
                <Form.Label> Bot Name </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="AstroBot"
                    onChange={(e: any) => setBotName(e.target.value)}
                />
                <Form.Label> Bot Intro </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Hello, I am AstroBot. Ask me anything about astronomy"
                    onChange={(e: any) => setBotIntro(e.target.value)}
                />
                <Form.Label>Bot Icon (URL)</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                    onChange={(e: any) => setBotIcon(e.target.value)}
                />
                <Form.Label>Server URL (Endpoint)</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="https://kpfm2b.sse.codesandbox.io/"
                    onChange={(e: any) => setServerURL(e.target.value)}
                />
            </Form.Group>
            <div>
                <Form.Group className="mb-3" controlId="input_form">
                    <Form.Label>Please provide an user input example (JSON object)</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Type an example of user query in JSONObject and press 'Go'"
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

                <Form.Group className="mb-3" controlId="ourput_form">
                    <Form.Label>Please provide an server output example (JSON object)</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Type an example of system response in JSONObject and press 'Go'"
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

                <Button type="submit" disabled={loading} onClick={handleSubmit}>
                    Save
                </Button>
            </div>
        </div>
    </>
  );
};

export default JsonPreviewer;
