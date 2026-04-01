#include <jni.h>
#include <string>
#include <vector>
#include <android/log.h>
#include "memory_utils.h"
#include "pattern_scanner.h"

#define LOG_TAG "OneCoreEngine"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

extern "C" JNIEXPORT jlong JNICALL
Java_com_onecore_engine_NativeBridge_findPattern(JNIEnv* env, jobject thiz, jint pid, jstring pattern, jstring mask) {
    const char* c_pattern = env->GetStringUTFChars(pattern, nullptr);
    const char* c_mask = env->GetStringUTFChars(mask, nullptr);

    uintptr_t address = 0;
    std::vector<MemoryRegion> regions = get_memory_regions(pid);

    for (const auto& region : regions) {
        if (region.is_executable) {
            address = find_pattern_in_region(pid, region, c_pattern, c_mask);
            if (address != 0) break;
        }
    }

    env->ReleaseStringUTFChars(pattern, c_pattern);
    env->ReleaseStringUTFChars(mask, c_mask);

    return (jlong)address;
}

extern "C" JNIEXPORT jbyteArray JNICALL
Java_com_onecore_engine_NativeBridge_readMemory(JNIEnv* env, jobject thiz, jint pid, jlong address, jint size) {
    std::vector<uint8_t> buffer(size);
    if (read_process_memory(pid, (uintptr_t)address, buffer.data(), size)) {
        jbyteArray result = env->NewByteArray(size);
        env->SetByteArrayRegion(result, 0, size, (const jbyte*)buffer.data());
        return result;
    }
    return nullptr;
}
