import './globals.css'

export const metadata = {
  title: 'Pick一下',
    description: '我的赛博空间',
    }

    export default function RootLayout({
      children,
      }: {
        children: React.ReactNode
        }) {
          return (
              <html lang="zh">
                    <body>{children}</body>
                        </html>
                          )
                          }
                          