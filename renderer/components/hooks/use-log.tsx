import { logAtom } from '../../atoms/log-atom';
import log from 'electron-log/renderer';
import { useSetAtom } from 'jotai';

const useLog = (): { logit: (args: any) => void } => {
  const setLogData = useSetAtom(logAtom);

  const logit = (...args: any): void => {
    log.log(...args);

    const data = [...args].join(' ');
    setLogData((prevLogData) => [...prevLogData, data]);
  };

  return {
    logit,
  };
};

export default useLog;
