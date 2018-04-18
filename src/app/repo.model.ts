export interface RepoModel {
  policies: Policies;
  repository_metadata: RepositoryMetadata;
  organisation: Organisation;
  system_metadata: SystemMetadata;
}
export interface Policies {
  preservation_policy: PreservationPolicy;
  content_policy: ContentPolicy;
  metadata_policy: MetadataPolicy;
  submission_policy: SubmissionPolicy;
  data_policy: DataPolicy;
}
export interface PreservationPolicy {
  closure_policy: string;
  file_preservation?: (string)[] | null;
  withdrawal: Withdrawal;
  third_party_collaborations?: (string)[] | null;
  functional_preservation?: (string)[] | null;
  retention_period: RetentionPeriod;
  version_control: VersionControl;
  url?: (string)[] | null;
}
export interface Withdrawal {
  withdrawn_items: WithdrawnItems;
  policy: string;
  method: string;
  standard_reasons?: (string)[] | null;
}
export interface WithdrawnItems {
  searchable: string;
  item_page?: (string)[] | null;
  url_retention: string;
}
export interface RetentionPeriod {
  period: string;
}
export interface VersionControl {
  earlier_versions?: (string)[] | null;
  policy?: (string)[] | null;
}
export interface ContentPolicy {
  repository_type: string;
  types_included: TypesIncluded;
  languages?: (string)[] | null;
  versions?: (string)[] | null;
  metadata?: (string)[] | null;
  url?: (string)[] | null;
}
export interface TypesIncluded {
  standard_types_allowed?: (string)[] | null;
  all: string;
}
export interface MetadataPolicy {
  access: string;
  commercial_reuse?: string | null;
  non_profit_reuse: string;
  non_profit_reuse_conditions?: (string)[] | null;
  url?: (string)[] | null;
}
export interface SubmissionPolicy {
  quality_control: string;
  depositors?: (string)[] | null;
  url?: (string)[] | null;
  rules?: (string)[] | null;
  moderation: string;
  content_embargo: string;
  copyright?: (string)[] | null;
  moderation_purposes?: (string)[] | null;
}
export interface DataPolicy {
  url?: (string)[] | null;
  reuse: string;
  harvesting?: (string)[] | null;
  reuse_conditions?: (string)[] | null;
  reuse_requirements?: (string)[] | null;
  reuse_permitted_purposes?: (string)[] | null;
  access: string;
  reuse_permitted_actions?: (string)[] | null;
}
export interface RepositoryMetadata {
  name?: (NameEntity)[] | null;
  full_text_record_count: string;
  content_subjects?: (ContentSubjectsEntity)[] | null;
  metadata_record_count: string;
  content_types?: (string)[] | null;
  oai_url: string;
  software: Software;
  description: string;
  type: string;
  url: string;
  content_languages?: (string)[] | null;
  repository_status: string;
  notes?: string | null;
  year_established?: string | null;
}
export interface NameEntity {
  language: string;
  name: string;
  preferred: string;
  acronym?: string | null;
}
export interface ContentSubjectsEntity {
  id: string;
  label: string;
}
export interface Software {
  name: string;
  version?: string | null;
  name_other?: string | null;
}
export interface Organisation {
  name?: (NameEntity)[] | null;
  unit?: (NameEntityOrUnitEntity)[] | null;
  contacts?: (ContactsEntity)[] | null;
  location: Location;
  url: string;
  country: string;
}
export interface NameEntityOrUnitEntity {
  language: string;
  name: string;
  preferred: string;
}
export interface ContactsEntity {
  job_title: string;
  name: Name;
  email: string;
}
export interface Name {
  honourific: string;
  family: string;
  given: string;
  lineage: string;
}
export interface Location {
  latitude: string;
  longitude: string;
}
export interface SystemMetadata {
  uri: string;
  id: string;
  date_modified: string;
  publicly_visible: string;
  date_created: string;
}
