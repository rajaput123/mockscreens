'use client';

import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import CapacityNetworkGraph from '../components/CapacityNetworkGraph';

export default function ManageCapacityPage() {

  return (
    <ModuleLayout
      title="Manage Capacity"
      description="Create, edit, and manage capacity rules for all temple locations"
    >

      {/* Network Graph */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Network Visualization</h2>
        <CapacityNetworkGraph />
      </div>

      <HelpButton module="crowd-capacity" />
    </ModuleLayout>
  );
}

