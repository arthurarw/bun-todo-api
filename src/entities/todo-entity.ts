export type TodoStatus = "pending" | "completed";

export interface TodoEntity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export enum TodoStatusEnum {
  Pending = "pending",
  Completed = "completed"
}
