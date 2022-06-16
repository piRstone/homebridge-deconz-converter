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


export class NodonMultifonctionsAccessory {
  private service: Service;

  constructor(
    private readonly platform: DeconzConverterPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.service = this.accessory.getService(this.platform.Service.Switch)
      || this.accessory.addService(this.platform.Service.Switch);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.On)
      .on(CharacteristicEventTypes.GET, this.getIsOn.bind(this))
      .on(CharacteristicEventTypes.SET, this.setIsOn.bind(this));
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

  async getIsOn(callback: NodeCallback<CharacteristicValue>) {
    callback(null, false);
  }

  async setIsOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    this.platform.log.info(`Set ${this.accessory.context.device.displayName} on`);
    try {
      await this.platform.client.setLightOn(this.accessory.context.device.uniqueId);

      callback();
    } catch (err) {
      callback(err as Error);
    }
  }
}
