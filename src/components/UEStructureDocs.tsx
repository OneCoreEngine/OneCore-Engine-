import React from 'react';
import { CodeBlock } from './CodeBlock';
import { Book, Layers, Box, Globe } from 'lucide-react';

export function UEStructureDocs() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-3">
          <div className="p-2 bg-purple-500/10 rounded-lg w-fit">
            <Globe className="text-purple-400" size={24} />
          </div>
          <h3 className="font-semibold text-zinc-100">GWorld</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The global pointer to the current UWorld. It contains the persistent level, game state, and all actors.
          </p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-3">
          <div className="p-2 bg-blue-500/10 rounded-lg w-fit">
            <Layers className="text-blue-400" size={24} />
          </div>
          <h3 className="font-semibold text-zinc-100">GObjects</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            A global array (TUObjectArray) containing every UObject instance in the engine. Used for object iteration.
          </p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-3">
          <div className="p-2 bg-green-500/10 rounded-lg w-fit">
            <Box className="text-green-400" size={24} />
          </div>
          <h3 className="font-semibold text-zinc-100">GNames</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The global name table (TNameEntryArray). Stores all FName strings to save memory by using indices.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-100">
          <Book size={20} className="text-blue-400" />
          <h2 className="text-xl font-bold">Unreal Engine Core Structures</h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Understanding these structures is critical for memory analysis. Below are the C++ definitions 
          typically used in research tools.
        </p>

        <CodeBlock 
          title="UObject Structure"
          code={`struct UObject {
    void** VTable;          // 0x00
    int32_t ObjectFlags;    // 0x08
    int32_t InternalIndex;  // 0x0C
    UClass* ClassPrivate;   // 0x10
    FName NamePrivate;      // 0x18
    UObject* OuterPrivate;  // 0x20
};`}
        />

        <CodeBlock 
          title="TUObjectArray (GObjects)"
          code={`struct FUObjectItem {
    UObject* Object;
    int32_t Flags;
    int32_t ClusterRootIndex;
    int32_t SerialNumber;
};

struct TUObjectArray {
    FUObjectItem* Objects;
    int32_t MaxElements;
    int32_t NumElements;
};`}
        />

        <CodeBlock 
          title="UWorld Hierarchy"
          code={`struct UWorld : UObject {
    ULevel* PersistentLevel;      // 0x30
    UNetDriver* NetDriver;        // 0x38
    UGameInstance* OwningGameInstance; // 0x180
    AGameStateBase* GameState;    // 0x120
    TArray<ULevel*> Levels;       // 0x138
};`}
        />
      </div>
    </div>
  );
}
