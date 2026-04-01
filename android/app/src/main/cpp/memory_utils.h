#pragma once
#include <vector>
#include <string>
#include <cstdint>

struct MemoryRegion {
    uintptr_t start;
    uintptr_t end;
    bool is_readable;
    bool is_writable;
    bool is_executable;
    std::string name;
};

std::vector<MemoryRegion> get_memory_regions(int pid);
bool read_process_memory(int pid, uintptr_t address, void* buffer, size_t size);
