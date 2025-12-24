'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import { Content } from '../types';
import { mockContents } from '../mockData';
import { loadContent, saveContent } from '../../utils/dataStorage';

export default function ContentApprovalPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load contents from localStorage on mount
  useEffect(() => {
    const staticContents = mockContents;
    const loadedContents = loadContent(staticContents);
    setContents(loadedContents);
  }, []);

  const pendingContents = contents.filter(c => c.status === 'under-review');

  const handleView = (content: Content) => {
    setSelectedContent(content);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (contentId: string) => {
    if (confirm('Approve and publish this content?')) {
      const updatedContents = contents.map(c => 
        c.id === contentId 
          ? { 
              ...c, 
              status: 'published' as const,
              publishedAt: new Date().toISOString(),
              approvedBy: 'current-admin',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : c
      );
      setContents(updatedContents);
      saveContent(updatedContents);
      alert('Content approved and published successfully!');
    }
  };

  const handleReject = (contentId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const updatedContents = contents.map(c => 
        c.id === contentId 
          ? { 
              ...c, 
              status: 'draft' as const,
              updatedAt: new Date().toISOString()
            }
          : c
      );
      setContents(updatedContents);
      saveContent(updatedContents);
      alert('Content rejected. Author will be notified.');
    }
  };

  return (
    <ModuleLayout
      title="Content Approval"
      description="Review and approve pending content submissions"
    >
      {pendingContents.length > 0 ? (
        <div className="space-y-6">
          {pendingContents.map((content) => (
            <ElevatedCard
              key={content.id}
              elevation="lg"
              className="hover:scale-[1.02] transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {content.type.replace('-', ' ')} • v{content.version} • {content.language.toUpperCase()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-medium bg-amber-100 text-amber-700">
                    Under Review
                  </span>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div 
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: content.content }}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p>Author: {content.authorName}</p>
                    <p>Created: {new Date(content.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(content.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleView(content)}
                    className="flex-1 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApprove(content.id)}
                    className="flex-1 px-4 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 font-medium transition-colors"
                  >
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => handleReject(content.id)}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </ElevatedCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="md" className="text-center p-12">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg font-medium mb-2">All caught up!</p>
          <p className="text-gray-500">There are no pending content approvals at this time.</p>
        </ModernCard>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContent(null);
        }}
        title={selectedContent?.title}
        size="lg"
      >
        {selectedContent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{selectedContent.type.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Version</p>
                <p className="text-sm font-semibold text-gray-900">v{selectedContent.version}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Author</p>
                <p className="text-sm font-semibold text-gray-900">{selectedContent.authorName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Language</p>
                <p className="text-sm font-semibold text-gray-900">{selectedContent.language.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(selectedContent.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Updated</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(selectedContent.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Content</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200" dangerouslySetInnerHTML={{ __html: selectedContent.content }} />
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  handleApprove(selectedContent.id);
                  setIsDetailModalOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium transition-colors"
              >
                Approve & Publish
              </button>
              <button
                onClick={() => {
                  handleReject(selectedContent.id);
                  setIsDetailModalOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
