import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PullToRefresh from '@/components/PullToRefresh';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crown, Plus, Users, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkspaceList() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      
      if (!user.isPro) {
        navigate(createPageUrl('FreeHome'), { replace: true });
        return;
      }
      
      setCurrentUser(user);
      loadWorkspaces(user);
    } catch (error) {
      navigate(createPageUrl('Landing'), { replace: true });
    }
  };

  const loadWorkspaces = async (user) => {
    try {
      const allWorkspaces = await base44.entities.Workspace.filter({
        host_user_id: user.id
      });
      
      const memberWorkspaces = await base44.entities.WorkspaceMember.filter({
        user_id: user.id
      });
      
      const memberWorkspaceIds = memberWorkspaces.map(m => m.workspace_id);
      const otherWorkspaces = await Promise.all(
        memberWorkspaceIds.map(id => base44.entities.Workspace.filter({ id }))
      );
      
      const combined = [...allWorkspaces, ...otherWorkspaces.flat()];
      const unique = Array.from(new Map(combined.map(w => [w.id, w])).values());
      
      setWorkspaces(unique);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (!currentUser) return;
    await loadWorkspaces(currentUser);
  };



  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    if (workspaces.filter(w => w.host_user_id === currentUser.id).length >= 5) {
      toast.error('Workspace limit reached. Exit or delete one workspace to continue.');
      return;
    }

    setCreating(true);
    try {
      const workspace = await base44.entities.Workspace.create({
        name: newWorkspaceName,
        host_user_id: currentUser.id,
        host_user_email: currentUser.email
      });

      await base44.entities.WorkspaceMember.create({
        workspace_id: workspace.id,
        user_id: currentUser.id,
        user_email: currentUser.email,
        user_name: currentUser.full_name || currentUser.email,
        role: 'host',
        is_online: true
      });

      setWorkspaces([...workspaces, workspace]);
      setShowCreateModal(false);
      setNewWorkspaceName('');
      toast.success('Workspace created successfully');
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Failed to create workspace');
    }
    setCreating(false);
  };

  const deleteWorkspace = async (workspace) => {
    if (workspace.host_user_id !== currentUser.id) {
      toast.error('Only the host can delete this workspace');
      return;
    }

    if (!confirm(`Delete workspace "${workspace.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await base44.entities.Workspace.delete(workspace.id);
      await base44.entities.WorkspaceMember.filter({ workspace_id: workspace.id })
        .then(members => Promise.all(members.map(m => base44.entities.WorkspaceMember.delete(m.id))));
      
      setWorkspaces(workspaces.filter(w => w.id !== workspace.id));
      toast.success('Workspace deleted');
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      toast.error('Failed to delete workspace');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} isPremium={true}>
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-amber-200/60 hover:text-amber-300 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl font-bold text-white">Team Workspaces</h1>
            </div>
            <p className="text-amber-200/70 text-sm">Collaborate with your team in real-time</p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Workspace
          </Button>
        </div>

        {workspaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Users className="w-20 h-20 text-amber-400/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">No workspaces yet</h2>
            <p className="text-amber-200/60 mb-6">Create your first workspace to start collaborating</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Workspace
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(createPageUrl('WorkspaceDetail') + `?id=${workspace.id}`)}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-900" />
                  </div>
                  {workspace.host_user_id === currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkspace(workspace);
                      }}
                      className="text-amber-200/40 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{workspace.name}</h3>
                <p className="text-amber-200/60 text-sm">
                  {workspace.host_user_id === currentUser?.id ? 'Host' : 'Member'}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-amber-400">Create New Workspace</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-amber-200/80">Workspace Name</Label>
              <Input
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g., Spring Collection 2026"
                className="mt-2 bg-slate-900/50 border-amber-500/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && createWorkspace()}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 border-amber-500/30 text-amber-200/80 hover:bg-amber-900/20"
              >
                Cancel
              </Button>
              <Button
                onClick={createWorkspace}
                disabled={creating}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PullToRefresh>
  );
}