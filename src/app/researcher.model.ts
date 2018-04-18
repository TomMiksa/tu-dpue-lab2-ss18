export interface ResearcherModel {
  firstname: string;
  lastname: string;
  gender: string;
  preceding_titles: string;
  postpositioned_titles: string;
  main_phone_number: string;
  main_email: string;
  employee: Employee;
}
export interface Employee {
  employment: Employment;
}
export interface Employment {
  organisational_unit: string;
  function: string;
  function_category: string;
  addresses: Addresses;
  phone_numbers: string;
  emails: Emails;
  websites: Websites;
}
export interface Addresses {
  address: Address;
}
export interface Address {
  street: string;
  zip_code: number;
  city: string;
  country: string;
}
export interface Emails {
  email?: (string)[] | null;
}
export interface Websites {
  website: string;
}
