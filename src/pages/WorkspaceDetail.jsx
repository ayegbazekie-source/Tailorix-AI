import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Layout, MessageSquare, History, Users } from 'lucide-react';
import DesignsTab from '@/components/workspace/DesignsTab';
import ChatTab from '@/components/workspace/ChatTab';
import VersionHistoryTab from '@/components/workspace/VersionHistoryTab';
import MembersTab from '@/components/workspace/MembersTab';
import { useWorkspaceNotifications } from '@/components/workspace/useWorkspaceNotifications';
import OfflineBanner from '@/components/workspace/OfflineBanner';
import WorkspaceNotificationPrompt from '@/components/workspace/WorkspaceNotificationPrompt';

export default function WorkspaceDetail() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [memberRole, setMemberRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  const {
    isOnline,
    hasPermission,
    requestNotificationPermission,
    setActiveWorkspace
  } = useWorkspaceNotifications(currentUser, currentUser?.isPro);

  const workspaceId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (workspaceId) {
      setActiveWorkspace(workspaceId);
    }
    return () => setActiveWorkspace(null);
  }, [workspaceId]);

  useEffect(() => {
    const askedBefore = localStorage.getItem('workspace_notification_asked');
    if (!askedBefore && currentUser?.isPro && !hasPermission && !hasAskedPermission) {
      setShowNotificationPrompt(true);
      setHasAskedPermission(true);
      localStorage.setItem('workspace_notification_asked', 'true');
    }
  }, [currentUser, hasPermission, hasAskedPermission]);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      
      if (!user.isPro) {
        navigate(createPageUrl('FreeHome'), { replace: true });
        return;
      }
      
      setCurrentUser(user);
      loadWorkspace(user);
    } catch (error) {
      navigate(createPageUrl('Landing'), { replace: true });
    }
  };

  const loadWorkspace = async (user) => {
    try {
      const workspaces = await base44.entities.Workspace.filter({ id: workspaceId });
      if (workspaces.length === 0) {
        navigate(createPageUrl('WorkspaceList'), { replace: true });
        return;
      }

      const ws = workspaces[0];
      setWorkspace(ws);

      const members = await base44.entities.WorkspaceMember.filter({
        workspace_id: workspaceId,
        user_id: user.id
      });

      if (members.length > 0) {
        setMemberRole(members[0].role);
        
        await base44.entities.WorkspaceMember.update(members[0].id, {
          is_online: true
        });
      }
    } catch (error) {
      console.error('Failed to load workspace:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (currentUser && workspaceId) {
        base44.entities.WorkspaceMember.filter({
          workspace_id: workspaceId,
          user_id: currentUser.id
        }).then(members => {
          if (members.length > 0) {
            base44.entities.WorkspaceMember.update(members[0].id, {
              is_online: false
            });
          }
        });
      }
    };
  }, [currentUser, workspaceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E] p-6">
      <OfflineBanner isOnline={isOnline} isPremium={true} />
      <WorkspaceNotificationPrompt
        isOpen={showNotificationPrompt}
        onClose={() => setShowNotificationPrompt(false)}
        onEnable={requestNotificationPermission}
        isPremium={true}
      />
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-amber-200/60 hover:text-amber-300 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{workspace?.name}</h1>
          <p className="text-amber-200/70 capitalize">Your role: {memberRole}</p>
        </div>

        <Tabs defaultValue="designs" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-slate-800/50 border border-amber-500/20">
            <TabsTrigger value="designs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900">
              <Layout className="w-4 h-4 mr-2" />
              Designs
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900">
              <History className="w-4 h-4 mr-2" />
              Versions
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900">
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designs" className="mt-6">
            <DesignsTab 
              workspaceId={workspaceId} 
              currentUser={currentUser} 
              memberRole={memberRole}
            />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatTab 
              workspaceId={workspaceId} 
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <VersionHistoryTab 
              workspaceId={workspaceId} 
              currentUser={currentUser} 
              memberRole={memberRole}
            />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <MembersTab 
              workspaceId={workspaceId} 
              currentUser={currentUser} 
              memberRole={memberRole}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}