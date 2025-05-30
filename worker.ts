export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const pathParts = url.pathname.split("/").filter(Boolean)

    if (pathParts[0] !== "script" || !pathParts[1]) {
      return new Response("Invalid path. Use /script/:id", { status: 400 })
    }

    const scriptID = pathParts[1]
    const filePath = `notes/${scriptID}.txt`
    const repo = "hiplitewhat/A"
    const branch = "main"

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`

    const githubRes = await fetch(apiUrl, {
      headers: {
        "Authorization": `token ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3.raw"
      }
    })

    if (!githubRes.ok) {
      return new Response(`Error fetching script: ${githubRes.status}`, { status: githubRes.status })
    }

    const scriptText = await githubRes.text()

    return new Response(scriptText, {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      }
    })
  }
}
