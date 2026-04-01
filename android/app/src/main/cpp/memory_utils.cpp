#include "memory_utils.h"
#include <fstream>
#include <sstream>
#include <fcntl.h>
#include <unistd.h>
#include <sys/uio.h>

std::vector<MemoryRegion> get_memory_regions(int pid) {
    std::vector<MemoryRegion> regions;
    std::string maps_path = "/proc/" + std::to_string(pid) + "/maps";
    std::ifstream maps_file(maps_path);
    std::string line;

    while (std::getline(maps_file, line)) {
        std::stringstream ss(line);
        std::string range, perms, offset, dev, inode, name;
        ss >> range >> perms >> offset >> dev >> inode >> name;

        size_t dash = range.find('-');
        uintptr_t start = std::stoull(range.substr(0, dash), nullptr, 16);
        uintptr_t end = std::stoull(range.substr(dash + 1), nullptr, 16);

        MemoryRegion region;
        region.start = start;
        region.end = end;
        region.is_readable = perms[0] == 'r';
        region.is_writable = perms[1] == 'w';
        region.is_executable = perms[2] == 'x';
        region.name = name;
        regions.push_back(region);
    }
    return regions;
}

bool read_process_memory(int pid, uintptr_t address, void* buffer, size_t size) {
    std::string mem_path = "/proc/" + std::to_string(pid) + "/mem";
    int fd = open(mem_path.c_str(), O_RDONLY);
    if (fd == -1) return false;

    if (lseek64(fd, address, SEEK_SET) == -1) {
        close(fd);
        return false;
    }

    ssize_t nread = read(fd, buffer, size);
    close(fd);
    return nread == (ssize_t)size;
}
