import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Image, Lock, Edit, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DesignsTab({ workspaceId, currentUser, memberRole }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [designTitle, setDesignTitle] = useState('');
  const [designFile, setDesignFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDesigns();
    
    const unsubscribe = base44.entities.WorkspaceDesign.subscribe((event) => {
      if (event.data.workspace_id === workspaceId) {
        loadDesigns();
      }
    });

    return unsubscribe;
  }, [workspaceId]);

  const loadDesigns = async () => {
    try {
      const workspaceDesigns = await base44.entities.WorkspaceDesign.filter({
        workspace_id: workspaceId
      });
      setDesigns(workspaceDesigns);
    } catch (error) {
      console.error('Failed to load designs:', error);
    }
    setLoading(false);
  };

  const addDesign = async () => {
    if (!designTitle.trim() || !designFile) {
      toast.error('Please provide title and image');
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: designFile });

      await base44.entities.WorkspaceDesign.create({
        workspace_id: workspaceId,
        title: designTitle,
        preview_url: file_url,
        created_by_id: currentUser.id,
        created_by_name: currentUser.full_name || currentUser.email,
        last_edited_by: currentUser.full_name || currentUser.email
      });

      setShowAddModal(false);
      setDesignTitle('');
      setDesignFile(null);
      toast.success('Design added successfully');
    } catch (error) {
      console.error('Failed to add design:', error);
      toast.error('Failed to add design');
    }
    setUploading(false);
  };

  const deleteDesign = async (design) => {
    if (memberRole !== 'host') {
      toast.error('Only the host can delete designs');
      return;
    }

    if (!confirm(`Delete "${design.title}"? This will remove all versions.`)) {
      return;
    }

    try {
      await base44.entities.WorkspaceDesign.delete(design.id);
      
      const versions = await base44.entities.WorkspaceVersion.filter({
        workspace_id: workspaceId,
        design_id: design.design_id
      });
      
      await Promise.all(versions.map(v => base44.entities.WorkspaceVersion.delete(v.id)));
      
      toast.success('Design deleted');
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design');
    }
  };

  const canEdit = memberRole === 'host' || memberRole === 'supervisor';
  const canDelete = memberRole === 'host';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Workspace Designs</h2>
        {canEdit && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Design
          </Button>
        )}
      </div>

      {designs.length === 0 ? (
        <div className="text-center py-20">
          <Image className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
          <p className="text-amber-200/60">No designs yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(245, 214, 123, 0.2)' }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 border-amber-500/20 cursor-pointer group relative"
            >
              <div className="relative h-48 bg-slate-900/50">
                <img 
                  src={design.preview_url} 
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                {!canEdit && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-slate-900/90 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                )}
                {canEdit && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit className="w-8 h-8 text-white" />
                  </div>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDesign(design);
                    }}
                    className="absolute top-2 left-2 w-8 h-8 bg-slate-900/90 hover:bg-red-900/90 text-amber-400 hover:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{design.title}</h3>
                <p className="text-sm text-amber-200/60">
                  By {design.created_by_name}
                </p>
                <p className="text-xs text-amber-200/40 mt-1">
                  Last edited: {design.last_edited_by}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-amber-400">Add Design</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <Input
                value={designTitle}
                onChange={(e) => setDesignTitle(e.target.value)}
                placeholder="Design title"
                className="bg-slate-900/50 border-amber-500/20 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-amber-200/80 mb-2">Design Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDesignFile(e.target.files[0])}
                className="w-full text-amber-200/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1 border-amber-500/30 text-amber-200/80 hover:bg-amber-900/20"
              >
                Cancel
              </Button>
              <Button
                onClick={addDesign}
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Add'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}