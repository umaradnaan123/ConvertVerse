import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Shield } from 'lucide-react';

export default function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Contact ConvertVerse Support</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Have feedback, feature requests, or technical inquiries? Reach out directly to our engineering team.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-400" /> Get in Touch
          </h2>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Sent!</h3>
              <p className="text-slate-300 text-sm">Thank you for reaching out. We will respond within 24-48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-4">
            <MessageSquare className="w-8 h-8 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Direct Support Channel</h3>
            <p className="text-slate-300 text-sm">
              Email us directly at <a href="mailto:support@convertverse.app" className="text-emerald-400 underline">support@convertverse.app</a> or report issues on GitHub.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-4">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Privacy Guarantee</h3>
            <p className="text-slate-300 text-sm">
              We never share your email address or personal contact details with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
