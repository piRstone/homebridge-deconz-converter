import {
  CharacteristicEventTypes,
  CharacteristicSetCallback,
  CharacteristicValue,
  NodeCallback,
  PlatformAccessory,
  Service,
} from 'homebridge';
import { DeconzConverterPlatform } from '../platform';
import { Light } from '../typing/lightState';
import { DeconzEvent, DeconzEventResourceType, DeconzEventType } from '../typing/deconzEvent';
import { briToPercents, percentsToBri } from '../utils/briPercentsConverter';


export class RollerShutterAccessory {
  private service: Service;

  constructor(
    private readonly platform: DeconzConverterPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.service = this.accessory.getService(this.platform.Service.WindowCovering)
      || this.accessory.addService(this.platform.Service.WindowCovering);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentPosition)
      .on(CharacteristicEventTypes.GET, this.getCurrentPosition.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.PositionState)
      .on(CharacteristicEventTypes.GET, this.getPositionState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetPosition)
      .on(CharacteristicEventTypes.GET, this.getTargetPosition.bind(this))
      .on(CharacteristicEventTypes.SET, this.setTargetPosition.bind(this));

    this.platform.wsClient.on('message', this.handleMessage.bind(this));
  }

  async setAccessoryInformations() {
    const response = await this.platform.client.getLightByUniqueId(this.accessory.context.device.uniqueId);
    const device = response.data as Light;
    const serialNumber = device.uniqueid.slice(0, device.uniqueid.length - 3).replaceAll(':', '').toUpperCase();

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, device.manufacturername)
      .setCharacteristic(this.platform.Characteristic.Model, device.modelid)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, serialNumber);
  }

  async getCurrentPosition(callback: NodeCallback<CharacteristicValue>) {
    try {
      const response = await this.platform.client.getLightByUniqueId(this.accessory.context.device.uniqueId);
      const device = response.data as Light;

      const brightness = device.state.bri;
      const percentage = briToPercents(brightness);

      callback(null, percentage);
    } catch (err) {
      callback(err as Error);
    }
  }

  async getPositionState(callback: NodeCallback<CharacteristicValue>) {
    this.platform.log.debug(`Get PositionState for ${this.accessory.context.device.displayName}`);
    try {
      const nextValue = this.platform.Characteristic.PositionState.STOPPED;
      callback(null, nextValue);
    } catch (err) {
      callback(err as Error);
    }
  }

  async getTargetPosition(callback: NodeCallback<CharacteristicValue>) {
    this.platform.log.debug(`Get TargetPosition for ${this.accessory.context.device.displayName}`);
    try {
      const response = await this.platform.client.getLightByUniqueId(this.accessory.context.device.uniqueId);
      const device = response.data as Light;

      const brightness = device.state.bri;
      const percentage = briToPercents(brightness);

      callback(null, percentage);
    } catch (err) {
      callback(err as Error);
    }
  }

  async setTargetPosition(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    this.platform.log.info(`Set ${this.accessory.context.device.displayName} target position to ${value}%`);
    try {
      const brightness = percentsToBri(value as number);
      await this.platform.client.updateLightBrightness(brightness, this.accessory.context.device.uniqueId);

      callback();
    } catch (err) {
      callback(err as Error);
    }
  }

  handleMessage(e: string): void {
    const event = JSON.parse(e) as DeconzEvent;
    if (
      event.e === DeconzEventType.Changed &&
      event.r === DeconzEventResourceType.Lights &&
      event.uniqueid === this.accessory.context.device.uniqueId &&
      event.state?.bri !== undefined) {
      const percentage = briToPercents(event.state.bri);
      this.service.setCharacteristic(this.platform.Characteristic.CurrentPosition, percentage);
      this.service.setCharacteristic(this.platform.Characteristic.PositionState, this.platform.Characteristic.PositionState.STOPPED);
      this.platform.log.debug(
        `============= Characteristic set ${this.accessory.context.device.displayName} CurrentPosition to ${percentage} %`);
    }
  }
}
