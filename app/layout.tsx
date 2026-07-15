import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "呼噜噜 ChainBrief 0G｜Web3 风险摘要",
  description: "基于 0G Private Computer 的 Web3 项目风险摘要工具，生成风险分、尽调问题与可追溯推理信息。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
