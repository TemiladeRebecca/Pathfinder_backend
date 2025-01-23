export interface Where {
  fieldName: string;
  value: any;
}

export interface UserPagination {
  page: number;
  limit: number;
  is_deleted?: boolean;
  is_suspended?: boolean;
  is_active?: boolean;
}
