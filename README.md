
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# Homebridge Deconz Converter

This plugin is used to convert deCONZ accessories that are not light into their correct HomeKit type.

Only **roller shutters** are converted for now.

## Configuration

You must retreive you API Key to connect to you deCONZ instance.
[See here how to proceed](https://dresden-elektronik.github.io/deconz-rest-doc/getting_started/#acquire-an-api-key).

Then list all _lights_ and get `uniqueId` of all accessories you want to add with this request:
```
GET {{host}}/api/{{API_KEY}}/lights
```

Finally, use the plugin interface to fill information or fill config.json as below:

```json
"platforms": [
  {
    "platform": "HomebridgeDeconzConverter",
    "host": "http://10.0.1.15",
    "apiKey": "AABBCCDDEE",
    "rollerShutters": [
      {
        "displayName": "Bedroom",
        "uniqueId": "20:92:8a:ff:ff:aa:e7:43-01"
      }
    ]
  }
]
```

Add as many roller shutters as you want in the `rollerShutters` array.

## Development

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```
npm run build
```

You can use `watch` to link the plugin to Homebridge and rebuild on each change.

```
npm run watch
```

Run in a separate terminal the Homebridge server:

```
npm run start
```

Then, if you wan to check the configuration in the Homebridge GUI, you can run in another terminal and **in the plugin directory**:

```shell
$ npm install -g homebridge-config-ui-x
homebridge-deconz-converter$ homebridge-config-ui-x
```
