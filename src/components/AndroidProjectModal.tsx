/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Code, Check, Terminal, FolderTree, FileCode, Copy } from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../android_source/androidCodebase';

interface AndroidProjectModalProps {
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(7); // BlockQuestEngine.kt default
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('BlockQuest');

      // Add all project files
      for (const file of ANDROID_PROJECT_FILES) {
        rootFolder?.file(file.path, file.content);
      }

      // Add README with build instructions
      rootFolder?.file(
        'README.md',
        `# Block Quest — Native Android Puzzle Game
Kotlin & Jetpack Compose Native Implementation

## Quick Start & APK Build Instructions
1. Extract this zip archive.
2. Open Android Studio (Ladybug / Iguana or later).
3. Select "Open" and choose the extracted \`BlockQuest\` directory.
4. Allow Gradle sync to complete (uses Gradle 8.7+ and Kotlin 2.0+ with Compose Compiler plugin).
5. To test on device or emulator:
   - Click "Run 'app'" (Shift+F10)
6. To build the debug APK:
   - Run in terminal: \`./gradlew assembleDebug\`
   - The output APK is generated at:
     \`app/build/outputs/apk/debug/app-debug.apk\`
7. To run the automated engine unit tests:
   - Run in terminal: \`./gradlew testDebugUnitTest\`
`
      );

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BlockQuest_Android_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white tracking-tight">
                Native Android Project & APK Exporter
              </h2>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Kotlin & Jetpack Compose</span>
                <span>·</span>
                <span>Android 15 Ready (Target SDK 35)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating ZIP...' : 'Download Project ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout: File Explorer Sidebar + Code Viewer */}
        <div className="flex-1 flex overflow-hidden mt-3 gap-3">
          {/* File Tree Sidebar */}
          <div className="w-64 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col shrink-0 overflow-y-auto">
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <FolderTree className="w-3.5 h-3.5 text-teal-400" />
              <span>Project Structure</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {ANDROID_PROJECT_FILES.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors truncate ${
                    selectedFileIndex === idx
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Code View */}
          <div className="flex-1 bg-slate-950/90 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden">
            {/* Code Bar */}
            <div className="h-10 px-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
              <span className="font-mono text-slate-300 font-medium text-[11px] truncate">
                {selectedFile.path}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Content */}
            <pre className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-auto whitespace-pre leading-relaxed select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Bottom Terminal Build Guidance Footer */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>To build APK in terminal:</span>
            <code className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] border border-slate-800">
              ./gradlew assembleDebug
            </code>
          </div>
          <div className="text-[11px] text-slate-500">Android Studio Ladybug+ · Jetpack Compose BOM 2024.10.01</div>
        </div>
      </div>
    </div>
  );
};
