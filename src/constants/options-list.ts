export enum TYPE_OPTIONS {
  Cultivation = 'Cultivation',
  Setpoints = 'Setpoints',
  Tasks = 'Tasks',
  Facility = 'Facility'
}

export type Option = {
  name: string;
  type: TYPE_OPTIONS;
};

export enum AllOptions {
  FACILITY_ADMIN = 'Facility Admin',
  VIEW_CULTIVATION = 'View Cultivation',
  ROOM_OCCUPIED = 'Room Occupied',
  SPRAY_MODE = 'Spray Mode',
  FOG_MODE = 'Fog Mode',
  HARVEST_MODE = 'Harvest Mode',
  WORK_LIGHTS = 'Work Lights',
  ALARM_NOTIFICATIONS = 'Alarm Notifications',
  CLIMATE = 'Climate',
  IRRIGATION = 'Irrigation',
  VIEW_TASKS = 'View Tasks',
  CREATE_DELETE_TASKS = 'Create/Delete Tasks',
  COMPLETE_TASKS = 'Complete Tasks',
  COMPLITION_NOTIFICATIONS = 'Complition Notifications'
}

export const FacilityOptions: Option[] = [
  {
    name: AllOptions.FACILITY_ADMIN,
    type: TYPE_OPTIONS.Facility
  }
];

export const TeamOptions: Option[] = [
  {
    name: AllOptions.VIEW_CULTIVATION,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.ROOM_OCCUPIED,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.SPRAY_MODE,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.FOG_MODE,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.HARVEST_MODE,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.WORK_LIGHTS,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.ALARM_NOTIFICATIONS,
    type: TYPE_OPTIONS.Cultivation
  },
  {
    name: AllOptions.CLIMATE,
    type: TYPE_OPTIONS.Setpoints
  },
  {
    name: AllOptions.IRRIGATION,
    type: TYPE_OPTIONS.Setpoints
  },
  {
    name: AllOptions.VIEW_TASKS,
    type: TYPE_OPTIONS.Tasks
  },
  {
    name: AllOptions.CREATE_DELETE_TASKS,
    type: TYPE_OPTIONS.Tasks
  },
  {
    name: AllOptions.COMPLETE_TASKS,
    type: TYPE_OPTIONS.Tasks
  },
  {
    name: AllOptions.COMPLITION_NOTIFICATIONS,
    type: TYPE_OPTIONS.Tasks
  }
];

export const TeamOptionsMap = new Map([...TeamOptions.map<[string, Option]>((opt) => [`${opt.name + opt.type}`, opt])]);
export const FacilityOptionsMap = new Map([...TeamOptions.map<[string, Option]>((opt) => [`${opt.name + opt.type}`, opt])]);

export const CheckTeamOptionMap = (option: Option) => {
  return TeamOptionsMap.get(option.name + option.type);
};

export const CheckFacilityOptionMap = (option: Option) => {
  return FacilityOptionsMap.get(option.name + option.type);
};

export const TeamTypes = [TYPE_OPTIONS.Cultivation, TYPE_OPTIONS.Setpoints, TYPE_OPTIONS.Tasks];
