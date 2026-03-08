import { Types } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  favorites: string[];
  watchedVideos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubject {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic {
  _id: string;
  subjectId: string | ISubject;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoLecture {
  _id: string;
  subjectId: string | ISubject;
  topicId: string | ITopic;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INote {
  _id: string;
  subjectId: string | ISubject;
  topicId: string | ITopic;
  title: string;
  pdfUrl: string;
  description?: string;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormula {
  _id: string;
  subjectId: string | ISubject;
  topicId: string | ITopic;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
