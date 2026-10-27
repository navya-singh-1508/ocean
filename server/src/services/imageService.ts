import type { PredictedCreature } from '../types.js'

export interface ImageGenerationResult {
  imageUrl: string | null
  status: 'generated' | 'fallback' | 'unconfigured'
  badge: string
  error?: string
}

export async function generateCreatureImage(
  creature: PredictedCreature
): Promise<ImageGenerationResult> {
  const provider = (process.env.IMAGE_PROVIDER || 'none').toLowerCase()
  const apiKey = process.env.OPENAI_API_KEY

  if (provider === 'none' || !provider) {
    return {
      imageUrl: null,
      status: 'unconfigured',
      badge: 'Scientific Speculative Concept (Vector Illustration)'
    }
  }

  if (provider === 'openai') {
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return {
        imageUrl: null,
        status: 'unconfigured',
        badge: 'Scientific Speculative Concept (Vector Illustration)',
        error: 'OPENAI_API_KEY is not configured in server/.env'
      }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `High-resolution marine biology field specimen concept art: ${creature.imagePrompt}. Dark deep-sea underwater photograph style, scientifically plausible, detailed texture, no human artifacts.`,
          n: 1,
          size: '1024x1024',
          response_format: 'url'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errText = await response.text()
        console.warn(`[ImageService] OpenAI API responded with status ${response.status}: ${errText}`)
        return {
          imageUrl: null,
          status: 'fallback',
          badge: 'Scientific Speculative Concept (Vector Illustration)',
          error: `OpenAI API returned status ${response.status}`
        }
      }

      const data = (await response.json()) as { data?: Array<{ url?: string }> }
      const url = data.data?.[0]?.url

      if (url) {
        return {
          imageUrl: url,
          status: 'generated',
          badge: 'AI-Generated Visual Concept (DALL·E 3)'
        }
      }

      return {
        imageUrl: null,
        status: 'fallback',
        badge: 'Scientific Speculative Concept (Vector Illustration)'
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[ImageService] Error invoking image provider: ${message}`)
      return {
        imageUrl: null,
        status: 'fallback',
        badge: 'Scientific Speculative Concept (Vector Illustration)',
        error: message
      }
    }
  }

  return {
    imageUrl: null,
    status: 'unconfigured',
    badge: 'Scientific Speculative Concept (Vector Illustration)',
    error: `Unsupported image provider: ${provider}`
  }
}
