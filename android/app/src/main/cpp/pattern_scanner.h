#pragma once
#include "memory_utils.h"
#include <cstdint>

uintptr_t find_pattern_in_region(int pid, const MemoryRegion& region, const char* pattern, const char* mask);
