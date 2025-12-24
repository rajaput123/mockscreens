'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllWorkflows,
  getAllTasks,
  saveWorkflow,
  Workflow,
  WorkflowStep,
  Task,
} from '../taskWorkflowData';
import WorkflowGraph from '../components/WorkflowGraph';

export default function WorkflowViewPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allWorkflows = getAllWorkflows();
    const allTasks = getAllTasks();
    setWorkflows(allWorkflows);
    setTasks(allTasks);
    
    if (allWorkflows.length > 0 && !selectedWorkflow) {
      setSelectedWorkflow(allWorkflows[0]);
    }
  };

  const tasksByWorkflow = selectedWorkflow
    ? tasks.filter(t => t.workflowId === selectedWorkflow.id)
    : [];

  return (
    <ModuleLayout
      title="Workflow View"
      description="Visual workflow designer and management"
    >
      {/* Workflow Selector */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Workflow:</label>
            <select
              value={selectedWorkflow?.id || ''}
              onChange={(e) => {
                const workflow = workflows.find(w => w.id === e.target.value);
                setSelectedWorkflow(workflow || null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a workflow</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
          >
            + Create Workflow
          </button>
        </div>
      </div>

      {/* Workflow Graph */}
      {selectedWorkflow ? (
        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedWorkflow.name}</h3>
              <p className="text-sm text-gray-600">{selectedWorkflow.description}</p>
            </div>
            <div className="h-[600px]">
              <WorkflowGraph
                workflow={selectedWorkflow}
                onStepClick={(step) => {
                  console.log('Step clicked:', step);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <p className="text-gray-500">Select a workflow to view its graph</p>
        </div>
      )}

      {/* Tasks using this workflow */}
      {selectedWorkflow && tasksByWorkflow.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks using this workflow ({tasksByWorkflow.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasksByWorkflow.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors"
              >
                <div className="font-semibold text-gray-900 mb-1">{task.title}</div>
                <div className="text-sm text-gray-600 capitalize">{task.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflows List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Workflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => setSelectedWorkflow(workflow)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedWorkflow?.id === workflow.id
                  ? 'border-purple-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">{workflow.name}</div>
              <div className="text-sm text-gray-600 mb-2">{workflow.description}</div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{workflow.steps.length} steps</span>
                <span className={`px-2 py-1 rounded-full ${
                  workflow.isActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {workflow.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <HelpButton module="task-workflow" />
    </ModuleLayout>
  );
}
