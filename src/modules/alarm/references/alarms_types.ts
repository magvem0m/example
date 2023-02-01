export const Alarms_Types = new Map<number, { type_name: string; importance: string }>([
  [0, { type_name: 'Temperature Warning Low Limit', importance: 'warning' }],
  [1, { type_name: 'Temperature Warning High Limit', importance: 'warning' }],
  [2, { type_name: 'Temperature Alarm Low limit', importance: 'alarm' }],
  [3, { type_name: 'Temperature Alarm High limit', importance: 'alarm' }],
  [4, { type_name: 'Humidity Warning Low Limit', importance: 'warning' }],
  [5, { type_name: 'Humidity Warning High Limit', importance: 'warning' }],
  [6, { type_name: 'Humidity Alarm Low limit', importance: 'alarm' }],
  [7, { type_name: 'Humidity Alarm High limit', importance: 'alarm' }],
  [8, { type_name: 'CO2 Warning Low Limit', importance: 'warning' }],
  [9, { type_name: 'CO2 Warning High Limit', importance: 'warning' }],
  [10, { type_name: 'CO2 Alarm Low limit', importance: 'alarm' }],
  [11, { type_name: 'CO2 Alarm High limit', importance: 'alarm' }],
  [12, { type_name: 'Light Warning Low Limit', importance: 'warning' }],
  [13, { type_name: 'Light Warning High Limit', importance: 'warning' }],
  [14, { type_name: 'Light Alarm Low limit', importance: 'alarm' }],
  [15, { type_name: 'Light Alarm High limit', importance: 'alarm' }],
  [16, { type_name: 'Reserved', importance: 'warning' }]
]);
