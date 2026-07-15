This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## User Feedback
| Feedback | Solution | Commit ID |
|----------|----------|-----------|
| The submit button lacks a clear animated loading state other than the spinner. | Added pulse animation to button when processing | `312eba6` |
| The input fields do not have a prominent focus ring when clicked. | Added focus:ring-2 and focus:ring-forest to input elements | `3c32a2d` |
| Nav links are a bit static on hover. | Increased background opacity and added scale transform on hover | `6917b4c` |
| Claim cards don't pop enough when hovering over them. | Added shadow-xl and increased translateY on hover | `9433078` |
| The pending status badge color blends in too much. | Updated Pending badge to be brighter amber with a border | `7e2b6c6` |
| The empty state on the dashboard is confusing when filters hide all claims. | Appended 'Try adjusting filters' to the empty state message | `ad734f1` |
| The statistical numbers in the counter are too small. | Increased font size to text-7xl and made them extrabold | `082d936` |
| The hero section text is hard to read against the busy background. | Added drop-shadow-md to hero headings | `7ce7e8d` |
| The footer lacks visual separation from the rest of the page. | Added a top margin and subtle shadow to the footer | `e01d78d` |
| The tree growth visualizer lacks a continuous pulse effect. | Added animate-pulse to the canopy rings | `8f8566c` |
