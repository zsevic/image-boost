import { Environment } from '../common/enums/environment';
import { isEnvironment } from '../utils';

export const API_BASE_URL = isEnvironment(Environment.Development)
  ? 'http://localhost:8080'
  : 'https://image-boost-a59b456c29ca.herokuapp.com';

export const ANALYTICS_ID = 'G-C5YB9TYDVP';
