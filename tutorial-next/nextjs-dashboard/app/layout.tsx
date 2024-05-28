import '@/app/ui/global.css'; 
import { Metadata } from 'next';
import { inter } from "@/app/ui/fonts";
 
export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`/* フォントを滑らかにするクラス */}>{children}</body>
    </html>
  );
}
