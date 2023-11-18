export enum DeconzEventType {
  Changed = 'changed',
  Added = 'added',
  Deleted = 'deleted',
  SceneCalled = 'scene-called',
}

export enum DeconzEventResourceType {
  Groups = 'groups',
  Lights = 'lights',
  Scenes = 'scenes',
  Sensors = 'sensors',
}

type DeconzEventAttribute = {
  id: string;
  lastannounced: Date | null;
  lastseen: Date | null;
  manufacturername: string;
  modelid: string;
  name: string;
  swversion: string;
  type: string;
  uniqueid: string;
};

type DeconzEventState = {
  dark: boolean;
  daylight: boolean;
  lastupdated: Date | null;
  status: number;
  sunrise: string;
  sunset: string;
  alert: string | null;
  bri: number;
  on: boolean;
  reachable: boolean;
  open?: boolean;
};

export type DeconzEvent = {
  e: DeconzEventType;
  id: string;
  r: DeconzEventResourceType;
  t: string;
  uniqueid: string;
  attr?: DeconzEventAttribute;
  state?: DeconzEventState;
};
