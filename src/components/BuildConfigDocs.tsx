import React from 'react';
import { CodeBlock } from './CodeBlock';
import { Settings, Cpu, FileCode } from 'lucide-react';

export function BuildConfigDocs() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-100">Android NDK Build Configuration</h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          To build OneCore Engine for an actual Android device, you need to configure 
          your <code>CMakeLists.txt</code> and <code>build.gradle</code> files correctly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Settings size={20} />
            <h3 className="font-semibold">Toolchain Requirements</h3>
          </div>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>• Android NDK r21+</li>
            <li>• C++17 or C++20 Standard</li>
            <li>• CMake 3.10.2+</li>
            <li>• ABI Support: arm64-v8a (Recommended)</li>
          </ul>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-green-400">
            <Cpu size={20} />
            <h3 className="font-semibold">Architecture</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Most modern Android games use <strong>64-bit (arm64-v8a)</strong>. 
            Ensure your memory offsets and pointers are 64-bit aligned.
          </p>
        </div>
      </div>

      <CodeBlock 
        title="CMakeLists.txt"
        code={`cmake_minimum_required(VERSION 3.10.2)
project("onecore_engine")

add_library(onecore_engine SHARED
            onecore_main.cpp
            memory_utils.cpp
            pattern_scanner.cpp)

find_library(log-lib log)

target_link_libraries(onecore_engine \${log-lib})`}
      />

      <CodeBlock 
        title="app/build.gradle"
        code={`android {
    defaultConfig {
        externalNativeBuild {
            cmake {
                cppFlags "-std=c++17 -frtti -fexceptions"
                abiFilters "arm64-v8a"
            }
        }
    }
    externalNativeBuild {
        cmake {
            path "src/main/cpp/CMakeLists.txt"
        }
    }
}`}
      />

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2 mb-4">
          <FileCode size={18} className="text-blue-400" />
          Research Tip: Dumping Libraries
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Before scanning, you often need to find the base address of <code>libUE4.so</code> or <code>libGLESv2.so</code>. 
          You can do this by parsing <code>/proc/[pid]/maps</code> and searching for the library name.
        </p>
      </div>
    </div>
  );
}
