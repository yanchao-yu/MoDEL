import React, {useCallback, useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../config/firebase";
import { v4 } from "uuid";

// Creating a context for the entire app to use the states and functions from this file
// This is a global state management
// It will stop the prop drilling

export const ConfigContext = React.createContext<any>(null);

const ConfigProvider = (props : any) => {

// }
// function ConfigContext({ children }) {
  // UI States
  const [isDnDDisabled, setIsDnDDisabled] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  // Text Content States
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [isEditText, setIsEditText] = useState(false);
  const [editedText, setEditedText] = useState({
    heading: "",
    paragraph: "",
  });
  const [textData, setTextData] = useState({
    id: "",
    heading: "",
    paragraph: "",
  });
  const [messageData, setMessageData] = useState("");
  // Image States
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [images, setImages] = useState([]);
  // Chatbot States
  const [messages, setMessages] = useState([
    { id: 0, message: "Hi", sender: "bot" },
    { id: 1, message: "How are you?", sender: "bot" },
  ]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [jsonViewer, setJsonViewer] = useState(false);
  const [selectedChatOption, setSelectedChatOption] = useState("");
  const [enableVoice, setEnableVoice] = useState(true);
  const [botID, setBotID] = useState("");

  const [chatData, setChatData] = useState({
    id: "",
    bot_intro: "",
    bot_name: "",
    development_platofrm: "",
    input: "",
    userInputObj: "",
    userinput_key: "",
    sysoutput_key: "",
    output: "",
    input_keys: "",
    output_keys: "",
    botIcon: "",
    serverURL: "",
  });
  const [editedChatOptions, setEditedChatOptions] = useState({
    bot_intro: "",
    bot_name: "",
    development_platofrm: "",
    input: "",
    userInputObj: "",
    userinput_key: "",
    sysoutput_key: "",
    output: "",
    input_keys: "",
    output_keys: "",
    botIcon: "",
    serverURL: "",
  });

  const [chatOnly, setChatOnly] = useState({
    title: "",
    description: "",
  });
  const [userConsent, setUserConsent] = useState({
    description: "",
    enable_bug_report: true,
    enable_voice: true,
    enable_overall_feedback: true,
  });
  const [sameComponents, setSameComponents] = useState(false);
  const [appStatus, setAppStatus] = useState("edit");
  const [agreeToLaunch, setAgreeToLaunch] = useState(false);

  // <___________ Functions ___________>

  // Text Content Functions
  const handleIsEditText = (value: boolean | ((prevState: boolean) => boolean)) => {
    setIsEditText(value);
    if (!value) {
      setEditedText({
        heading: textData?.heading ?? "",
        paragraph: textData?.paragraph ?? "",
      });
    }
  };

  const getTextData = useCallback(async () => {
    try {
      const textDataCollectionRef = collection(db, "text-data");
      const data = await getDocs(textDataCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTextData(filteredData[0]);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTextData = useCallback(async () => {
    try {
      const document = doc(db, "text-data", textData?.id);
      await updateDoc(document, {
        heading: editedText?.heading,
        paragraph: editedText?.paragraph,
      });
      setTextData({
        ...textData,
        heading: editedText?.heading,
        paragraph: editedText?.paragraph,
      });
      handleIsEditText(false);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedText, textData]);

  // Update the editedText state when the textData state changes
  useEffect(() => {
    setEditedText({
      heading: textData?.heading ?? "",
      paragraph: textData?.paragraph ?? "",
    });
  }, [textData]);

  // Fetch the text data from firebase when the app loads
  useEffect(() => {
    getTextData();
  }, [getTextData]);

  // Image Functions
  // Function to get all the images from firebase storage
  const getImages = useCallback(async () => {
    try {
      setIsImageLoading(true);
      const data = await listAll(ref(storage, "/"));
      const promises = data.items.map((item) => getDownloadURL(item));
      const urls = await Promise.all(promises);
      setImages(urls);
    } catch (err) {
      console.error(err);
    } finally {
      setIsImageLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadImage = useCallback(
    async (image: Blob | Uint8Array | ArrayBuffer) => {
      if (!image) return;
      try {
        setIsImageLoading(true);
        const storageRef = ref(storage, `${image.name + v4(0)}`);
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        setImages([...images, url]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsImageLoading(false);
      }
    },
    [images]
  );

  const addImage = (e: { target: { value: string; files: any[]; }; }) => {
    if (images.length >= 4) {
      e.target.value = "";
      return alert("You can only add 4 images");
    }
    const image = e.target.files[0];
    uploadImage(image);
    e.target.value = "";
  };

  const removeImage = useCallback(async () => {
    //it will remove the last image using firebase storage
    const lastImage = images[images.length - 1];
    const storageRef = ref(storage, lastImage);
    try {
      setIsImageLoading(true);
      await deleteObject(storageRef);
      setImages(images.slice(0, images.length - 1));
    } catch (err) {
      console.error(err);
    } finally {
      setIsImageLoading(false);
    }
  }, [images]);

  // fetch the images from firebase storage when the app loads
  useEffect(() => {
    getImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chatbot Functions
  // Function to add a message to the messages state
  const addMessage = (message: any) => {
    if (message)
      setMessages([
        ...messages,
        { id: messages.length, message, sender: "user" },
      ]);
  };

  const getChatOptions = useCallback(async () => {
    try {
      const chatDataCollectionRef = collection(db, "chat-options");
      const data = await getDocs(chatDataCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setChatData(filteredData[0]);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getChatOptions();
  }, [getChatOptions]);

  // const handleIsEditChat = (value: any) => {
  //   if (!value) {
  //     setEditedChatOptions({
  //       development_platofrm: chatData?.development_platofrm ?? "",
  //       bot_name: chatData?.bot_name ?? "",
  //       bot_intro: chatData.bot_intro ?? "",
  //     });
  //   }
  // };

  const updateChatData = useCallback(async () => {
    try {
      const document = doc(db, "chat-options", chatData?.id);
      await updateDoc(document, {
        development_platofrm: editedChatOptions.development_platofrm,
        bot_name: editedChatOptions.bot_name,
        bot_intro: editedChatOptions.bot_intro,
        botIcon: editedChatOptions.botIcon,
        serverURL: editedChatOptions.serverURL,
        input: editedChatOptions.input,
        userInputObj: editedChatOptions.userInputObj,
        userinput_key: editedChatOptions.userinput_key,
        sysoutput_key: editedChatOptions.sysoutput_key,
        output: editedChatOptions.output,
        input_keys: editedChatOptions.input_keys,
        output_keys: editedChatOptions.output_keys,
      });
      setChatData({
        ...chatData,
        development_platofrm: editedChatOptions.development_platofrm,
        bot_name: editedChatOptions.bot_name,
        bot_intro: editedChatOptions.bot_intro,
        botIcon: editedChatOptions.botIcon,
        serverURL: editedChatOptions.serverURL,
        input: editedChatOptions.input,
        userInputObj: editedChatOptions.userInputObj,
        userinput_key: editedChatOptions.userinput_key,
        sysoutput_key: editedChatOptions.sysoutput_key,
        output: editedChatOptions.output,
        input_keys: editedChatOptions.input_keys,
        output_keys: editedChatOptions.output_keys,
      });
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedChatOptions, chatData]);

  const getChatOnlyData = useCallback(async () => {
    try {
      const chatDataCollectionRef = collection(db, "chat-only");
      const data = await getDocs(chatDataCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setChatOnly(filteredData[0]);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getChatOnlyData();
  }, [getChatOnlyData]);

  const updateChatOnlyData = useCallback(async () => {
    try {
      const document = doc(db, "chat-only", chatOnly?.id);
      await updateDoc(document, {
        title: chatOnly?.title,
        description: chatOnly?.description,
      });
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOnly]);

  const getUserConsent = useCallback(async () => {
    try {
      const dataCollectionRef = collection(db, "user-consent");
      const data = await getDocs(dataCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserConsent(filteredData[0]);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserConsent();
  }, [getUserConsent]);

  const updateUserConsent = useCallback(async () => {
    try {
      const document = doc(db, "user-consent", userConsent?.id);
      await updateDoc(document, userConsent);
      getUserConsent();
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userConsent]);

  useEffect(() => {
    userConsent?.enable_voice !== undefined &&
      setEnableVoice(userConsent?.enable_voice);
  }, [userConsent]);

  return (
    <ConfigContext.Provider
      value={{
        botID,
        setBotID,
        setImages,
        // UI
        isDnDDisabled,
        setIsDnDDisabled,
        selectedComponent,
        setSelectedComponent,
        // Text Content
        fontColor,
        setFontColor,
        isEditText,
        setIsEditText,
        editedText,
        setEditedText,
        handleIsEditText,
        fontSize,
        setFontSize,
        textData,
        updateTextData,
        // Image Content
        images,
        addImage,
        removeImage,
        isImageLoading,
        getImages,
        uploadImage,
        // Chatbot
        messages,
        addMessage,
        messageData,
        setMessageData,
        jsonViewer,
        setJsonViewer,
        selectedChatOption,
        setSelectedChatOption,
        enableVoice,
        setEnableVoice,
        getChatOptions,
        chatData,
        updateChatData,
        editedChatOptions,
        setEditedChatOptions,
        getChatOnlyData,
        updateChatOnlyData,
        chatOnly,
        setChatOnly,
        getUserConsent,
        updateUserConsent,
        userConsent,
        setUserConsent,
        sameComponents,
        setSameComponents,
        appStatus,
        setAppStatus,
        agreeToLaunch,
        setAgreeToLaunch,
      }}
    >
      {props.children}
    </ConfigContext.Provider>
  );
};

// ConfigContext.propTypes = {
//   children: PropTypes.any,
// };

export default ConfigProvider;
