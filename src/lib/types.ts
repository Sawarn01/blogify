import type { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: {
    plan: 'Free' | 'Monthly' | 'Annual';
    status: 'active' | 'inactive';
    generationsUsed: number;
    generationsLimit: number;
    lifetimeGenerations: number;
  };
};

export type Post = {
  id: string;
  userId: string;
  title: string;
  outline: string;
  fullContent: string;
  keywords: { keyword: string; explanation: string }[];
  createdAt: Timestamp;
};
