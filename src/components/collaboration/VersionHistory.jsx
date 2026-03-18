import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Clock, User, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function VersionHistory({ design, isOpen, onClose, onRestoreVersion }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && design) {
      loadVersions();
    }
  }, [isOpen, design]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const versionsList = await base44.entities.DesignVersion.filter(
        { design_id: design.id },
        '-version_number'
      );
      setVersions(versionsList);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast.error('Failed to load version history');
    }
    setLoading(false);
  };

  const handleRestore = async (version) => {
    try {
      await onRestoreVersion(version);
      toast.success(`Restored to version ${version.version_number}`);
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-[var(--text-secondary)]">No version history yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="border border-[var(--border-primary)] rounded-xl p-4 hover:border-rose-400 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      <img
                        src={version.image_url}
                        alt={`Version ${version.version_number}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={index === 0 ? "default" : "outline"}>
                              Version {version.version_number}
                            </Badge>
                            {index === 0 && (
                              <span className="text-xs text-green-600 dark:text-green-400">Current</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Clock className="w-4 h-4" />
                            {new Date(version.created_date).toLocaleString()}
                          </div>
                        </div>
                        {index !== 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(version)}
                          >
                            Restore
                          </Button>
                        )}
                      </div>
                      {version.change_description && (
                        <p className="text-sm text-[var(--text-primary)] mb-2">
                          {version.change_description}
                        </p>
                      )}
                      {version.changed_by && (
                        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                          <User className="w-3 h-3" />
                          {version.changed_by}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}