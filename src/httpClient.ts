import axios, { AxiosInstance } from 'axios';

export default class HttpClient {
  httpClient: AxiosInstance;

  constructor(host: string, apiKey: string) {
    this.httpClient = axios.create({
      baseURL: `${host}/api/${apiKey}`,
      headers: {
        'accept': 'application/json',
      },
    });
  }

  async getLightByUniqueId(uniqueId: string) {
    return this.httpClient.get(`/lights/${uniqueId}`);
  }

  async updateLightBrightness(bri: number, uniqueId: string) {
    return this.httpClient.put(`/lights/${uniqueId}/state`, { bri });
  }
}
