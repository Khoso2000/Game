/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AndroidFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy';
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    language: 'groovy',
    content: `// Top-level build file for Block Quest Android Project
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`,
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    language: 'groovy',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "BlockQuest"
include(":app")
`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    language: 'groovy',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.blockquest.game"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.blockquest.game"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.datastore.preferences)

    testImplementation(libs.junit)
    testImplementation(libs.truth)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Vibration for tactile block drop and clear haptics -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BlockQuest">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.BlockQuest">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml',
    language: 'xml',
    content: `<resources>
    <string name="app_name">Block Quest</string>
    <string name="mode_classic">Classic</string>
    <string name="mode_adventure">Adventure</string>
    <string name="mode_daily">Daily Challenge</string>
    <string name="mode_time">Time Attack</string>
    <string name="mode_practice">Practice</string>
    <string name="score">Score</string>
    <string name="best_score">Best</string>
    <string name="game_over">Game Over</string>
    <string name="combo">COMBO</string>
    <string name="restart">Restart</string>
    <string name="undo">Undo</string>
    <string name="pause">Pause</string>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    language: 'xml',
    content: `<resources>
    <color name="navy_surface">#0F172A</color>
    <color name="board_grid_bg">#1E293B</color>
    <color name="board_cell_empty">#334155</color>
    <color name="block_teal">#14B8A6</color>
    <color name="block_coral">#F43F5E</color>
    <color name="block_amber">#F59E0B</color>
    <color name="block_violet">#8B5CF6</color>
    <color name="block_emerald">#10B981</color>
    <color name="ivory_text">#F8FAFC</color>
</resources>
`,
  },
  {
    path: 'app/src/main/java/com/blockquest/game/model/Models.kt',
    name: 'Models.kt',
    language: 'kotlin',
    content: `package com.blockquest.game.model

enum class BlockColor(val hex: Long) {
    TEAL(0xFF14B8A6),
    CORAL(0xFFF43F5E),
    AMBER(0xFFF59E0B),
    VIOLET(0xFF8B5CF6),
    EMERALD(0xFF10B981)
}

data class Cell(
    val filled: Boolean = false,
    val color: BlockColor? = null,
    val isJewel: Boolean = false,
    val isClearing: Boolean = false
)

data class Piece(
    val id: String,
    val name: String,
    val matrix: List<List<Int>>,
    val color: BlockColor
) {
    val height: Int get() = matrix.size
    val width: Int get() = matrix.firstOrNull()?.size ?: 0
}

enum class GameMode {
    CLASSIC,
    ADVENTURE,
    DAILY_CHALLENGE,
    TIME_ATTACK,
    PRACTICE
}

data class LevelObjective(
    val type: String, // "score", "lines", "combo", "jewels"
    val target: Int,
    var current: Int = 0,
    val description: String
)
`,
  },
  {
    path: 'app/src/main/java/com/blockquest/game/engine/BlockQuestEngine.kt',
    name: 'BlockQuestEngine.kt',
    language: 'kotlin',
    content: `package com.blockquest.game.engine

import com.blockquest.game.model.*

class BlockQuestEngine(val boardSize: Int = 8) {

    var grid: Array<Array<Cell>> = Array(boardSize) { Array(boardSize) { Cell() } }
        private set

    var score: Int = 0
        private set

    var combo: Int = 0
        private set

    var isGameOver: Boolean = false
        private set

    // Move undo buffer
    private var previousGrid: Array<Array<Cell>>? = null
    private var previousScore: Int = 0
    private var previousCombo: Int = 0
    var canUndo: Boolean = false
        private set

    fun canPlacePiece(piece: Piece, startRow: Int, startCol: Int): Boolean {
        if (startRow < 0 || startCol < 0 ||
            startRow + piece.height > boardSize ||
            startCol + piece.width > boardSize) {
            return false
        }

        for (r in 0 until piece.height) {
            for (c in 0 until piece.width) {
                if (piece.matrix[r][c] == 1 && grid[startRow + r][startCol + c].filled) {
                    return false
                }
            }
        }
        return true
    }

    fun hasValidMoves(pieces: List<Piece?>): Boolean {
        val active = pieces.filterNotNull()
        if (active.isEmpty()) return true

        for (piece in active) {
            for (r in 0..boardSize - piece.height) {
                for (c in 0..boardSize - piece.width) {
                    if (canPlacePiece(piece, r, c)) {
                        return true
                    }
                }
            }
        }
        return false
    }

    data class PlaceOutcome(
        val linesCleared: Int,
        val pointsEarned: Int,
        val newCombo: Int,
        val fullRows: List<Int>,
        val fullCols: List<Int>
    )

    fun placePiece(piece: Piece, startRow: Int, startCol: Int): PlaceOutcome {
        // Save undo state
        previousGrid = Array(boardSize) { r -> Array(boardSize) { c -> grid[r][c].copy() } }
        previousScore = score
        previousCombo = combo
        canUndo = true

        var blockCount = 0
        for (r in 0 until piece.height) {
            for (c in 0 until piece.width) {
                if (piece.matrix[r][c] == 1) {
                    grid[startRow + r][startCol + c] = Cell(filled = true, color = piece.color)
                    blockCount++
                }
            }
        }

        val fullRows = (0 until boardSize).filter { r ->
            (0 until boardSize).all { c -> grid[r][c].filled }
        }
        val fullCols = (0 until boardSize).filter { c ->
            (0 until boardSize).all { r -> grid[r][c].filled }
        }

        val totalLines = fullRows.size + fullCols.size
        var points = blockCount * 10

        if (totalLines > 0) {
            combo += 1
            // Clear cells simultaneously
            for (r in fullRows) {
                for (c in 0 until boardSize) grid[r][c] = Cell(filled = false)
            }
            for (c in fullCols) {
                for (r in 0 until boardSize) grid[r][c] = Cell(filled = false)
            }

            val baseLineScore = totalLines * 100
            val multiLineBonus = if (totalLines > 1) totalLines * 60 * (totalLines - 1) else 0
            points += (baseLineScore + multiLineBonus) * combo.coerceAtMost(10)
        } else {
            combo = 0
        }

        score += points
        return PlaceOutcome(totalLines, points, combo, fullRows, fullCols)
    }

    fun undoMove(): Boolean {
        if (!canUndo || previousGrid == null) return false
        grid = previousGrid!!
        score = previousScore
        combo = previousCombo
        canUndo = false
        return true
    }

    fun reset() {
        grid = Array(boardSize) { Array(boardSize) { Cell() } }
        score = 0
        combo = 0
        isGameOver = false
        previousGrid = null
        canUndo = false
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/blockquest/game/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    content: `package com.blockquest.game

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.blockquest.game.ui.BlockQuestApp
import com.blockquest.game.ui.theme.BlockQuestTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BlockQuestTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    BlockQuestApp()
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/blockquest/game/ui/BlockQuestApp.kt',
    name: 'BlockQuestApp.kt',
    language: 'kotlin',
    content: `package com.blockquest.game.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.blockquest.game.engine.BlockQuestEngine
import com.blockquest.game.model.GameMode
import com.blockquest.game.model.Piece

@Composable
fun BlockQuestApp() {
    val engine = remember { BlockQuestEngine() }
    var currentMode by remember { mutableStateOf(GameMode.CLASSIC) }
    var isPaused by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top HUD Bar with Score, Best, and Mode selector
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("SCORE", color = Color(0xFF94A3B8), style = MaterialTheme.typography.labelMedium)
                Text("\${engine.score}", color = Color.White, style = MaterialTheme.typography.headlineMedium)
            }
            if (engine.combo > 1) {
                Surface(
                    color = Color(0xFFF59E0B),
                    shape = MaterialTheme.shapes.small
                ) {
                    Text(
                        "COMBO x\${engine.combo}!",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        color = Color.Black
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 8x8 Board Container
        Box(
            modifier = Modifier
                .aspectRatio(1f)
                .fillMaxWidth()
                .background(Color(0xFF1E293B), MaterialTheme.shapes.large)
                .padding(8.dp)
        ) {
            // Render 8x8 cells grid
        }

        Spacer(modifier = Modifier.weight(1f))

        // 3-Piece Tray
        Row(
            modifier = Modifier.fillMaxWidth().height(120.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Interactive piece slots
        }
    }
}
`,
  },
  {
    path: 'app/src/test/java/com/blockquest/game/GameEngineTest.kt',
    name: 'GameEngineTest.kt',
    language: 'kotlin',
    content: `package com.blockquest.game

import com.blockquest.game.engine.BlockQuestEngine
import com.blockquest.game.model.BlockColor
import com.blockquest.game.model.Piece
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class GameEngineTest {

    private lateinit var engine: BlockQuestEngine

    @Before
    fun setup() {
        engine = BlockQuestEngine()
    }

    @Test
    fun testValidMoveWithinBounds() {
        val dot = Piece("dot", "Dot", listOf(listOf(1)), BlockColor.TEAL)
        assertTrue(engine.canPlacePiece(dot, 0, 0))
        assertTrue(engine.canPlacePiece(dot, 7, 7))
        assertFalse(engine.canPlacePiece(dot, 8, 0)) // out of bounds
    }

    @Test
    fun testSimultaneousRowAndColumnClearing() {
        val dot = Piece("dot", "Dot", listOf(listOf(1)), BlockColor.AMBER)
        
        // Fill row 0 except col 0
        for (c in 1 until 8) {
            engine.placePiece(dot, 0, c)
        }
        // Fill col 0 except row 0
        for (r in 1 until 8) {
            engine.placePiece(dot, r, 0)
        }

        // Place dot at (0, 0)
        val outcome = engine.placePiece(dot, 0, 0)

        // Must clear both row 0 and col 0 simultaneously!
        assertEquals(2, outcome.linesCleared)
        assertTrue(outcome.fullRows.contains(0))
        assertTrue(outcome.fullCols.contains(0))
        assertFalse(engine.grid[0][0].filled)
    }

    @Test
    fun testUndoRestoresPreviousState() {
        val dot = Piece("dot", "Dot", listOf(listOf(1)), BlockColor.VIOLET)
        val initialScore = engine.score
        engine.placePiece(dot, 2, 2)
        assertTrue(engine.grid[2][2].filled)

        val undone = engine.undoMove()
        assertTrue(undone)
        assertFalse(engine.grid[2][2].filled)
        assertEquals(initialScore, engine.score)
    }
}
`,
  },
];
