package com.onecore.engine

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    MemoryScreen()
                }
            }
        }
    }
}

@Composable
fun MemoryScreen(viewModel: MemoryViewModel = viewModel()) {
    var pidText by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        TextField(
            value = pidText,
            onValueChange = { pidText = it },
            label = { Text("Target PID") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(
            onClick = { pidText.toIntOrNull()?.let { viewModel.scan(it) } },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Scan Unreal Engine Structures")
        }
        Spacer(modifier = Modifier.height(16.dp))
        
        if (viewModel.isScanning) {
            CircularProgressIndicator()
        }

        LazyColumn {
            items(viewModel.results) { result ->
                Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        Text(text = result.name, style = MaterialTheme.typography.titleMedium)
                        Text(text = "Address: 0x${result.address.toString(16).uppercase()}", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}
