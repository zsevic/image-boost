import ReactGA from "react-ga4";
import { isEnvironment } from ".";

export function trackEvent(category: string, label: string, action = 'click') {
  if (!isEnvironment('development')) {
    ReactGA.event({
      action,
      category,
      label,
    });
  }
}
