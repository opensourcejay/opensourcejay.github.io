import { marked } from 'marked';

/**
 * Fetches and parses a markdown blog post
 */
export async function fetchMarkdownPost(filename) {
    try {
        const response = await fetch(`/posts/${filename}.md`);
        const markdown = await response.text();
        return {
            content: marked.parse(markdown),
            raw: markdown
        };
    } catch (error) {
        console.error('Error loading blog post:', error);
        return null;
    }
}

/**
 * Discovers all markdown files in the posts directory
 */
export async function discoverPosts() {
    try {
        const files = await import.meta.glob('/posts/*.md');
        return Object.keys(files).map(file => file.split('/').pop().replace('.md', ''));
    } catch (error) {
        console.error('Error discovering posts:', error);
        return [];
    }
}

/**
 * Creates a brief excerpt from text content
 * @param {string} text - The text to create an excerpt from
 * @param {number} maxLength - Maximum length of the excerpt
 * @returns {string} The formatted excerpt
 */
function createExcerpt(text, maxLength = 150) {
    // Remove markdown formatting and clean the text
    const cleanText = text
        .replace(/^#.*$/gm, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italics
        .replace(/`(.*?)`/g, '$1') // Remove code
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
        .replace(/<!--.*?-->/gs, '') // Remove HTML comments
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
    
    // If text is already shorter than maxLength, return it
    if (cleanText.length <= maxLength) {
        return cleanText;
    }

    // Find the last space before maxLength to avoid cutting words
    const lastSpace = cleanText.substring(0, maxLength).lastIndexOf(' ');
    return cleanText.substring(0, lastSpace) + '...';
}

/**
 * Extracts metadata and content from markdown
 */
export function extractMetadata(markdown) {
    // Extract metadata from the header section
    const lines = markdown.split('\n');
    let title = '';
    let date = '';
    let author = '';
    let image = '';
    let contentStart = 0;

    // Find the title (first h1)
    const titleLine = lines.findIndex(line => line.startsWith('# '));
    if (titleLine !== -1) {
        title = lines[titleLine].replace('# ', '');
        contentStart = titleLine + 1;
    }

    // Find date and author (usually in italics after title)
    for (let i = contentStart; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('*') && line.endsWith('*')) {
            if (!date) {
                date = line.replace(/^\*|\*$/g, '');
                contentStart = i + 1;
            } else if (!author) {
                author = line.replace(/^\*|\*$/g, '');
                contentStart = i + 1;
                break;
            }
        }
    }

    // Find the first image
    const imageMatch = markdown.match(/!\[(.*?)\]\((.*?)\)/);
    if (imageMatch) {
        image = imageMatch[2];
        // Move content start to after the image
        const imageLine = lines.findIndex(line => line.includes(imageMatch[0]));
        if (imageLine !== -1) {
            contentStart = imageLine + 1;
        }
    }

    // Get the content after metadata and remove the first h1 (title) if it exists
    const contentLines = lines.slice(contentStart);
    let content = contentLines.join('\n').trim();
    
    // Remove the title and metadata from the content
    content = content
        .replace(/^#\s.*$/m, '') // Remove the first h1 title
        .replace(/^\*.*\*$/m, '') // Remove date
        .replace(/^\*.*\*$/m, '') // Remove author
        .replace(/^!\[.*\]\(.*\)$/m, '') // Remove the first image
        .trim();

    // Create excerpt from the first real paragraph
    const paragraphs = content.split(/\n\n+/);
    const firstParagraph = paragraphs.find(p => p.trim() && !p.startsWith('#'));
    const excerpt = firstParagraph ? createExcerpt(firstParagraph) : 'No excerpt available';

    // Parse the content to HTML
    const parsedContent = marked.parse(content);

    return {
        title: title || 'Untitled',
        date: date || 'No date',
        author: author || 'Anonymous',
        image: image || '/images/default-post.jpg',
        content: parsedContent,
        excerpt
    };
}