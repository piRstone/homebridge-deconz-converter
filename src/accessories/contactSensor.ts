import {
  CharacteristicEventTypes,
  CharacteristicValue,
  NodeCallback,
  PlatformAccessory,
  Service,
} from 'homebridge';
import { DeconzConverterPlatform } from '../platform';
import { ContactSensor } from '../typing/contactSensor';
import {
  DeconzEvent,
  DeconzEventResourceType,
  DeconzEventType,
} from '../typing/deconzEvent';

export class ContactSensorAccessory {
  private service: Service;

  constructor(
    private readonly platform: DeconzConverterPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.service =
      this.accessory.getService(this.platform.Service.ContactSensor) ||
      this.accessory.addService(this.platform.Service.ContactSensor);

    this.service.setCharacteristic(
      this.platform.Characteristic.Name,
      accessory.context.device.displayName,
    );

    this.service
      .getCharacteristic(this.platform.Characteristic.ContactSensorState)
      .on(CharacteristicEventTypes.GET, this.getContactSensorState.bind(this));

    this.platform.wsClient.on(
      'message',
      this.handleContactSensorStateChange.bind(this),
    );
  }

  async setAccessoryInformations() {
    const response = await this.platform.client.getSensorState(
      this.accessory.context.device.uniqueId,
    );
    const device = response.data as ContactSensor;
    const serialNumber = device.uniqueid
      .slice(0, device.uniqueid.length - 3)
      .replaceAll(':', '')
      .toUpperCase();

    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(
        this.platform.Characteristic.Manufacturer,
        device.manufacturername,
      )
      .setCharacteristic(this.platform.Characteristic.Model, device.modelid)
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        serialNumber,
      );
  }

  async getContactSensorState(callback: NodeCallback<CharacteristicValue>) {
    this.platform.log.debug(
      `Get state for ${this.accessory.context.device.displayName}`,
    );
    try {
      const response = await this.platform.client.getSensorState(
        this.accessory.context.device.uniqueId,
      );
      const device = response.data as ContactSensor;
      const state = device.state.open
        ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
        : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED;
      callback(null, state);
    } catch (err) {
      callback(err as Error);
    }
  }

  handleContactSensorStateChange(e: string): void {
    const event = JSON.parse(e) as DeconzEvent;
    if (
      event.e === DeconzEventType.Changed &&
      event.r === DeconzEventResourceType.Sensors &&
      event.uniqueid === this.accessory.context.device.uniqueId
    ) {
      const state = event.state?.open
        ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
        : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED;
      this.service.setCharacteristic(
        this.platform.Characteristic.ContactSensorState,
        state,
      );
      this.platform.log.debug(
        `============= Characteristic set ${this.accessory.context.device.displayName} ContactSensorState to ${state}`,
      );
    }
  }
}
