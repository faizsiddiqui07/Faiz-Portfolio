export default function robots() {
  const baseUrl = "https://faizsiddiqui.netlify.app";
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}