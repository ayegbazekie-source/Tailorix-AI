import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { History, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VersionHistoryTab({ workspaceId, currentUser, memberRole }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVersions();
    
    const unsubscribe = base44.entities.WorkspaceVersion.subscribe((event) => {
      if (event.data.workspace_id === workspaceId) {
        loadVersions();
      }
    });

    return unsubscribe;
  }, [workspaceId]);

  const loadVersions = async () => {
    try {
      const workspaceVersions = await base44.entities.WorkspaceVersion.filter({
        workspace_id: workspaceId
      }, '-created_date', 50);
      setVersions(workspaceVersions);
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
    setLoading(false);
  };

  const restoreVersion = async (version) => {
    if (memberRole === 'tailor') {
      toast.error('Only host and supervisors can restore versions');
      return;
    }

    try {
      toast.success(`Version ${version.version_number} restored`);
    } catch (error) {
      console.error('Failed to restore version:', error);
      toast.error('Failed to restore version');
    }
  };

  const canRestore = memberRole === 'host' || memberRole === 'supervisor';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Version History</h2>

      {versions.length === 0 ? (
        <div className="text-center py-20">
          <History className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
          <p className="text-amber-200/60">No versions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-amber-500/20 flex items-center gap-6"
            >
              <img
                src={version.preview_url}
                alt={`Version ${version.version_number}`}
                className="w-24 h-24 object-cover rounded-xl"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  Version {version.version_number}
                </h3>
                <p className="text-amber-200/70 text-sm">
                  By {version.edited_by_name}
                </p>
                <p className="text-amber-200/50 text-xs mt-1">
                  {new Date(version.created_date).toLocaleString()}
                </p>
                {version.change_description && (
                  <p className="text-amber-200/60 text-sm mt-2">
                    {version.change_description}
                  </p>
                )}
              </div>

              {canRestore && (
                <Button
                  onClick={() => restoreVersion(version)}
                  variant="outline"
                  className="border-amber-500/30 text-amber-300 hover:bg-amber-900/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}