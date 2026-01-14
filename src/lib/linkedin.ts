export interface LinkedInAPIName {
  localized: { [key: string]: string };
}

export interface LinkedInAPIProfilePic {
  "displayImage~"?: {
    elements?: {
      identifiers?: { identifier: string }[];
    }[];
  };
}

export interface LinkedInProfileResponse {
  id: string;
  firstName: LinkedInAPIName;
  lastName: LinkedInAPIName;
  profilePicture?: LinkedInAPIProfilePic;
  email?: string;
}
