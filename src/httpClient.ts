import axios, { AxiosInstance } from 'axios';

export default class HttpClient {
  httpClient: AxiosInstance;

  constructor(host: string, useHTTPS: boolean, apiKey: string) {
    const protocol = useHTTPS ? 'https://' : 'http://';
    this.httpClient = axios.create({
      baseURL: `${protocol}${host}/api/${apiKey}`,
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

  async setLightOn(uniqueId: string) {
    return this.httpClient.put(`/lights/${uniqueId}/state`, { on: true });
  }
}
