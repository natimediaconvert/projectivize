import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for Task data structure based on the actual database schema
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  created_by: string;
  assigned_to: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all tasks for the current user
 * @returns Promise containing an array of tasks
 */
export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Fetches a specific task by ID
 * @param taskId - The ID of the task to fetch
 * @returns Promise containing the task data
 */
export const fetchTaskById = async (taskId: string): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
    
  if (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
  
  return data;
};

/**
 * Creates a new task
 * @param taskData - The task data to create
 * @returns Promise containing the created task
 */
export const createTask = async (taskData: {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  status?: 'pending' | 'in_progress' | 'completed';
  created_by: string;
  assigned_to?: string;
  team_id?: string;
}): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }
  
  return data;
};

/**
 * Updates an existing task
 * @param taskId - The ID of the task to update
 * @param taskData - The updated task data
 * @returns Promise containing the updated task
 */
export const updateTask = async (
  taskId: string, 
  taskData: {
    title?: string;
    description?: string;
    due_date?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    status?: 'pending' | 'in_progress' | 'completed';
    assigned_to?: string;
    team_id?: string;
  }
): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', taskId)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
  
  return data;
};

/**
 * Deletes a task by ID
 * @param taskId - The ID of the task to delete
 * @returns Promise indicating success
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
    
  if (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};
