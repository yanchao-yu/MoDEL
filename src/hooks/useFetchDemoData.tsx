import { useState, useEffect } from 'react';
import { fetchData } from '../utils/';
import { BotConfig } from '../interfaces';

export default function useFetchDemoData(botId: string) {
  const [loading, setLoading] = useState(true);
  const [botData, setBotData] = useState([]);
  const [activeBot, setActiveBot] = useState<BotConfig>();

  useEffect(() => {
    const getBotData = async () => {
      const data = await fetchData('https://kpfm2b.sse.codesandbox.io/demo');
      setBotData(data);
    };
    getBotData();
  }, []);

  useEffect(() => {
    if (botData.length > 0) {
      for (let data of botData) {
        if (data[0] === botId) {
          const obj = {
            title: data[12],
            description: data[5],
            embedCode: data[8],
            developmentPlatform: data[6],
            botName: data[3],
            botIntro: data[2],
            botIcon: data[1],
            consentNote: data[4],
            enableBugReport: data[9],
            enableFeedback: data[10],
            feedbackLink: data[11],
            displayContent: data[7],
            serverURL: data[13],
          };
          setActiveBot(obj);
          setLoading(false);
        }
      }
    }
  }, [botData]);

  return { loading, activeBot };
}
