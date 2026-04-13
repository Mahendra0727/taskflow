export const formatDate = (date?: string) => {
  if (!date) return 'No due date';
  return new Date(date).toLocaleDateString();
};

export const formatStatus = (status: string) => {
  if (status === 'in_progress') return 'In Progress';
  if (status === 'todo') return 'To Do';
  return 'Done';
};