/**
 * Utilities for linking People tasks to Operations workflows
 */

export interface OperationsWorkflowLink {
  workflowId: string;
  workflowName: string;
  taskId?: string;
  stepId?: string;
}

/**
 * Get workflow information by ID
 * This would typically call an API or access operations module data
 */
export function getWorkflowInfo(workflowId: string): OperationsWorkflowLink | null {
  // TODO: Replace with actual API call or data access
  // For now, return mock data
  if (typeof window !== 'undefined') {
    const workflows = JSON.parse(
      localStorage.getItem('operations_workflows') || '[]'
    );
    const workflow = workflows.find((w: any) => w.id === workflowId);
    if (workflow) {
      return {
        workflowId: workflow.id,
        workflowName: workflow.name,
      };
    }
  }
  return null;
}

/**
 * Check if a task is linked to an operations workflow
 */
export function isLinkedToWorkflow(linkedWorkflowId?: string): boolean {
  return !!linkedWorkflowId;
}

/**
 * Format workflow link display text
 */
export function formatWorkflowLink(workflowName?: string): string {
  return workflowName ? `Linked to: ${workflowName}` : '';
}

