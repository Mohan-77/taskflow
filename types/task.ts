
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

