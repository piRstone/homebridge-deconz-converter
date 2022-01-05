type State = {
  alert: string;
  bri: number;
  on: boolean;
  reachable: boolean;
};

export type Light = {
  etag: string;
  hascolor: boolean;
  lastannounced: Date | null;
  lastseen: Date | null;
  manufacturername: string;
  modelid: string;
  name: string;
  state: State;
  swversion: string | null;
  type: string;
  uniqueid: string;
};
