export interface DcCreator {
  "@id": String;
  "foaf:familyName"?: String;
  "foaf:firstName"?: String;
  "foaf:title"?: String;
  "foaf:Organization"?: String;
  "foaf:workplaceHomepage"?: String;
  "foaf:gender"?: String;
  "foaf:mbox"?: String;
  "foaf:phone"?: String;
}

export interface Repository {
  "dcterms:title"?: String;
  "dcterms:description"?: String;
  "URL"?: String;
  "dc:language"?: String;
  "dc:type"?: String;
}

export interface Inputfile {
  "dc:title"?: String;
  "premis:hasFormat"?: String;
  "dcterms:extent"?: String;
  "amount"?: String;
}

export interface Outputfile {
  "dc:title"?: String;
  "premis:hasFormat"?: String;
  "dcterms:extent"?: String;
  "amount"?: String;
}

export interface License {
  "dcterms:title"?: String;
  "dcterms:license"?: String;
  "dcterms:description"?: String;
}

export interface RootObject {
  "@context"?: Context;
  "@type"?: String;
  "dcterms:title"?: String;
  "dc:creator"?: DcCreator[];
  "dc:date"?: String;
  "repository"?: Repository[];
  "Inputfile"?: Inputfile[];
  "Outputfile"?: Outputfile[];
  "license"?: License[];
}

export interface Context {
  foaf: string;
  dc: string;
  dcterms: string;
  premis: string;
}


