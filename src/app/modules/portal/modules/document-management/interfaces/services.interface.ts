export interface IIndex {
  id: number;
  index_name: string;
  project_id: number;
  datatype_id: number;
  required: boolean;
}

export interface IExpedient {
  id: number;
  project_id: number;
  tag: string;
  creation_date: Date;
  modified_date: Date;
  owner: number;
  last_edit_user: number;
}

export interface IExpedientRequest extends Pick<IExpedient, 'project_id' | 'tag'> {}

export interface IValue {
  id: number;
  index_id: number;
  project_id: number;
  archive_id: number;
  value: string;
  creation_date: Date;
  modified_date: Date;
  last_edit_user: number;
}

export interface IValueRequest extends Pick<IValue, 'index_id' | 'project_id' | 'archive_id' | 'value'> {}


export interface IProject{
  id: number;
  name: string;
}
