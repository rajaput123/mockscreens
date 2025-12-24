'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ModernCard, ElevatedCard } from '../../components';
import ContentEditorModal from '../components/ContentEditorModal';
import { Content, ContentType } from '../types';
import { mockContents } from '../mockData';
import { loadContent, saveContent } from '../../utils/dataStorage';

export default function ContentEditorPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load contents from localStorage on mount
  useEffect(() => {
    const staticContents = mockContents;
    const loadedContents = loadContent(staticContents);
    setContents(loadedContents);
  }, []);

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (data: { title: string; content: string; type: ContentType; language: string }) => {
    const newContent: Content = {
      id: `content-${Date.now()}`,
      title: data.title,
      content: data.content,
      type: data.type,
      status: 'draft',
      language: data.language,
      authorId: 'current-user',
      authorName: 'Current User',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedContents = [...contents, newContent];
    setContents(updatedContents);
    saveContent(updatedContents);
    setIsModalOpen(false);
    alert('Content created successfully!');
  };

  const handleUpdate = (data: { title: string; content: string; type: ContentType; language: string }) => {
    if (!selectedContent) return;
    const updatedContents = contents.map(c => 
      c.id === selectedContent.id 
        ? { 
            ...c, 
            ...data, 
            version: c.version + 1,
            updatedAt: new Date().toISOString()
          }
        : c
    );
    setContents(updatedContents);
    saveContent(updatedContents);
    setIsEditModalOpen(false);
    setSelectedContent(null);
    alert('Content updated successfully!');
  };

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleSubmitForReview = (contentId: string) => {
    const updatedContents = contents.map(c => 
      c.id === contentId 
        ? { ...c, status: 'under-review' as const, updatedAt: new Date().toISOString() }
        : c
    );
    setContents(updatedContents);
    saveContent(updatedContents);
    alert('Content submitted for review!');
  };

  return (
    <ModuleLayout
      title="Content Editor"
      description="Create and edit temple content"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Create New Content
        </button>
      </div>

      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="under-review">Under Review</option>
            <option value="published">Published</option>
          </select>
        </div>
      </ModernCard>

      {/* Content List */}
      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <ElevatedCard
              key={content.id}
              elevation="lg"
              className="hover:scale-105 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.title}</h3>
                    <p className="text-xs text-gray-500 capitalize">{content.type.replace('-', ' ')} • v{content.version}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                    content.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : content.status === 'under-review'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {content.status === 'under-review' ? 'Review' : content.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: content.content.substring(0, 150) + '...' }} />
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>{content.authorName}</span>
                  <span>{new Date(content.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(content)}
                    className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  {content.status === 'draft' && (
                    <button
                      onClick={() => handleSubmitForReview(content.id)}
                      className="flex-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm font-medium transition-colors"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </ElevatedCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="md" className="text-center p-12">
          <p className="text-gray-600">
            No content found. Create your first content item using the button above.
          </p>
        </ModernCard>
      )}

      {/* Create Modal */}
      <ContentEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Edit Modal */}
      {selectedContent && (
        <ContentEditorModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedContent(null);
          }}
          onSave={handleUpdate}
          initialData={{
            title: selectedContent.title,
            content: selectedContent.content,
            type: selectedContent.type,
            language: selectedContent.language,
          }}
        />
      )}
    </ModuleLayout>
  );
}
