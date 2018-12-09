export class APIResponse {
    dataResponse: string;  //full response
    archetypeId: string;  //openEHR-EHR-SECTION.adhoc.v1
    path: string; //openEHR-EHR-SECTION.adhoc.v1.adl
    rmType: string; //SECTION
    uid: string; //a82233b9-7f2d-4dd5-8db4-37f6963cfd8c
    details: ["MD5-CAM-1.0.1"]; build_uid; revision: string;
    arc: string;
    response: string;
    dependsOn;
    specializedArch = "Specialized Archetype";
    teste : string;
    urlGithub : string;
    templateId: string; 
    name: string;

  }


  export class Archetypes {
    dataResponse: string;  // full response
    archetypeId: string;  // openEHR-EHR-SECTION.adhoc.v1
    path: string; // openEHR-EHR-SECTION.adhoc.v1.adl
    rmType: string; // SECTION
    uid: string; // a82233b9-7f2d-4dd5-8db4-37f6963cfd8c
    details: ["MD5-CAM-1.0.1"]; build_uid; revision: string;
    response: string;
    dependsOn;
    teste : string;
    specializedArch : string;
    urlGithubReturn;
    sumArchError;
    sumArchOK : number;
    temp_val;
    languages;


  }


  export class Templates {
    dataResponse: string;  // full response
    templateId: string;  // openEHR-EHR-SECTION.adhoc.v1
    path: string; // openEHR-EHR-SECTION.adhoc.v1.adl
    rmType: string; // SECTION
    uid: string; // a82233b9-7f2d-4dd5-8db4-37f6963cfd8c
    response: string;
    dependsOn;
    archetypes;
    name: string;
    temp_val;
    languages;

  }


  