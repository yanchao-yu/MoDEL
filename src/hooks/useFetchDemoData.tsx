import { useState, useEffect } from 'react';
import { fetchData } from '../utils/';
import { BotConfig } from '../interfaces';

export default function useFetchDemoData(botId: string) {
  const [loading, setLoading] = useState(true);
  const [botData, setBotData] = useState([]);
  const [activeBot, setActiveBot] = useState<BotConfig>();

  useEffect(() => {
    const getBotData = async () => {
      const data = await fetchData(`${import.meta.env.VITE_BASE_URL}/v1/demo/?id=${botId}`);
      console.log('data: ' + data)
      setBotData(data);
    };
    getBotData();
  }, []);

  useEffect(() => {
    if (botData.length > 0) {
      for (let data of botData) {
        if (data['botId'] === botId) {
          const obj = {
            title: data['title'],
            description: data['description'],
            embedCode: data['embedCode'],
            developmentPlatform: data['developmentPlatform'],
            botName: data['botName'],
            botIntro: data['botIntro'],
            botIcon: data['botIcon'],
            consentNote: data['consentNote'],
            enableBugReport: data['enableBugReport'],
            enableFeedback: data['enableFeedback'],
            feedbackLink: data['feedbackLink'],
            displayContent: data['displayContent'],
            serverURL: data['serverURL'],
            webcamId: data['webcamId'],
            enableVoice: data['enableVoice'],
          };
          setActiveBot(obj);
          setLoading(false);
        }
      }
    }
  }, [botData]);

  return { loading, activeBot };
}
