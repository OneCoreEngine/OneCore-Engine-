package com.onecore.engine

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

data class ScanResult(val name: String, val address: Long)

class MemoryViewModel : ViewModel() {
    var isScanning by mutableStateOf(false)
    val results = mutableStateListOf<ScanResult>()

    private val nativeBridge = NativeBridge()

    fun scan(pid: Int) {
        viewModelScope.launch(Dispatchers.IO) {
            isScanning = true
            results.clear()

            // Example Unreal Engine signatures
            val gWorld = nativeBridge.findPattern(pid, "\x48\x8B\x05\x00\x00\x00\x00\x48\x8B\x0C\xC8", "xxxx????xxxx")
            if (gWorld != 0L) results.add(ScanResult("GWorld", gWorld))

            val gNames = nativeBridge.findPattern(pid, "\x48\x8D\x05\x00\x00\x00\x00\xEB\x13", "xxxx????xx")
            if (gNames != 0L) results.add(ScanResult("GNames", gNames))

            val gObjects = nativeBridge.findPattern(pid, "\x48\x8B\x05\x00\x00\x00\x00\x48\x8B\x0C\xC8", "xxxx????xxxx")
            if (gObjects != 0L) results.add(ScanResult("GObjects", gObjects))

            isScanning = false
        }
    }
}
