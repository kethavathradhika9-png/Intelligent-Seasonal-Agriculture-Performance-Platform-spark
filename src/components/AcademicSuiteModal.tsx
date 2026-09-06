import React, { useState } from 'react';
import { ACADEMIC_PROJECT_REPORT, PRESENTATION_SLIDES, VIVA_VOCE_PREPARATION, RESUME_AND_PROJECT_POSITIONING } from '../data/academicMajorProjectContent';
import { X, FileText, Presentation, HelpCircle, Briefcase, ChevronLeft, ChevronRight, Copy, Check, BookOpen } from 'lucide-react';

interface AcademicSuiteModalProps {
  isOpen: boolean;
  initialTab: 'thesis' | 'ppt' | 'viva' | 'resume';
  onClose: () => void;
}

export const AcademicSuiteModal: React.FC<AcademicSuiteModalProps> = ({
  isOpen,
  initialTab,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'thesis' | 'ppt' | 'viva' | 'resume'>(initialTab);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [vivaCategory, setVivaCategory] = useState<string>('ALL');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  const filteredViva = VIVA_VOCE_PREPARATION.filter(
    (q) => vivaCategory === 'ALL' || q.category === vivaCategory
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold">
                B.Tech Major Project Academic Suite & Defense Guide
              </h2>
              <p className="text-xs text-slate-400">
                Official 21-Chapter Report • 12-Slide Defense Deck • Viva Voce Simulator • Resume Positioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Suite Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 space-x-2 pt-2">
          <button
            onClick={() => setActiveTab('thesis')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'thesis'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>21-Chapter Project Report</span>
          </button>

          <button
            onClick={() => setActiveTab('ppt')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'ppt'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>12-Slide Presentation Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'viva'
                ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Viva Voce Defense Guide (20+ Q&A)</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'resume'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Resume & GitHub Markdown</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800">
          {/* TAB 1: 21-Chapter Academic Thesis / Report */}
          {activeTab === 'thesis' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {ACADEMIC_PROJECT_REPORT.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ACADEMIC_PROJECT_REPORT.academicDegree} • {ACADEMIC_PROJECT_REPORT.domain}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const allText = ACADEMIC_PROJECT_REPORT.chapters
                      .map((c) => `## Chapter ${c.chapterNumber}: ${c.title}\n\n${c.content}`)
                      .join('\n\n---\n\n');
                    handleCopy(allText, 'all-thesis');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                >
                  {copiedSection === 'all-thesis' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Report!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Report (Markdown)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {ACADEMIC_PROJECT_REPORT.chapters.map((chapter) => (
                  <div
                    key={chapter.chapterNumber}
                    className="p-5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </h4>
                      <button
                        onClick={() => handleCopy(chapter.content, `ch-${chapter.chapterNumber}`)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Copy this chapter"
                      >
                        {copiedSection === `ch-${chapter.chapterNumber}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                      {chapter.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 12-Slide Presentation Deck */}
          {activeTab === 'ppt' && (
            <div className="space-y-5">
              {/* Slide Carousel Navigator */}
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    [{currentSlide.title}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((i) => i - 1)}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
                    onClick={() => setCurrentSlideIndex((i) => i + 1)}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* The Slide Canvas */}
              <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl min-h-[360px] flex flex-col justify-between border border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-mono uppercase tracking-wider mb-2">
                    <span>B.Tech Defense • Slide {currentSlide.slideNumber}</span>
                    <span>Major Project Committee Review</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentSlide.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">{currentSlide.subtitle}</p>

                  <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-200">
                    {currentSlide.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {currentSlide.keyMetricOrFormula && (
                    <div className="mt-6 p-3 bg-slate-800/80 rounded-lg border border-slate-700 font-mono text-xs text-emerald-300">
                      Key Formulation: {currentSlide.keyMetricOrFormula}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-800 flex justify-between">
                  <span>Intelligent Seasonal Agriculture Performance Platform</span>
                  <span>Presenter: 3rd Year B.Tech Engineering Major</span>
                </div>
              </div>

              {/* Speaker Notes */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                  Candidate Speaker Notes (What to say to the examiner):
                </span>
                <p className="text-amber-950 leading-relaxed italic">
                  "{currentSlide.speakerNotes}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Viva Voce Defense Simulator */}
          {activeTab === 'viva' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Viva Voce Defense Simulator (20+ Rigorous Questions & Model Answers)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prepared for external examiners, project guides, and viva chairpersons
                  </p>
                </div>
                <select
                  value={vivaCategory}
                  onChange={(e) => setVivaCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 outline-hidden font-medium"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Basic Questions">Basic Questions</option>
                  <option value="Technical Questions">Technical Questions</option>
                  <option value="Analytical Questions">Analytical Questions</option>
                  <option value="Critical & Defense Questions">Critical & Defense Questions</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredViva.map((viva, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 font-mono">
                        {viva.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Q#{idx + 1}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      Examiner Question: "{viva.question}"
                    </h4>

                    {/* Short Answer */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-700 block mb-0.5">
                        Direct 1-Sentence Answer:
                      </span>
                      <p className="text-slate-800">{viva.shortAnswer}</p>
                    </div>

                    {/* Detailed Academic Defense */}
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/80 text-xs">
                      <span className="font-bold text-emerald-900 block mb-0.5">
                        In-Depth Academic Defense (Mathematical & Technical Reasoning):
                      </span>
                      <p className="text-emerald-950 leading-relaxed">{viva.detailedDefense}</p>
                    </div>

                    {/* Examiner Rationale */}
                    <div className="text-[11px] text-slate-500 italic">
                      Examiner Rationale: {viva.academicRationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Resume Bullets & GitHub Markdown */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    ATS-Optimized Resume Project Entry
                  </h4>
                  <button
                    onClick={() => {
                      const resumeText = `${RESUME_AND_PROJECT_POSITIONING.oneLineTitle}\n${RESUME_AND_PROJECT_POSITIONING.bulletPoints.map((b) => `• ${b}`).join('\n')}\nTech: ${RESUME_AND_PROJECT_POSITIONING.technicalStack.join(', ')}`;
                      handleCopy(resumeText, 'resume-copy');
                    }}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    {copiedSection === 'resume-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Resume Section</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">
                      {RESUME_AND_PROJECT_POSITIONING.oneLineTitle}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {RESUME_AND_PROJECT_POSITIONING.twoLineSummary}
                    </span>
                  </div>

                  <ul className="space-y-1.5 list-disc list-inside text-slate-700 pt-1">
                    {RESUME_AND_PROJECT_POSITIONING.bulletPoints.map((bp, i) => (
                      <li key={i} className="leading-relaxed">
                        {bp}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 text-slate-600">
                    <strong>Tech Stack: </strong>
                    <span className="font-mono text-slate-800">
                      {RESUME_AND_PROJECT_POSITIONING.technicalStack.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* GitHub README */}
              <div className="p-5 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">GitHub README.md</h4>
                  <button
                    onClick={() => handleCopy(RESUME_AND_PROJECT_POSITIONING.gitHubReadmeMarkdown, 'readme-copy')}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedSection === 'readme-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy README</span>
                  </button>
                </div>
                <pre className="text-xs font-mono bg-slate-950 p-4 rounded-lg overflow-x-auto text-slate-300 leading-relaxed">
                  {RESUME_AND_PROJECT_POSITIONING.gitHubReadmeMarkdown}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
