# ip-calc-regex

IP Calculator base on (netmask/CIDR/host) and using regex validation.

# Installation

`npm i ip-calc-regex --save`

# Usage

```js
import { ipCalc } from 'ip-calc-regex';

ipCalc('192.168.1.1', 1, '24')

// Result
// {
//   'IP Address': '192.168.1.1',
//   Netmask: '255.255.255.0',
//   CIDR: '/24',
//   Wildcard: '0.0.0.255',
//   Class: 'Class C',
//   'Network Address': '192.168.1.0',
//   'Host min': '192.168.1.1',
//   'Host max': '192.168.1.254',
//   Broadcast: '192.168.1.255',
//   'Total Subnets': 256,
//   'Total Hosts': '254'
// }

// If Error
// {
//   errorMsg: 'Invalid ...'
// }

```

# Parameters

> ipCalc(ipAddress, type, typeValue)

- ipAddress : [string] IPv4 Address, e.g 192.168.100.1
- type : [number] [0 | 1 | 2 ] [Netmask | CIDR | Total Hosts]
- typeValue : [string] Value base from type

# More Example

```js
ipCalc('192.168.1.1', 0, '255.255.255.0')

// Result
// {
//   'IP Address': '192.168.1.1',
//   Netmask: '255.255.255.0',
//   CIDR: '/24',
//   Wildcard: '0.0.0.255',
//   Class: 'Class C',
//   'Network Address': '192.168.1.0',
//   'Host min': '192.168.1.1',
//   'Host max': '192.168.1.254',
//   Broadcast: '192.168.1.255',
//   'Total Subnets': 256,
//   'Total Hosts': '254'
// }
```


```js
ipCalc('192.168.1.1', 2, '12')

// Result
// {
//   'IP Address': '192.168.1.1',
//   Netmask: '255.240.0.0',
//   CIDR: '/28',
//   Wildcard: '0.15.255.255',
//   Class: 'Class C',
//   'Network Address': '192.160.0.0',
//   'Host min': '192.160.0.1',
//   'Host max': '192.175.255.254',
//   Broadcast: '192.175.255.255',
//   'Total Subnets': 16,
//   'Total Hosts': '14'
// }
