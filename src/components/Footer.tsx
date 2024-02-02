import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center w-screen">
      <div className="flex gap-8 justify-center">
        <Link className="link" href="/">Home</Link>
        <Link className="link" href="/admin">Admin</Link>
        <Link className="link" href="https://github.com/NuttyShrimp/scougi-library" target="_blank">Source</Link>
      </div>
      <p className="my-2">Made with ❤️ by Jan Lecoutere</p>
    </footer>
  )
}
