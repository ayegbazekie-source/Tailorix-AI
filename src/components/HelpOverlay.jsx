import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Wand2, HelpCircle, Bot, Shirt, ChevronDown, Users, Palette, Scissors, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpOverlay({ isPremium = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const freeSteps = [
    {
      icon: Camera,
      title: 'Analyze Your Garments',
      description: 'Upload photos of garments to get professional fitting diagnosis and alteration guidance.',
      color: 'from-rose-500 to-pink-500',
      faqs: [
        {
          question: 'How do I upload a photo?',
          answer: 'Navigate to "Analyze" from the bottom menu or home screen. Click "Take Photo" to use your camera or "Upload Image" to select from your gallery.'
        },
        {
          question: 'What kind of photos work best?',
          answer: 'Take clear, well-lit photos showing the full garment. Include front, back, and side views for best results. Ensure the garment is on a person or mannequin.'
        },
        {
          question: 'What analysis will I receive?',
          answer: 'You\'ll get a detailed report including garment overview, fitting issues, recommended alterations with difficulty levels, preventive tips, and professional notes.'
        }
      ]
    },
    {
      icon: Wand2,
      title: 'Generate Fashion Designs',
      description: 'Use the Fashion Illustrator to create, modify, and transform garment designs with AI assistance.',
      color: 'from-violet-500 to-purple-500',
      faqs: [
        {
          question: 'How do I create a new design?',
          answer: 'Go to "Design" from the bottom menu. Choose "Create New Design", describe your vision in detail, select body type, fabric, and occasion, then click "Generate Design".'
        },
        {
          question: 'Can I modify existing designs?',
          answer: 'Yes! Select "Modify Existing" and upload your reference image. Describe the changes you want, and the AI will transform it accordingly.'
        },
        {
          question: 'How many designs can I generate?',
          answer: 'All features are fully accessible during your 7-day free trial. After the trial, a Pro subscription ($10/month) is required for continued access.'
        },
        {
          question: 'How do I save my designs?',
          answer: 'After generation, click "Save to Profile" to add it to your saved designs gallery. You can access them anytime from your profile.'
        }
      ]
    },
    {
      iconUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png',
      title: 'Get Expert Help',
      description: 'Chat with Tailorix AI for tailoring advice, use the Problem Solver for fitting issues, or visualize fabrics on templates.',
      color: 'from-emerald-500 to-green-500',
      faqs: [
        {
          question: 'What is Tailorix AI Chat?',
          answer: 'Tailorix AI is your AI tailoring assistant. Ask any sewing or tailoring question and get detailed, beginner-friendly explanations with step-by-step guidance.'
        },
        {
          question: 'How does Problem Solver work?',
          answer: 'Describe your fitting issue, provide garment details and measurements, optionally upload a photo, and receive professional solutions with alteration steps.'
        },
        {
          question: 'What is Fabric Visualizer?',
          answer: 'Upload your fabric photo and see it realistically overlaid on different garment templates. All templates are free during your 7-day trial. After the trial, Pro unlocks all templates.'
        },
        {
          question: 'Is Tailorix AI Chat free?',
          answer: 'Yes! Tailorix AI Chat is completely free forever — no trial expiry and no subscription required. All other features require an active trial or Pro subscription.'
        }
      ]
    }
  ];

  const premiumSteps = [
    {
      icon: Camera,
      title: 'Professional Image Analysis',
      description: 'Get unlimited AI-powered garment analysis with detailed fitting diagnostics and professional alteration recommendations.',
      color: 'from-amber-500 to-yellow-500',
      faqs: [
        {
          question: 'How do I use Professional Analysis?',
          answer: 'Navigate to "Analyze" from the navigation menu. Upload or capture a garment image. Select the section to analyze (Neckline, Bodice, Sleeves, etc.), then click "Analyze Image". You\'ll receive unlimited professional diagnoses.'
        },
        {
          question: 'What makes Pro analysis different?',
          answer: 'Pro members get unlimited analyses (free users are limited), faster processing, priority AI responses, and detailed professional notes with advanced alteration techniques.'
        },
        {
          question: 'Can I save my analysis reports?',
          answer: 'Yes! All your analysis reports are automatically saved to your profile. You can access them anytime to review recommendations and track your progress.'
        }
      ]
    },
    {
      icon: Wand2,
      title: 'AI Design Illustrator Pro',
      description: 'Unlimited design generation with advanced modification and conversion features for professional fashion illustration.',
      color: 'from-amber-500 to-yellow-500',
      faqs: [
        {
          question: 'How to create designs from scratch?',
          answer: 'Go to "Illustrator" and select "Create New". Describe your design vision, choose body type, fabric, and occasion. Click "Generate Design" for unlimited creations. Optionally assign designs to workspaces for team collaboration.'
        },
        {
          question: 'How to modify fabric patterns?',
          answer: 'Select the "Modify" tab. Upload the garment illustration you want to modify. Then either: (1) Describe fabric changes in text, or (2) Upload 1-2 fabric images to apply to the garment. The AI will change only the fabric while keeping the garment structure.'
        },
        {
          question: 'How to convert design styles?',
          answer: 'Select the "Convert" tab. Either: (1) Write a description of how to transform the design (e.g., "Convert this dress into a two-piece set"), or (2) Upload a reference image. The AI will transform the entire garment style.'
        },
        {
          question: 'What are workspaces and how do I use them?',
          answer: 'Workspaces allow team collaboration. When creating a design, select a workspace to assign it there. All versions, comments, and modifications will be tracked. Team members can view, comment, and modify designs based on their role (Host, Supervisor, or Tailor).'
        }
      ]
    },
    {
      icon: HelpCircle,
      title: 'Problem Solver Pro',
      description: 'Advanced fitting problem diagnosis with unlimited solutions, measurement analysis, and professional alteration guidance.',
      color: 'from-amber-500 to-yellow-500',
      faqs: [
        {
          question: 'How does Problem Solver work?',
          answer: 'Navigate to "Problem Solver". Select the fitting problem from common issues or describe it yourself. Provide garment and fabric details. Enter body measurements (chest, waist, hips, shoulder). Optionally upload an image. Click "Get Solution" for unlimited professional analysis.'
        },
        {
          question: 'What kind of solutions will I receive?',
          answer: 'You\'ll get a professional diagnosis explaining the cause, step-by-step alteration instructions with difficulty ratings, recommended tools, preventive advice, and professional notes with advanced techniques.'
        },
        {
          question: 'Can I save problem solutions?',
          answer: 'Yes! All your problem-solving sessions are saved to your profile for future reference. You can review them anytime to implement the alterations.'
        }
      ]
    },
    {
      icon: Shirt,
      title: 'Fabric Visualizer Pro',
      description: 'Upload fabric patterns and visualize them on various garment templates with advanced customization controls.',
      color: 'from-amber-500 to-yellow-500',
      faqs: [
        {
          question: 'How to visualize fabrics on garments?',
          answer: 'Go to "Fabric Visualizer". Select a garment template (dress, shirt, trousers, etc.). Upload your fabric image. Adjust the scale and rotation to fit perfectly. The fabric is realistically rendered on the garment with proper shading and contours.'
        },
        {
          question: 'What garment templates are available?',
          answer: 'We offer multiple professional templates including dresses, shirts, blouses, trousers, skirts, jackets, and traditional wear. Each template shows realistic fabric draping and fits.'
        },
        {
          question: 'Can I save my visualizations?',
          answer: 'Yes! After creating your visualization, you can download the image or save it to your profile for future reference when consulting with clients.'
        }
      ]
    },
    {
      icon: Users,
      title: 'Team Collaboration Workspaces',
      description: 'Create and manage collaborative workspaces for team projects with role-based permissions and version control.',
      color: 'from-amber-500 to-yellow-500',
      faqs: [
        {
          question: 'How to create a workspace?',
          answer: 'Navigate to "Workspaces" from the menu. Click "Create New Workspace". Enter a workspace name and click "Create". You\'ll be the host with full permissions. You can then invite team members via email.'
        },
        {
          question: 'How to invite team members?',
          answer: 'Open your workspace and go to the "Members" tab. Click "Invite Member", enter their email, and assign a role: Host (full control), Supervisor (can edit and comment), or Tailor (view and comment only). They\'ll receive an email invitation.'
        },
        {
          question: 'How does design versioning work?',
          answer: 'When you modify a design in a workspace, each change creates a new version automatically. Go to "Version History" tab to see all versions, who made them, and when. You can restore any previous version if needed.'
        },
        {
          question: 'How to use workspace chat and comments?',
          answer: 'In the "Chat" tab, team members can discuss the project in real-time. For design-specific feedback, you can add comments directly on designs. All conversations are saved for reference.'
        }
      ]
    },
    {
      iconUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697d0c21476d1c06f4d428ff/169a0ecf8_TailorixChat.png',
      title: 'Tailorix AI Assistant',
      description: 'Get expert tailoring advice, pattern-making guidance, and professional tips from your AI master tailor companion.',
      color: 'from-emerald-500 to-green-500',
      faqs: [
        {
          question: 'What can I ask Tailorix AI?',
          answer: 'Tailorix AI is an expert in all tailoring topics: sewing techniques, pattern making, garment fitting, fabric selection, design advice, problem-solving, alterations, and professional tips. Ask anything related to the tailoring craft!'
        },
        {
          question: 'How does Tailorix AI understand my questions?',
          answer: 'Tailorix AI uses advanced AI to understand your questions in context. It remembers your conversation history, asks clarifying questions when needed, and adapts responses to your skill level (beginner to professional).'
        },
        {
          question: 'Is Tailorix AI Chat free?',
          answer: 'Yes! Tailorix AI Chat is completely free for all Tailorix AI users (both free and premium). As long as you have internet, you can chat with Tailorix AI anytime for unlimited tailoring advice.'
        }
      ]
    }
  ];

  const steps = isPremium ? premiumSteps : freeSteps;

  return (
    <>
      {/* Help Button */}
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className={`fixed bottom-24 right-6 z-[9999] shadow-2xl rounded-full w-14 h-14 p-0 ${
          isPremium 
            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black' 
            : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white'
        }`}
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl z-[9999]"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl h-full md:h-auto overflow-y-auto">
                {/* Header */}
                <div className={`sticky top-0 text-white p-6 md:p-8 rounded-t-3xl ${
                  isPremium 
                    ? 'bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#1E1E1E]' 
                    : 'bg-gradient-to-br from-slate-900 to-slate-800'
                }`}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      How to Use Tailorix AI {isPremium && 'Pro'}
                    </h2>
                    {isPremium && <Crown className="w-6 h-6 text-[#D4AF37]" />}
                  </div>
                  <p className={isPremium ? 'text-[#D4AF37]' : 'text-slate-300'}>
                    {isPremium 
                      ? 'Master all premium features with these guides' 
                      : 'Get started with these simple steps'
                    }
                  </p>
                </div>

                {/* Steps with FAQs */}
                <div className="p-6 md:p-8 space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
                    >
                      {/* Step Header */}
                      <button
                        onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                          {step.iconUrl ? (
                            <img src={step.iconUrl} alt={step.title} className="w-8 h-8 object-contain" />
                          ) : (
                            <step.icon className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {step.description}
                          </p>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            expandedStep === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* FAQs */}
                      <AnimatePresence>
                        {expandedStep === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-50 dark:bg-slate-800/50"
                          >
                            <div className="p-4 space-y-4">
                              {step.faqs.map((faq, faqIndex) => (
                                <div key={faqIndex} className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                                    {faq.question}
                                  </h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 space-y-6">
                  {/* Video Tutorials Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
                      Video Tutorials
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href="https://www.youtube.com/@TailorixAi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="font-medium">YouTube</span>
                      </a>
                      <a
                        href="https://www.instagram.com/dkadris_tailoring?igsh=MW1jM2xud2Y1YW1xdw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="font-medium">Instagram</span>
                      </a>
                    </div>
                  </div>

                  {/* Contact */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
                    Need more help? Contact our support team at{' '}
                    <a href="mailto:dkadristailoringservice@gmail.com" className={isPremium ? 'text-amber-500 hover:underline' : 'text-rose-500 hover:underline'}>
                      dkadristailoringservice@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}