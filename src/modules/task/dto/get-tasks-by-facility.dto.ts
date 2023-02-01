export interface GetTasksByFacility {
  uid: string;
  facility_id: number;
  end_date?: Date;
  start_date?: Date;
  out?: boolean;
}
