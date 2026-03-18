import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Trash2, Crown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareDesignModal({ isOpen, onClose, design, currentUser }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState([]);
  const [loadingShares, setLoadingShares] = useState(false);

  React.useEffect(() => {
    if (isOpen && design) {
      loadShares();
    }
  }, [isOpen, design]);

  const loadShares = async () => {
    setLoadingShares(true);
    try {
      const sharedWith = await base44.entities.SharedDesign.filter({ design_id: design.id });
      setShares(sharedWith);
    } catch (error) {
      console.error('Error loading shares:', error);
    }
    setLoadingShares(false);
  };

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      await base44.entities.SharedDesign.create({
        design_id: design.id,
        owner_id: currentUser.id,
        shared_with_email: email.trim(),
        permission: permission
      });

      toast.success(`Design shared with ${email}`);
      setEmail('');
      setPermission('view');
      loadShares();
    } catch (error) {
      console.error('Error sharing design:', error);
      toast.error('Failed to share design');
    }
    setLoading(false);
  };

  const handleRemoveShare = async (shareId) => {
    try {
      await base44.entities.SharedDesign.delete(shareId);
      toast.success('Access removed');
      loadShares();
    } catch (error) {
      console.error('Error removing share:', error);
      toast.error('Failed to remove access');
    }
  };

  if (!currentUser?.isPremiumActive) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Premium Feature
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Collaboration is Premium Only
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Share designs, collaborate in real-time, and track versions with SewSimple Pro
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              Upgrade to Pro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share Design
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
              />
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleShare} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>

          <div className="border-t pt-4">
            <Label className="text-sm text-[var(--text-secondary)]">Shared With</Label>
            {loadingShares ? (
              <div className="text-center py-4">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-[var(--text-secondary)]" />
              </div>
            ) : shares.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center py-4">
                Not shared with anyone yet
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                {shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {share.shared_with_email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {share.permission}
                        </Badge>
                        {!share.accepted && (
                          <span className="text-xs text-amber-600">Pending</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveShare(share.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}