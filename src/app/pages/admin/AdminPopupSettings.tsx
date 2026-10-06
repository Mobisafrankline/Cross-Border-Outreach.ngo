import { useEffect, useState } from "react";
import { Save, Eye, EyeOff, ToggleLeft, ToggleRight, Loader2, CheckCircle2, AlertCircle, MessageSquare, Trash2, Plus } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface PopupCause {
  emoji: string;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  color: "orange" | "green" | "blue" | "purple";
}

interface PopupConfig {
  id?: string;
  enabled: boolean;
  label: string;
  heading: string;
  causes: PopupCause[];
  donate_button_text: string;
  dismiss_button_text: string;
}

const DEFAULT_CONFIG: PopupConfig = {
  enabled: true,
  label: "Emerging Causes",
  heading: "Two Urgent Causes That Need Your Help",
  causes: [
    {
      emoji: "🍽️",
      title: "Feed a Kid — $1 a Day",
      description: "Just $1 feeds a child for a full day across East Africa and the US.",
      link: "/donate",
      linkLabel: "Feed a Child Now",
      color: "orange",
    },
    {
      emoji: "🌿",
      title: "Climate Calamity Relief",
      description: "Floods, droughts and extreme weather devastating vulnerable communities.",
      link: "/donate",
      linkLabel: "Respond to Crisis",
      color: "green",
    },
  ],
  donate_button_text: "Donate Now",
  dismiss_button_text: "Maybe Later",
};

const COLOR_OPTIONS = [
  { value: "orange", label: "Orange", bg: "bg-orange-50 border-orange-200", text: "text-orange-600" },
  { value: "green",  label: "Green",  bg: "bg-green-50 border-green-200",   text: "text-green-700" },
  { value: "blue",   label: "Blue",   bg: "bg-blue-50 border-blue-200",     text: "text-blue-700"  },
  { value: "purple", label: "Purple", bg: "bg-purple-50 border-purple-200", text: "text-purple-700"},
];

export default function AdminPopupSettings() {
  const [config, setConfig]     = useState<PopupConfig>(DEFAULT_CONFIG);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [preview, setPreview]   = useState(false);

  /* ── Load from Supabase ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("key", "popup_config")
          .maybeSingle();

        if (data?.value) {
          setConfig({ ...DEFAULT_CONFIG, ...data.value });
        }
      } catch (_) {
        // table might not exist yet — use defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Save to Supabase ── */
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "popup_config", value: config }, { onConflict: "key" });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save. Make sure the site_settings table exists.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Update a cause field ── */
  const updateCause = (idx: number, field: keyof PopupCause, value: string) => {
    setConfig(prev => {
      const causes = [...prev.causes];
      causes[idx] = { ...causes[idx], [field]: value };
      return { ...prev, causes };
    });
  };

  const addCause = () => {
    setConfig(prev => ({
      ...prev,
      causes: [...prev.causes, { emoji: "✨", title: "New Cause", description: "Describe this cause.", link: "/donate", linkLabel: "Help Now", color: "blue" }],
    }));
  };

  const removeCause = (idx: number) => {
    setConfig(prev => ({ ...prev, causes: prev.causes.filter((_, i) => i !== idx) }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Floating Popup Message</h1>
          </div>
          <p className="text-slate-500 text-sm">Control what the floating call-to-action shows on the homepage.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(v => !v)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? "Hide Preview" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {saved && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-bold mb-1">Save failed</div>
            <div>{error}</div>
            <div className="mt-2 text-xs text-red-500">
              Run this SQL in Supabase to create the table:<br />
              <code className="bg-red-100 px-1 rounded">CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value JSONB);</code>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview */}
      {preview && (
        <div className="mb-8 relative">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Preview</div>
          <div className="w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mx-auto">
            <div className="bg-gradient-to-br from-[#032B45] to-[#0a2540] px-6 pt-6 pb-5 relative">
              <div className="text-[#F5B800] text-[10px] font-bold uppercase tracking-widest mb-2">{config.label}</div>
              <h2 className="text-lg font-extrabold text-white leading-snug">{config.heading}</h2>
            </div>
            <div className="p-4 space-y-3">
              {config.causes.map((cause, i) => {
                const col = COLOR_OPTIONS.find(c => c.value === cause.color) || COLOR_OPTIONS[0];
                return (
                  <div key={i} className={`p-3 border rounded-2xl ${col.bg}`}>
                    <div className="font-extrabold text-slate-900 text-sm mb-1">{cause.emoji} {cause.title}</div>
                    <p className="text-slate-500 text-xs leading-relaxed">{cause.description}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 inline-block ${col.text}`}>{cause.linkLabel} →</span>
                  </div>
                );
              })}
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <div className="flex-1 py-2.5 bg-[#F5B800] rounded-xl text-center text-xs font-bold text-[#032B45]">{config.donate_button_text}</div>
              <div className="flex-1 py-2.5 border-2 border-slate-200 rounded-xl text-center text-xs font-bold text-slate-500">{config.dismiss_button_text}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Enable / Disable ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900 mb-0.5">Show Popup on Homepage</div>
            <div className="text-slate-500 text-sm">When disabled, the popup will not appear for any visitors.</div>
          </div>
          <button
            onClick={() => setConfig(p => ({ ...p, enabled: !p.enabled }))}
            className="transition-colors"
          >
            {config.enabled
              ? <ToggleRight className="w-10 h-10 text-sky-600" />
              : <ToggleLeft className="w-10 h-10 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* ── Header Text ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 space-y-4">
        <div className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Popup Header</div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Label (small text above heading)</label>
          <input
            type="text"
            value={config.label}
            onChange={e => setConfig(p => ({ ...p, label: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Heading</label>
          <input
            type="text"
            value={config.heading}
            onChange={e => setConfig(p => ({ ...p, heading: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
          />
        </div>
      </div>

      {/* ── Causes ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="font-bold text-slate-900">Cause Cards</div>
          <button
            onClick={addCause}
            className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Cause
          </button>
        </div>

        <div className="space-y-6">
          {config.causes.map((cause, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl p-4 relative">
              <button
                onClick={() => removeCause(idx)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Emoji</label>
                  <input
                    type="text"
                    value={cause.emoji}
                    onChange={e => updateCause(idx, "emoji", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Color</label>
                  <select
                    value={cause.color}
                    onChange={e => updateCause(idx, "color", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition bg-white"
                  >
                    {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Title</label>
                <input
                  type="text"
                  value={cause.title}
                  onChange={e => updateCause(idx, "title", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                />
              </div>

              <div className="mb-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  value={cause.description}
                  onChange={e => updateCause(idx, "description", e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Link URL</label>
                  <input
                    type="text"
                    value={cause.link}
                    onChange={e => updateCause(idx, "link", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Link Label</label>
                  <input
                    type="text"
                    value={cause.linkLabel}
                    onChange={e => updateCause(idx, "linkLabel", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Buttons ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 grid grid-cols-2 gap-4">
        <div className="font-bold text-slate-900 col-span-2 border-b border-slate-100 pb-3 mb-1">Button Labels</div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Button</label>
          <input
            type="text"
            value={config.donate_button_text}
            onChange={e => setConfig(p => ({ ...p, donate_button_text: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dismiss Button</label>
          <input
            type="text"
            value={config.dismiss_button_text}
            onChange={e => setConfig(p => ({ ...p, dismiss_button_text: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
          />
        </div>
      </div>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
