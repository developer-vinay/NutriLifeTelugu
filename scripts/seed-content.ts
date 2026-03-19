import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import slugify from 'slugify'
import { connectDB } from '../lib/mongodb'
import { Post } from '../models/Post'
import { Recipe } from '../models/Recipe'
import { Video } from '../models/Video'
import { blogPosts } from '../data/blogPosts'
import { recipes } from '../data/recipes'

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function blocksToHtml(blocks: any[]): string {
  if (!blocks || blocks.length === 0) return '<p></p>'
  const out: string[] = []
  for (const b of blocks) {
    switch (b.type) {
      case 'paragraph':
        out.push(`<p>${escapeHtml(b.text ?? '')}</p>`)
        break
      case 'heading2':
        out.push(`<h2>${escapeHtml(b.text ?? '')}</h2>`)
        break
      case 'heading3':
        out.push(`<h3>${escapeHtml(b.text ?? '')}</h3>`)
        break
      case 'list':
        out.push(
          `<ul>${(b.items ?? [])
            .map((i: string) => `<li>${escapeHtml(i)}</li>`)
            .join('')}</ul>`,
        )
        break
      case 'takeaway':
        out.push(
          `<blockquote><strong>${escapeHtml(b.title ?? 'Key takeaways')}</strong><ul>${(b.points ?? [])
            .map((p: string) => `<li>${escapeHtml(p)}</li>`)
            .join('')}</ul></blockquote>`,
        )
        break
      case 'image':
        out.push(
          `<figure><img alt="${escapeHtml(
            b.altText ?? '',
          )}" /><figcaption>${escapeHtml(b.caption ?? '')}</figcaption></figure>`,
        )
        break
      case 'video':
        out.push(
          `<p><a href="${escapeHtml(b.youtubeUrl ?? '')}">${escapeHtml(
            b.caption ?? 'Video',
          )}</a></p>`,
        )
        break
      case 'contentUpgrade':
        out.push(
          `<aside><strong>${escapeHtml(b.headline ?? '')}</strong><p>${escapeHtml(
            b.subtext ?? '',
          )}</p></aside>`,
        )
        break
      case 'ad':
        out.push(`<div data-ad="${escapeHtml(b.size ?? '')}"></div>`)
        break
      default:
        break
    }
  }
  return out.join('\n')
}

function youtubeIdFromUrl(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '')
    }
    if (u.searchParams.get('v')) {
      return u.searchParams.get('v') ?? ''
    }
    const parts = u.pathname.split('/')
    const embedIndex = parts.findIndex((p) => p === 'embed')
    if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1]
    return ''
  } catch {
    return ''
  }
}

async function main() {
  await connectDB()

  // Seed Posts from blogPosts.ts
  for (const p of blogPosts) {
    const category =
      (p.category ?? 'general').toLowerCase().replaceAll(' ', '-') as any

    const slug = p.slug || slugify(p.title, { lower: true, strict: true })
    const content = blocksToHtml(p.sections ?? [])

    await Post.findOneAndUpdate(
      { slug },
      {
        title: p.title,
        slug,
        content,
        excerpt: p.excerpt,
        category,
        tag: p.tag,
        heroImage: undefined,
        heroImagePublicId: undefined,
        youtubeUrl: undefined,
        readTimeMinutes: p.readTimeMinutes,
        views: p.views ?? 0,
        isPublished: true,
        isFeatured: false,
        author: 'NutriLife Telugu',
        createdAt: p.publishedDate ? new Date(p.publishedDate) : new Date(),
      },
      { upsert: true, new: true },
    )
  }

  // Seed Recipes from recipes.ts
  for (const r of recipes) {
    const slug = r.slug || slugify(r.title, { lower: true, strict: true })
    const content = `<h2>తయారీ విధానం</h2><ol>${r.steps
      .map((s) => `<li>${escapeHtml(s)}</li>`)
      .join('')}</ol>`

    await Recipe.findOneAndUpdate(
      { slug },
      {
        title: r.title,
        slug,
        description: r.description,
        content,
        category: mapRecipeCategory(r.tag),
        tag: r.tag,
        heroImage: undefined,
        heroImagePublicId: undefined,
        prepTimeMinutes: undefined,
        cookTimeMinutes: undefined,
        servings: r.servings,
        ingredients: r.ingredients,
        nutritionFacts: r.nutritionFacts,
        isPublished: true,
        isFeatured: r.isFeatured,
        views: 0,
      },
      { upsert: true, new: true },
    )
  }

  // Seed one demo video (optional)
  const demoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  const demoId = youtubeIdFromUrl(demoUrl)
  await Video.findOneAndUpdate(
    { slug: 'demo-video' },
    {
      title: 'డెమో వీడియో — న్యూట్రిలైఫ్ తెలుగు',
      slug: 'demo-video',
      description: 'ఇది డెమో వీడియో. తర్వాత మీ అసలు యూట్యూబ్ వీడియోలు జోడిస్తాం.',
      youtubeUrl: demoUrl,
      youtubeId: demoId,
      thumbnailUrl: demoId
        ? `https://img.youtube.com/vi/${demoId}/maxresdefault.jpg`
        : undefined,
      category: 'health-education',
      tag: 'డెమో',
      durationSeconds: 60,
      isPublished: true,
      isFeatured: true,
      views: 0,
    },
    { upsert: true, new: true },
  )

  console.log('Seed complete: posts, recipes, videos')
  process.exit(0)
}

function mapRecipeCategory(tag: string) {
  const t = (tag ?? '').toLowerCase()
  if (t.includes('breakfast')) return 'breakfast'
  if (t.includes('lunch')) return 'lunch'
  if (t.includes('dinner')) return 'dinner'
  if (t.includes('snacks') || t.includes('juices')) return 'snacks'
  if (t.includes('millets') || t.includes('superfoods')) return 'millets'
  if (t.includes('diabetic')) return 'diabetic-friendly'
  return 'breakfast'
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

