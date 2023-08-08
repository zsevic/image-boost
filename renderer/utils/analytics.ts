import ReactGA from "react-ga4";
import { isEnvironment } from ".";
import { Environment } from "../common/enums/environment";

export function trackEvent(category: string, label: string, action = 'click') {
  if (!isEnvironment(Environment.Development)) {
    ReactGA.event({
      action,
      category,
      label,
    });
  }
}
