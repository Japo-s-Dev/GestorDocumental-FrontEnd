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

export interface IValue {
  id: number;
  index_id: number;
  project_id: number;
  archive_id: number;
  value: string; // Ajusta el tipo si es necesario
  creation_date: Date;
  modified_date: Date;
  last_edit_user: number;
}

export interface IProject{
  id: number;
  name: string;
}
