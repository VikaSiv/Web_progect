interface GroupInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  group_id: Int32Array;
  isDeleted?:boolean;
};

export default GroupInterface;
