import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { ROLES } from "@/types";
import AuthProvider from "./providers/AuthProvider";
import AudioInitializer from "./components/AudioInitializer";
import ReactQueryProvider from "./providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: {
    default: "Bingo Blast",
    template: "%s | Bingo Blast",
  },
  description: "Real-time multiplayer bingo game",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={` dark:bg-[#020817] dark:text-gray-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="myapp-theme" // Unique key for the app
        >
          <AuthProvider>
            <RoleAwareApp>
              <ReactQueryProvider>
                <AudioInitializer />
                {children}
              </ReactQueryProvider>
            </RoleAwareApp>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function RoleAwareApp({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role as keyof typeof ROLES | undefined;

  return (
    <>
      {role === ROLES.CASHIER && (
        <div className="cashier-banner">Cashier Mode</div>
      )}
      <div className="min-h-screen">{children}</div>
    </>
  );
}
