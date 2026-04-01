package com.onecore.engine

class NativeBridge {
    init {
        System.loadLibrary("onecore_engine")
    }

    external fun findPattern(pid: Int, pattern: String, mask: String): Long
    external fun readMemory(pid: Int, address: Long, size: Int): ByteArray?
}
