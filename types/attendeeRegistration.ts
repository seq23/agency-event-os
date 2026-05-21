export interface AttendeeProfile {
  attendeeId: string;
  eventId: string;
  emailHash: string;
  name: string;
  emailMasked?: string;
  company: string;
  title: string;
  personalWebsite?: string;
  socialLinks: string[];
  reasonForAttending?: string;
  interestingFact?: string;
  topicsOfInterest: string[];
  networkingGoals?: string;
  networkingOptIn: boolean;
  role: "attendee";
  status: "active" | "revoked" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface AttendeeRegistrationInput {
  eventId: string;
  name: string;
  email: string;
  company: string;
  title: string;
  personalWebsite?: string;
  socialLinks?: string[];
  reasonForAttending?: string;
  interestingFact?: string;
  topicsOfInterest?: string[];
  networkingGoals?: string;
  networkingOptIn?: boolean;
}

export interface AttendeeRegistrationResult {
  profile: AttendeeProfile;
  duplicateBehavior: "created" | "updated_existing_email";
}
