import * as React from 'react';
import { useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { postData, generateString } from '../utils';
import Webcam from "react-webcam";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Darkmode from 'drkmd-js'
import xtype from 'xtypejs'

import {sampleInputData, sampleOutputData} from '../hooks/sampleData'
import {Button, Form, InputGroup} from "react-bootstrap";

export default function SetupForm({ display_area = true, webcam = true}) {
    const template = useParams();
    // console.log("template -> template", template.template)
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [embedCode, setEmbedCode] = useState('');
    const [developmentPlatform, setDevelopmentPlatform] = useState('');
    const [botName, setBotName] = useState('');
    const [botIntro, setBotIntro] = useState('');
    const [botIcon, setBotIcon] = useState('');
    const [serverURL, setServerURL] = useState('');
    const [consentNote, setConsentText] = useState('I agree to the following...');
    const [enableBugReport, setEnableBugReport] = useState(false);
    const [webcamId, setWebcamId] = useState('');
    const [enableFeedback, setEnableFeedback] = useState(false);
    const [enableVoice, setEnableVoice] = useState(false);
    const [feedbackLink, setFeedbackLink] = useState('');
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState<any>('');
    const [userInputObj, setInputObj] = useState<any>(sampleInputData);
    const [userinput_key, setUserInputKey] = useState<any>('text');
    const [sysoutput_key, setSysOutputKey] = useState<any>('response');
    const [output, setOutput] = useState<any>('');
    const [input_keys, setInputKeys] = useState<any>([]);
    const [output_keys, setOutputKeys] = useState<any>([]);

    const editorRef = useRef(null);
    const descriptionEditorRef = useRef(null);
    const concentEditorRef = useRef(null);

    const darkmode = new Darkmode()
    darkmode.toggle()
    darkmode.attach()

    const save = () => {
    const botId = generateString(8);
    const dataObj = {
        "botId": botId,
        "title": title,
        "description":
            descriptionEditorRef.current?.getContent() || '<p>No content provided</p>',
        "embedCode": embedCode,
        "developmentPlatform": developmentPlatform,
        "botName": botName,
        "botIntro": botIntro,
        "botIcon": botIcon,
        "serverURL": serverURL,
        "userInputObj": userInputObj,
        "userinputKey": userinput_key,
        "sysoutputKey": sysoutput_key,
        "consentNote":
            concentEditorRef.current?.getContent() || '<p>No content provided</p>',
        "enableBugReport": enableBugReport,
        "enableFeedback": enableFeedback,
        "enableVoice": enableVoice,
        "webcamId": webcamId,
        "feedbackLink": feedbackLink || 'https://forms.gle/PE9Sef4tLrQPW6bE6',
        "displayContent":
            editorRef.current?.getContent() || '<p>No content provided</p>',
    };
    setLoading(true);
    window.localStorage.setItem('obj', JSON.stringify(dataObj));
    const url = `${import.meta.env.VITE_SERVER_URL}/v1/demo/?id=${botId}`;
    console.log('url1: '+ `${import.meta.env.VITE_SERVER_URL}`);
      console.log('url2: '+ `${import.meta.env.VITE_BASE_URL}`);
    console.log('dataObj: '+ dataObj);
    postData(url, dataObj)
      .then(async (data) => {
        console.log(data);
        history.push(`/templates/${template.template}/preview`);
      })
      .catch((err) => console.log(err));
    };

    function sampleOutMarkup() {
        return JSON.stringify(sampleOutputData);
    }

    function sampleInputMarkup() {
        return JSON.stringify(sampleInputData);
    }
    const videoConstraints = {
      width: 640,
      height: 360,
      facingMode: "user"
    };

    const webcamRef = React.useRef(null);
    const WebcamCapture = async () => {
      const capture = React.useCallback(
          () => {
                const imageSrc = webcamRef.current.getScreenshot();},
          [webcamRef]
      );
    };

    const [devices, setDevices] = React.useState([]);
    const [select_device, setSelectDevices] = React.useState([]);
    const handleDevices = React.useCallback((mediaDevices) => {
      setDevices(mediaDevices.filter(({kind}:{kind:string}) => kind === "videoinput"))
    }, [setDevices]);

    React.useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },[handleDevices]);
    const defaultOption = devices[0];

    const onSelect = (option: any) => {
      setSelectDevices(option.value)
      setWebcamId(option.value.deviceId)
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
            object_keys.forEach(
                function(key: any){
                    keys.push(<option key={key} value={key}>{key}</option>)
                    const value_type = xtype(json[key])
                    // Check whether the value is another JSON Object
                    if ( value_type ===  "single_prop_object" || value_type === 'multi_prop_object'){
                        let sub_keys = Object.keys(json[key])
                        sub_keys.forEach(
                            function(sub_key: any){
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

    // @ts-ignore
    return (
    <div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
                type="text"
                onChange={(e: any) => setTitle(e.target.value)}
            />
        </Form.Group>
      <div className="input-div">
        <label className="styled-label" htmlFor="description">
          Description
        </label>
          <Editor
              apiKey="fisxby59j1hb3honmm817yqv5whh8tdl1sgo9k3km7cgyuhv"
              onInit={(evt, editor) => (descriptionEditorRef.current = editor)}
              initialValue=''
              init={{
                  height: 500,
                  content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
          />
      </div>
        {display_area ? (
            <div className="input-div">
                <label className="styled-label">Display Area</label>
                <Editor
                    apiKey="fisxby59j1hb3honmm817yqv5whh8tdl1sgo9k3km7cgyuhv"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue='<h1>Display Area Title</h1>
            <p>You can add one or more paragraphs to the display area</p>
            <p>You can also embed videos from Youtube and other sources</p>
            <p><iframe width="530" height="400" src="https://www.youtube.com/embed/TGAobsLMuc0" title="5 Best Chatbot Platforms To Develop Bots In 2022" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>
            <p>Images can also be added to the display area</p>
            <p><img src="https://th.bing.com/th/id/OIP.PaDdrv5H2GXu-JlO9dfu_AHaDt?pid=ImgDet&amp;rs=1" alt="" width="474" height="237"></p>
            <p>Feel free to add more elements like tables and other things as may be required...</p>'
                    init={{
                        height: 500,
                        menubar: 'file edit view insert format tools table help',
                        plugins: [
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'preview',
                            'anchor',
                            'searchreplace',
                            'visualblocks',
                            'code',
                            'fullscreen',
                            'insertdatetime',
                            'media',
                            'table',
                            'code',
                            'help',
                            'wordcount',
                        ],
                        toolbar:
                            'undo redo | blocks | ' +
                            'bold italic media image | forecolor alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style:
                            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                />
            </div>
        ) : null}
        {webcam ? (
            <div>
                <div className="input-div">
                    <label className="styled-label">Display Area</label>
                    <Editor
                        apiKey="fisxby59j1hb3honmm817yqv5whh8tdl1sgo9k3km7cgyuhv"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue='<h1>Display Area Title</h1>
                <p>You can add one or more paragraphs to the display area</p>
                <p>Feel free to add more elements like tables and other things as may be required...</p>'
                        init={{
                            height: 500,
                            menubar: 'file edit view insert format tools table help',
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'charmap',
                                'preview',
                                'anchor',
                                'searchreplace',
                                'visualblocks',
                                'code',
                                'fullscreen',
                                'insertdatetime',
                                'table',
                                'code',
                                'help',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | blocks | ' +' forecolor alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    /></div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Choose Camera Device:</Form.Label>
                    <Form.Select
                        value={sysoutput_key}
                        onChange={(e) => setSysOutputKey(e.target.value)}
                    >
                        {devices}
                    </Form.Select>
                    <Form.Label> Choose Camera Device</Form.Label>
                </Form.Group>

                <Dropdown options={devices}
                          onChange={onSelect}
                          value={defaultOption}
                          placeholder="Select an option"
                          arrowClosed={<span className="arrow-closed" />}
                          arrowOpen={<span className="arrow-open" />}/>
                <label><br /></label>
                <Webcam
                    audio={false}
                    height={videoConstraints.height}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={videoConstraints.width}
                    videoConstraints={{deviceId: select_device.deviceId}}
                />
            </div>
        ) : null}
      <div className="divider-no-line"></div>
      <h3>&#8212; Bot Integration</h3>
      <div className="divider"></div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label> Development Platform </Form.Label>
            <Form.Select
                value={developmentPlatform}
                onChange={(e) => setDevelopmentPlatform(e.target.value)}
            >
                <option value="">Choose your bot platform...</option>
                <option value="dialog-flow">Dialogflow</option>
                <option value="custom-server">Custom Server</option>
            </Form.Select>
        </Form.Group>
      {/*<div className="input-div">*/}
      {/*  <label className="styled-label" htmlFor="developmentPlatform">*/}
      {/*    Development Platform*/}
      {/*  </label>*/}
      {/*  <select*/}
      {/*    className="styled-select"*/}
      {/*    name="developmentPlatform"*/}
      {/*    id="developmentPlatform"*/}
      {/*    value={developmentPlatform}*/}
      {/*    onChange={(e) => setDevelopmentPlatform(e.target.value)}*/}
      {/*  >*/}
      {/*    <option value="">Choose your bot platform...</option>*/}
      {/*    <option value="dialog-flow">Dialogflow</option>*/}
      {/*    <option value="custom-server">Custom Server</option>*/}
      {/*  </select>*/}
      {/*</div>*/}
      {/* Dialogflow configuration */}
      {developmentPlatform && developmentPlatform === 'dialog-flow' ? (
      <div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label> Paste Embed Code </Form.Label>
              <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder='<iframe width="350" height="430" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/YOUR_API_KEY"></iframe>'
                  onChange={(e) => setEmbedCode(e.target.value)}
              />
          </Form.Group>
          <small className="hint-color">
            Need help with getting the embed code? Follow the steps{' '}
            <a
              style={{ fontWeight: 'bold' }}
              href="https://cloud.google.com/dialogflow/es/docs/quick/integration"
              target="_blank"
            >
              here
            </a>{' '}
            for instructions
          </small>
        </div>
      ) : null}
      {developmentPlatform && developmentPlatform === 'custom-server' ? (
        <div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
            </div>
        </div>
      ) : null}
      <div className="divider-no-line"></div>
      <h3>&#8212; User Consent</h3>
      <div className="divider"></div>
      <div className="input-div">
        <label className="styled-label" htmlFor="consent-text">
          Consent text
        </label>
        <Editor
          apiKey="fisxby59j1hb3honmm817yqv5whh8tdl1sgo9k3km7cgyuhv"
          onInit={(evt, editor) => (concentEditorRef.current = editor)}
          initialValue='<p> I agree to the following... </p>'
          init={{
              height: 500,
              content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}/>
      </div>
      <div className="divider-no-line"></div>
      <h3>&#8212; Get Feedback</h3>
      <div className="divider"></div>
      <div className="input-div">
        <input
          id="bug-report-btn"
          type="checkbox"
          onChange={(e) => setEnableBugReport(e.target.checked)}
        />{' '}
        <label htmlFor="bug-report-btn">Enable Bug Report</label>
      </div>
      <div className="input-div">
        <input
          id="feedback-btn"
          type="checkbox"
          onChange={(e) => setEnableFeedback(e.target.checked)}
        />{' '}
        <label htmlFor="feedback-btn">Enable Overall Feedback</label>
        {enableFeedback ? (
          <input
            style={{ marginTop: 10 }}
            className="styled-input"
            placeholder="Provide Form Link (https://docs.google.com/forms/...)"
            onChange={(e) => setFeedbackLink(e.currentTarget.value)}
          />
        ) : null}
      </div>
        <div className="input-div">
            <input
                id="voice-btn"
                type="checkbox"
                onChange={(e) => setEnableVoice(e.target.checked)}
            />{' '}
            <label htmlFor="feedback-btn">Enable Voice Input/Output</label>
        </div>
      <button className="button" onClick={save} disabled={loading}>
        {loading ? 'Please wait...' : 'Save and Preview'}
      </button>
    </div>
  );
}