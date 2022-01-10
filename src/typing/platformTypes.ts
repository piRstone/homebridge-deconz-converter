import { PlatformConfig } from 'homebridge';

export type RollerShutterConfig = {
  name: string;
  uniqueId: string;
};

export type DeconzConverterConfig = PlatformConfig & {
  host: string;
  useHTTPS: boolean;
  apiKey: string;
  port: string;
  rollerShutters: RollerShutterConfig[];
};
