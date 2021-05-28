const ipCalc = (ip, cat, val) => {

	if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {  
    return {errorMsg: "Invalid IP Address!"}  
	}
  
  const result = {
    "IP Address": ip,
    "Netmask": "",
    "CIDR": "",
    "Wildcard": "",
    "Class": "",
    "Network Address": "",
    "Host min": "",
    "Host max": "",
    "Broadcast": "",
    "Total Subnets": "",
    "Total Hosts": ""
  }
  
	if(cat == 0 && !/^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/.test(val)){
		return {errorMsg: "Invalid Netmask!"}
	}
  
  if(cat == 1 && !/\b([1-9]|[12][0-9]|3[0-2])\b/.test(val)) return {errorMsg: "Invalid CIDR!"}
  
  if(cat == 2 && !/^[1-9]\d*$/.test(val)) return {errorMsg: "Invalid Host number!"}

  const MAX_BIT = 32
  const MAX_BIN = 255
  const BITS_32 = 4294967295

  const unpackInt = i => -1 << (MAX_BIT - i);
  const intToQdot = i => [
    i >> 24 & MAX_BIN,
    i >> 16 & MAX_BIN,
    i >> 8 & MAX_BIN,
    i & MAX_BIN
  ].join('.');

  const hostPerSubnet = cidr => cidr >= 2 ? 
    (Math.pow(2, (MAX_BIT - cidr))) - 2 
    : cidr;
  const usableHost = (hostTotal) => 2 <= hostTotal ? 
    hostTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
    : 0;

  const qdotToInt = ip => {
    let x = 0;
  
    x += +ip[0] << 24 >>> 0;
    x += +ip[1] << 16 >>> 0;
    x += +ip[2] << 8 >>> 0;
    x += +ip[3] >>> 0;
  
    return x;
  }

  const classify = ip => {
    if (ip < 128) return "Class A"
    if (ip < 192) return "Class B"
    if (ip < 224) return "Class C"
    if (ip < 240) return "Class D"
    if (ip < 256) return "Class E"
}

  const getNetworkAddress = (ipBit, netmaskBit) => intToQdot(ipBit & netmaskBit);
  const getBroadcastAddress = (ipBit, netmaskBit) => intToQdot(ipBit | (~netmaskBit & BITS_32));

  if(cat == 0) {
    result.Netmask = val
    result.CIDR = val
      .split('.')
      .reduce((acc, cur) => (acc << 8 | cur) >>> 0)

    result.CIDR -= (result.CIDR >>> 1) & 0x55555555;
    result.CIDR = (result.CIDR & 0x33333333) + (result.CIDR >>> 2 & 0x33333333);
  
    result.CIDR = ((result.CIDR + (result.CIDR >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
    result["Total Hosts"] = usableHost(hostPerSubnet(result.CIDR))
  }

  if(cat == 1) {
    result.CIDR = val
    result.Netmask = intToQdot(unpackInt(val))
    result["Total Hosts"] = usableHost(hostPerSubnet(result.CIDR))
  }

  if(cat == 2) {
    result.CIDR = MAX_BIT - Math.ceil(Math.log(val) / Math.log(2))
    result.Netmask = intToQdot(unpackInt(val))
    result["Total Hosts"] = usableHost(hostPerSubnet(result.CIDR))
  }

  const ipArr = result["IP Address"].split('.')
  const netmaskArr = result.Netmask.split('.')

  const ipBit = qdotToInt(ipArr)
  const netmaskBit = qdotToInt(netmaskArr)

  result.Wildcard = intToQdot(~netmaskBit)
  result.Class = classify(ipArr[0])

  result["Network Address"] = getNetworkAddress(ipBit, netmaskBit)
  result.Broadcast = getBroadcastAddress(ipBit, netmaskBit)

  const networkInc = result["Network Address"].split('.')
  const broadcastDec = result.Broadcast.split('.')

  networkInc[3] = +networkInc[3] + 1;
  broadcastDec[3] = +broadcastDec[3] - 1;

  result["Host min"] = networkInc.join('.')
  result["Host max"] = broadcastDec.join('.')

  result["Total Subnets"] = (result.CIDR % 8) ? 
    Math.pow(2, (result.CIDR % 8)) : Math.pow(2, 8)
    
  result.CIDR = '/'+result.CIDR
  
  return result
}

module.exports.ipCalc = ipCalc;
