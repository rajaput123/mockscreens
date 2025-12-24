'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ModernCard, ElevatedCard } from '../../components';
import { Content, ContentStatus, ContentType } from '../types';
import { mockContents } from '../mockData';
import { loadContent, saveContent } from '../../utils/dataStorage';
import ContentEditorModal from '../components/ContentEditorModal';

export default function ContentLibraryPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load contents from localStorage on mount
  useEffect(() => {
    const staticContents = mockContents;
    const loadedContents = loadContent(staticContents);
    setContents(loadedContents);
  }, []);

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesLanguage = filterLanguage === 'all' || content.language === filterLanguage;
    return matchesSearch && matchesType && matchesStatus && matchesLanguage;
  });

  const handleView = (content: Content) => {
    setSelectedContent(content);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleDelete = (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      const updatedContents = contents.filter(c => c.id !== contentId);
      setContents(updatedContents);
      saveContent(updatedContents);
      alert('Content deleted successfully!');
    }
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

  const statusColors: Record<ContentStatus, { bg: string; text: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
    'under-review': { bg: 'bg-amber-100', text: 'text-amber-700' },
    published: { bg: 'bg-green-100', text: 'text-green-700' },
    archived: { bg: 'bg-gray-200', text: 'text-gray-700' },
  };

  return (
    <ModuleLayout
      title="Content Library"
      description="View and manage all temple content"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <a
          href="/people/content-management/content-editor"
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Create New Content
        </a>
      </div>

      {/* Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search content by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Types</option>
            <option value="event">Event</option>
            <option value="notice">Notice</option>
            <option value="information">Information</option>
            <option value="ritual-guide">Ritual Guide</option>
            <option value="temple-information">Temple Information</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="under-review">Under Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-2xl border transition-all font-medium ${
                viewMode === 'table'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-2xl border transition-all font-medium ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </ModernCard>

      {/* Table View */}
      {viewMode === 'table' && (
        <ElevatedCard elevation="lg" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Updated</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents.length > 0 ? (
                  filteredContents.map((content) => (
                    <tr
                      key={content.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{content.title}</div>
                        <div className="text-xs text-gray-500 mt-1">v{content.version}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{content.type.replace('-', ' ')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${statusColors[content.status].bg} ${statusColors[content.status].text}`}>
                          {content.status === 'under-review' ? 'Review' : content.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{content.authorName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(content.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(content)}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(content)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(content.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No content found. Create your first content item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ElevatedCard>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <>
          {filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContents.map((content) => (
                <ElevatedCard
                  key={content.id}
                  onClick={() => handleView(content)}
                  elevation="lg"
                  className="cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.title}</h3>
                        <p className="text-xs text-gray-500 capitalize">{content.type.replace('-', ' ')} • v{content.version}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-medium ${statusColors[content.status].bg} ${statusColors[content.status].text}`}>
                        {content.status === 'under-review' ? 'Review' : content.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: content.content.substring(0, 150) + '...' }} />
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <p>{content.authorName}</p>
                        <p>{new Date(content.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 font-medium">
                        {content.language.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(content);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(content);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(content.id);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </ElevatedCard>
              ))}
            </div>
          ) : (
            <ModernCard elevation="md" className="text-center p-12">
              <p className="text-gray-600">
                No content found. Create your first content item to get started.
              </p>
            </ModernCard>
          )}
        </>
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
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${statusColors[selectedContent.status].bg} ${statusColors[selectedContent.status].text}`}>
                  {selectedContent.status === 'under-review' ? 'Under Review' : selectedContent.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Author</p>
                <p className="text-sm font-semibold text-gray-900">{selectedContent.authorName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Version</p>
                <p className="text-sm font-semibold text-gray-900">v{selectedContent.version}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Language</p>
                <p className="text-sm font-semibold text-gray-900">{selectedContent.language.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Updated</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(selectedContent.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Content</p>
              <div className="p-4 bg-gray-50 rounded-xl" dangerouslySetInnerHTML={{ __html: selectedContent.content }} />
            </div>
            {selectedContent.publishedAt && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Published</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(selectedContent.publishedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

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
