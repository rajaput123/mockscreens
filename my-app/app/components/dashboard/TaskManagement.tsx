import { colors, spacing, typography, getStatusColor, getPriorityColor } from '../../design-system';

interface Task {
  id: string;
  title: string;
  assignee: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

interface TaskStats {
  total: number;
  pending: number;
  active: number;
  done: number;
  overdue: number;
}

interface TaskManagementProps {
  stats: TaskStats;
  tasks: Task[];
}


export default function TaskManagement({ stats, tasks }: TaskManagementProps) {
  return (
    <section>
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h2 
          className="mb-6"
        style={{
          fontFamily: typography.sectionHeader.fontFamily,
          fontSize: typography.sectionHeader.fontSize,
          fontWeight: typography.sectionHeader.fontWeight,
          lineHeight: typography.sectionHeader.lineHeight,
          marginBottom: spacing.lg,
        }}
      >
        Task Management
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        <div className="text-center p-2 border border-gray-200 rounded-2xl">
          <div 
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: typography.kpi.fontSize,
              fontWeight: typography.kpi.fontWeight,
            }}
          >
            {stats.total}
          </div>
          <div 
            className="text-xs mt-1"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              fontSize: '12px',
              color: colors.text.muted,
            }}
          >
            Total
          </div>
        </div>
        <div className="text-center p-2 border border-gray-200 rounded-2xl">
          <div 
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: typography.kpi.fontSize,
              fontWeight: typography.kpi.fontWeight,
              color: colors.warning.base,
            }}
          >
            {stats.pending}
          </div>
          <div 
            className="text-xs mt-1"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              fontSize: '12px',
              color: colors.text.muted,
            }}
          >
            Pending
          </div>
        </div>
        <div className="text-center p-2 border border-gray-200 rounded-2xl">
          <div 
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: typography.kpi.fontSize,
              fontWeight: typography.kpi.fontWeight,
              color: colors.info.base,
            }}
          >
            {stats.active}
          </div>
          <div 
            className="text-xs mt-1"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              fontSize: '12px',
              color: colors.text.muted,
            }}
          >
            Active
          </div>
        </div>
        <div className="text-center p-2 border border-gray-200 rounded-2xl">
          <div 
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: typography.kpi.fontSize,
              fontWeight: typography.kpi.fontWeight,
              color: colors.success.base,
            }}
          >
            {stats.done}
          </div>
          <div 
            className="text-xs mt-1"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              fontSize: '12px',
              color: colors.text.muted,
            }}
          >
            Done
          </div>
        </div>
        <div className="text-center p-2 border border-gray-200 rounded-2xl">
          <div 
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: typography.kpi.fontSize,
              fontWeight: typography.kpi.fontWeight,
              color: colors.error.base,
            }}
          >
            {stats.overdue}
          </div>
          <div 
            className="text-xs mt-1"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              fontSize: '12px',
              color: colors.text.muted,
            }}
          >
            Overdue
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border border-gray-200 rounded-3xl transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primary.base;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div 
                className="flex-1"
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                }}
              >
                {task.title}
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-1 rounded-xl text-xs font-medium text-white capitalize"
                  style={{
                    backgroundColor: getStatusColor(task.status),
                  }}
                >
                  {task.status === 'in-progress' ? 'In Progress' : task.status}
                </span>
                <span 
                  className="px-2 py-1 rounded-xl text-xs font-medium text-white capitalize"
                  style={{
                    backgroundColor: getPriorityColor(task.priority),
                  }}
                >
                  {task.priority}
                </span>
              </div>
            </div>
            <div 
              className="mb-2"
              style={{
                fontFamily: typography.bodySmall.fontFamily,
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.muted,
              }}
            >
              {task.assignee} • {task.category}
            </div>
            <div 
              style={{
                fontFamily: typography.bodySmall.fontFamily,
                fontSize: typography.bodySmall.fontSize,
                color: colors.text.muted,
              }}
            >
              Due: {task.dueDate}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

