# Next.js Personalized Content Starter

The NeuronSearchLab quick start: sync a sample catalogue, retain each NSL-generated integer item ID, track behaviour through a server-side proxy, request recommendations with a dashboard-created integer context ID, and render the ranking.

1. Install the NeuronSearchLab resource from Vercel Marketplace and connect it to this project.
2. In the NSL dashboard, create a recommendation context and a Click event. Copy their numeric IDs into `NSL_CONTEXT_ID` and `NSL_EVENT_CLICK_ID`.
3. Deploy. Vercel supplies the API and credential values; the dashboard resource IDs remain explicit environment variables.
4. Open several Football stories, then refresh to see the ranking adapt.

For local development, copy `.env.example` to `.env.local` and use a server-side SDK credential from the NSL console.
