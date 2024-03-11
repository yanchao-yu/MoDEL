// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../app/configContext";
import { Button, Form, InputGroup} from "react-bootstrap";
import Preloader from "./Preloader.js";
import xtype from 'xtypejs'
import { JSX } from 'react/jsx-runtime';

const JsonPreviewer = () => {
    const {
        chatData,
        updateChatData,
        setEditedChatOptions,
        setSelectedChatOption,
        editedChatOptions,
        selectedChatOption,
    } = useContext(ConfigContext);
    const [name, setName] = useState(chatData?.bot_name);
    const [intro, setIntro] = useState(chatData?.bot_intro);
    const [platform, setPlatform] = useState(chatData?.development_platofrm);
    const [loading, setLoading] = useState(false);

    const [botIcon, setBotIcon] = useState(chatData?.botIcon);
    const [serverURL, setServerURL] = useState(chatData?.serverURL);
    const [input, setInput] = useState(chatData?.input);
    const [userInputObj, setInputObj] = useState(chatData?.userInputObj);
    const [userinput_key, setUserInputKey] = useState(chatData?.userinput_key);
    const [sysoutput_key, setSysOutputKey] = useState(chatData?.sysoutput_key);
    const [output, setOutput] = useState(chatData?.output);
    const [input_keys, setInputKeys] = useState(chatData?.input_keys);
    const [output_keys, setOutputKeys] = useState(chatData?.output_keys);

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
          function(key){
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

  useEffect(() => {
    chatData && setEditedChatOptions(chatData);
  }, [chatData]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSelectedChatOption("");
    setLoading(true);
    return updateChatData()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return loading ? (
    <Preloader />
  ) : (
    <>
      {/* {selectedChatOption && <GoBackButton />} */}
      <div className="w-100">
        <h1 className="fw_bolder">Bot Integration</h1>
        <hr />
        <form onSubmit={(e) => handleSubmit(e)} className="w-100">
          <div className="form-group py-2">
            <label htmlFor="exampleFormControlInput1">
              Development Platform*
            </label>
            <select
                className="form-control form-control-lg"
                onChange={(e) => {
                setPlatform(e.target.value);
                setEditedChatOptions({
                  ...chatData,
                  development_platofrm: e.target.value,
                });
              }}
              required
            >
              <option value={"custom server"}>Custom Server</option>
            </select>
          </div>
          <div className="form-group py-2">
            <label htmlFor="exampleFormControlInput1">Bot Name*</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="AstroBot"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setEditedChatOptions({
                  ...chatData,
                  bot_name: e.target.value,
                });
              }}
              required
            />
          </div>
          <div className="form-group py-2">
            <label htmlFor="exampleFormControlInput1">Bot Intro*</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="hai, I am astro bot and you can ask me anything about astro"
              value={intro}
              onChange={(e) => {
                setIntro(e.target.value);
                setEditedChatOptions({
                  ...chatData,
                  bot_intro: e.target.value,
                });
              }}
              required
            />
          </div>
          <div>
            <Form.Group className="mb-3" controlId="bot_form">
              <Form.Label>Bot Icon (URL)</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                  value={botIcon}
                  onChange={(e) => {
                    setBotIcon(e.target.value);
                    setEditedChatOptions({
                      ...chatData,
                      botIcon: e.target.value,
                    });
                  }}
                  // onChange={(e: any) => setBotIcon(e.target.value)}
              />
              <Form.Label>Server URL (Endpoint)</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="https://kpfm2b.sse.codesandbox.io/"
                  value={serverURL}
                  onChange={(e) => {
                    setServerURL(e.target.value);
                    setEditedChatOptions({
                      ...chatData,
                      serverURL: e.target.value,
                    });
                  }}
                  // onChange={(e: any) => setServerURL(e.target.value)}
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
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setEditedChatOptions({
                          ...chatData,
                          input: e.target.value,
                        });
                      }}
                      // onChange={(e: any) => setInput(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={() => enterKeyHandler("input")}>Go</Button>
                </InputGroup>
                <Form.Label>Please tell me where I should provide the user input:</Form.Label>
                <Form.Select
                    value={userinput_key}
                    onChange={(e) => {
                      setUserInputKey(e.target.value);
                      setEditedChatOptions({
                        ...chatData,
                        userinput_key: e.target.value,
                      });
                    }}
                    // onChange={(e) => setUserInputKey(e.target.value)}
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

                      value={output}
                      onChange={(e) => {
                        setOutput(e.target.value);
                        setEditedChatOptions({
                          ...chatData,
                          output: e.target.value,
                        });
                      }}
                      // onChange={(e: any) => setOutput(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={() => enterKeyHandler("output")}>Go</Button>
                </InputGroup>
                <Form.Label>Please tell me where I can find the system response:</Form.Label>
                <Form.Select
                    value={sysoutput_key}
                    onChange={(e) => {
                      setSysOutputKey(e.target.value);
                      setEditedChatOptions({
                        ...chatData,
                        sysoutput_key: e.target.value,
                      });
                    }}
                    // onChange={(e) => setSysOutputKey(e.target.value)}
                >
                  {output_keys}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            Save
          </Button>
        </form>
      </div>
    </>
  );
};

export default JsonPreviewer;
