export interface LicenseModel {
  name: string;
  priority: number;
  available: boolean;
  url: string;
  description: string;
  categories?: (string)[] | null;
  labels?: (string)[] | null;
  key: string;
}
