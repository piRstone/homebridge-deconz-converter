import { API, APIEvent, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { RollerShutterConfig } from './typing/rollerShutter';
import { NodonMultifonctionsConfig } from './typing/nodonMultifonctions';
import { RollerShutterAccessory } from './accessories/rollerShutter';
import { NodonMultifonctionsAccessory } from './accessories/nodonMultifonctions';
import HttpClient from './httpClient';
import WSClient from './wsClient';
import { DeconzConverterConfig } from './typing/platformTypes';
import { WebSocket } from 'ws';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class DeconzConverterPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  public readonly client: HttpClient;
  public readonly wsClient: WebSocket;

  // This is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.name);

    // Instantiate httpClient
    const { host, useHTTPS, apiKey, port } = this.config as DeconzConverterConfig;
    if (!host || !apiKey) {
      this.log.error('No host or apiKey found. Please fill configuration');
    }
    this.client = new HttpClient(host, useHTTPS, apiKey);

    try {
      this.wsClient = new WSClient(host, port).connect();
    } catch (e) {
      throw new Error(`Cannot connect to websocket: ${e}`);
    }

    this.api.on(APIEvent.DID_FINISH_LAUNCHING, () => {
      log.debug('Executed didFinishLaunching callback');

      this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  discoverDevices() {
    const rollerShutters: RollerShutterConfig[] = this.config.rollerShutters ?? [];
    const nodonMultifonctions: NodonMultifonctionsConfig[] = this.config.nodonMultifonctions ?? [];

    for (const rollerShutter of rollerShutters) {
      const uuid = this.api.hap.uuid.generate(rollerShutter.uniqueId);

      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (existingAccessory) {
        this.log.info('Restoring existing roller shutter from cache:', existingAccessory.displayName);

        new RollerShutterAccessory(this, existingAccessory);
      } else {
        this.log.info('Adding new roller shutter:', rollerShutter.displayName);

        const accessory = new this.api.platformAccessory(rollerShutter.displayName, uuid);

        accessory.context.device = rollerShutter;

        new RollerShutterAccessory(this, accessory);

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }

    for (const multifonctionsModule of nodonMultifonctions) {
      const uuid = this.api.hap.uuid.generate(multifonctionsModule.uniqueId);

      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (existingAccessory) {
        this.log.info('Restoring existing NodOn multifonctions module from cache:', existingAccessory.displayName);

        new NodonMultifonctionsAccessory(this, existingAccessory);
      } else {
        this.log.info('Adding new NodOn multifonctions module shutter:', multifonctionsModule.displayName);

        const accessory = new this.api.platformAccessory(multifonctionsModule.displayName, uuid);

        accessory.context.device = multifonctionsModule;

        new NodonMultifonctionsAccessory(this, accessory);

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }
}
