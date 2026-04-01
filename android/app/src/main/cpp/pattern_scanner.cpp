#include "pattern_scanner.h"
#include <vector>
#include <cstring>

bool compare_pattern(const uint8_t* data, const uint8_t* pattern, const char* mask) {
    for (; *mask; ++mask, ++data, ++pattern) {
        if (*mask == 'x' && *data != *pattern)
            return false;
    }
    return (*mask) == 0;
}

uintptr_t find_pattern_in_region(int pid, const MemoryRegion& region, const char* pattern, const char* mask) {
    size_t region_size = region.end - region.start;
    std::vector<uint8_t> buffer(region_size);

    if (!read_process_memory(pid, region.start, buffer.data(), region_size)) {
        return 0;
    }

    size_t pattern_len = strlen(mask);
    for (size_t i = 0; i < region_size - pattern_len; i++) {
        if (compare_pattern(buffer.data() + i, (const uint8_t*)pattern, mask)) {
            return region.start + i;
        }
    }

    return 0;
}
