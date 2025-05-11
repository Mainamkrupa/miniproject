export interface StudentData {
  rollNumber: string;
  studentName: string;
  phoneNumber: string;
}

export interface StudentCredential {
  id: string;
  email: string;
  password: string;
  rollNumber: string;
  studentName: string;
  phoneNumber: string;
  batch: string;
  universityId: string;
  isRegistered: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'CERTIFICATE' | 'ANNOUNCEMENT';
  createdAt: string;
  read: boolean;
  studentId: string;
  universityId: string;
}