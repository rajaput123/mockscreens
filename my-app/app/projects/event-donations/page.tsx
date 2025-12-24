export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import EventDonationsClient from './EventDonationsClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>}>
      <EventDonationsClient />
    </Suspense>
  );
}
