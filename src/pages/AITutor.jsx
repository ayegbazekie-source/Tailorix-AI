import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  BookOpen,
  Scissors,
  Ruler,
  Shirt,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hello friend! I'm **Tailorix AI**, your master tailor companion with years of experience in the craft.

I'm here to support you with:
- 🧵 **Sewing techniques** - from your first stitch to advanced construction
- 📐 **Pattern making** - drafting, grading, and perfect alterations
- 👗 **Garment fitting** - diagnosing and solving any fit challenge
- 🎨 **Design advice** - fabric selection, style recommendations
- 🔧 **Problem solving** - any tailoring issue, no matter how complex
- 📱 **Tailorix AI App guidance** - help with using app features

I understand the joys and frustrations of tailoring - whether you're a beginner or advanced professional. I'm here to listen, guide, and help you grow.

**This service is completely free for all Tailorix AI users!** So long as you have internet, I'm here for you. What would you like to work on today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    "How do I take body measurements correctly?",
    "Explain dart manipulation for beginners",
    "What causes fabric puckering?",
    "How to sew an invisible zipper?",
    "Tips for working with slippery fabrics",
    "How to use the Illustrator feature?"
  ];

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const { data } = await base44.functions.invoke('checkProStatus');
      setIsPremium(data.isPro || false);
    } catch (e) {
      console.error('Failed to check user status:', e);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => `${m.role === 'user' ? 'Tailor' : 'Tailorix AI'}: ${m.content}`).join('\n\n');

      const appContext = `
Tailorix AI App Features and Instructions:

FREE PLAN FEATURES:
1. Image Analysis - Upload garment photos to get professional fitting diagnosis and alteration guidance
   - Navigate to "Analyze" from menu
   - Upload or capture garment image
   - Select section to analyze (Neckline, Bodice, Sleeves, etc.)
   - Click "Analyze Image"
   - Receive detailed fitting diagnosis, alteration steps, and professional notes
   - Free users get limited analyses per month

2. Tailorix AI Chat (THIS FEATURE) - Free AI tailoring assistant for all users
   - Ask any tailoring question
   - Get expert advice and step-by-step guidance
   - Available 24/7 with internet connection
   - Completely free for all users

3. Design Illustrator - Create garment illustrations
   - Full access during 7-day free trial
   - After trial: Pro subscription ($10/month) required
   - Includes Create, Modify, and Convert features

4. Problem Solver - Get fitting problem solutions
   - Full access during 7-day free trial
   - After trial: Pro subscription required
   - Describe fitting issues, provide measurements, upload photos

5. Fabric Visualizer - Preview fabrics on garment templates
   - Full access during 7-day free trial
   - After trial: Pro subscription required for all templates
   - Upload fabric images, see on garment templates, adjust scale and rotation

PREMIUM PRO FEATURES:
1. Professional Image Analysis - Unlimited AI-powered garment analysis
   - Unlimited analyses
   - Faster processing
   - Priority AI responses
   - All analysis reports saved automatically

2. AI Design Illustrator Pro - Advanced fashion illustration with unlimited generations
   a) Create New - Unlimited design generation from text descriptions
      - Describe design vision
      - Choose body type, fabric, occasion
      - Assign to workspaces for team collaboration
   
   b) Modify - Change fabric patterns on existing designs
      - Upload garment illustration
      - Describe fabric changes OR upload 1-2 fabric images
      - AI changes only fabric, keeps garment structure
   
   c) Convert - Transform entire garment styles
      - Write conversion description OR upload reference
      - AI transforms complete garment style
   
   d) Workspace Integration
      - Assign designs to team workspaces
      - Version tracking for all modifications
      - Team collaboration with role-based permissions

3. Problem Solver Pro - Unlimited fitting problem diagnosis
   - Unlimited solutions
   - Advanced measurement analysis
   - Professional alteration techniques
   - All solutions saved to profile

4. Fabric Visualizer Pro - Advanced fabric visualization
   - All garment templates available
   - Premium customization controls
   - Save visualizations to profile

5. Team Collaboration Workspaces - Professional team project management
   a) Create Workspace
      - Navigate to "Workspaces" menu
      - Click "Create New Workspace"
      - Enter workspace name
      - You become the host with full permissions
   
   b) Invite Team Members
      - Open workspace → "Members" tab
      - Click "Invite Member"
      - Enter email and assign role:
        * Host - Full control (create, edit, delete, manage members)
        * Supervisor - Edit and comment on designs
        * Tailor - View and comment only
   
   c) Design Versioning
      - All design modifications create new versions
      - View in "Version History" tab
      - See who made changes and when
      - Restore previous versions anytime
   
   d) Workspace Chat & Comments
      - "Chat" tab for team discussions
      - Add comments directly on designs
      - All conversations saved for reference

6. Tailorix AI Chat - Same as free, available to all users

HOW TO UPGRADE TO PRO:
- Tap "Upgrade to Pro" on any locked feature or go to Profile → Upgrade
- Pay $10/month via Paystack
- Instant Pro access after payment confirmation
- Tailorix AI Chat remains free forever regardless of plan
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Tailorix AI, a master tailor professional with 30+ years of experience in professional tailoring, pattern making, and garment construction. You are a trusted friend and mentor to tailors of all levels.

YOUR CHARACTER:
- You understand the emotions of tailors - the frustration of a difficult seam, the joy of a perfect fit, the stress of deadlines
- You chat like a supportive friend, not a formal teacher
- You truly listen and pay attention to their responses, feedback, and complaints before giving advice
- You treat beginners with extra patience and encouragement, and respect advanced tailors' expertise
- You ask thoughtful, relevant questions to understand their specific problem before offering solutions
- You're intelligent and can solve complex tailoring challenges
- You teach like a master tutor - breaking down complex concepts, using real-world examples, sharing professional secrets
- You are also knowledgeable about the Tailorix AI app and can guide users on how to use each feature

IMPORTANT RULES:
1. ONLY answer questions related to sewing, tailoring, fashion, garments, fabrics, patterns, alterations, AND Tailorix AI app features/usage
2. If asked about unrelated topics, kindly redirect: "I'd love to help, but I'm specifically here for tailoring questions and app guidance. What are you working on in your sewing right now?"
3. Before jumping to solutions, ask clarifying questions if needed: "Tell me more about what you're experiencing..." or "What have you tried so far?"
4. Adapt your tone to their level - if they seem confused, offer to explain simpler
5. Use numbered steps for processes, but keep your tone conversational
6. Be genuinely encouraging - celebrate their efforts and progress
7. Share professional tips, common mistakes to avoid, and why certain techniques work
8. Remember: This service is FREE for all Tailorix AI users with internet connection
9. When asked about app features, refer to the context below and explain clearly based on user's plan (Free or Premium: ${isPremium ? 'Premium' : 'Free'})
10. For app feature questions, provide step-by-step instructions from the app context
11. If user asks about features they don't have access to, gently inform them and suggest upgrading if they're on free plan

${appContext}

CONVERSATION SO FAR:
${conversationHistory}

Tailor: ${messageText}

Tailorix AI: `,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            is_tailoring_related: { type: "boolean" },
            suggested_followup: { type: "string" }
          }
        }
      });

      let assistantMessage = response.response;
      
      if (!response.is_tailoring_related) {
        assistantMessage = "I'd love to help, friend, but I'm specifically here for tailoring questions and Tailorix AI app guidance - it's where my expertise truly shines. What are you working on in your sewing right now? Any garments, patterns, fitting challenges, or app features I can help you with?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage, followup: response.suggested_followup }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I encountered an issue. Please try asking your question again." 
      }]);
    }
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `👋 Fresh start! I'm all ears, friend. What tailoring challenge or app question can I help you with today?`
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" className="text-slate-400 hover:text-white -ml-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png"
                  alt="Tailorix AI"
                  className="w-10 h-10 rounded-xl object-contain"
                />
                <div>
                  <h1 className="text-lg font-semibold text-white">Tailorix AI Chat</h1>
                  <p className="text-xs text-slate-400">Your master tailor friend</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea ref={scrollRef} className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${message.role === 'user' 
                    ? 'bg-slate-700' 
                    : 'bg-emerald-500'
                  }
                `}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png"
                      alt="Tailorix AI"
                      className="w-7 h-7 object-contain"
                    />
                  )}
                </div>
                <div className={`
                  max-w-[80%] rounded-2xl p-4
                  ${message.role === 'user' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-800 border border-slate-700 text-slate-100'
                  }
                `}>
                  <ReactMarkdown 
                    className="prose prose-invert prose-sm max-w-none
                      prose-p:my-2 prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2
                      prose-headings:text-white prose-strong:text-white"
                  >
                    {message.content}
                  </ReactMarkdown>
                  
                  {message.followup && (
                    <button
                      onClick={() => sendMessage(message.followup)}
                      className="mt-3 text-sm text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      {message.followup}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png"
                    alt="Tailorix AI"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="text-slate-400 text-sm">Tailorix AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-500 mb-2">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors border border-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm p-6">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about sewing, tailoring, patterns, or app features..."
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-rose-500 hover:bg-rose-600 rounded-xl px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Tailorix AI is here for tailoring questions & app guidance • Free for all users • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}