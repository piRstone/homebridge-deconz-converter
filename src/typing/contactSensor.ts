export type ContactSensorConfig = {
  displayName: string;
  uniqueId: string;
};

type Config = {
  battery: number;
  on: boolean;
  reachable: boolean;
  temperature: number;
};

type State = {
  lastupdated: Date | null;
  open: boolean;
};

export type ContactSensor = {
  config: Config;
  ep: number;
  etag: string;
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
