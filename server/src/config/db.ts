import dns from 'dns'
import mongoose from 'mongoose'

let isConnecting = false

// Configure reliable DNS servers for SRV resolution in environments (such as Windows / certain ISPs)
// where local router DNS servers reject SRV queries with ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch (e) {
  // If setServers fails in restricted container, proceed with system defaults
  console.warn('⚠️ [Database] Could not set custom DNS fallback servers:', e)
}

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI

  if (!uri || uri.includes('<username>') || uri === 'your_mongodb_atlas_connection_string_here') {
    console.warn(
      '⚠️ [Database] MONGODB_URI is not configured in server/.env. Backend is running in standalone mode with curated in-memory catalog and session cache.'
    )
    return false
  }

  if (mongoose.connection.readyState === 1) {
    return true
  }

  if (isConnecting) {
    return false
  }

  try {
    isConnecting = true
    console.log('📡 [Database] Connecting to MongoDB Atlas...')
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    })

    // Perform real database verification check
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping()
    }
    console.log('✅ [Database] MongoDB Atlas connected and verified successfully!')
    isConnecting = false
    return true
  } catch (error: unknown) {
    isConnecting = false
    const msg = error instanceof Error ? error.message : String(error)
    console.warn(`⚠️ [Database] MongoDB connection failed: ${msg}. Operating in resilient fallback mode.`)
    return false
  }
}

export function getDbStatus(): {
  connected: boolean
  readyState: number
  stateName: string
  host?: string
} {
  const state = mongoose.connection.readyState
  const names = ['disconnected', 'connected', 'connecting', 'disconnecting']
  return {
    connected: state === 1,
    readyState: state,
    stateName: names[state] || 'unknown',
    host: mongoose.connection.host || undefined
  }
}

// Graceful shutdown
export async function closeDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('🛑 [Database] Mongoose connection closed gracefully.')
  }
}

process.on('SIGINT', async () => {
  await closeDB()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await closeDB()
  process.exit(0)
})
