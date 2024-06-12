import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "hookform-input",
  tagline: "Documentation for the hookform-input package",
  favicon: "img/favicon.ico",

  url: "https://hookform-input-documentation-git-main-emilmalanczaks-projects.vercel.app",
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/EmilMalanczak/hookform-input/tree/main/apps/documentation/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/rhfi-social-card.png",
    navbar: {
      title: "hookform-input",
      logo: {
        alt: "hookform-input logo",
        src: "img/rhfi-logo-background.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "sidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/EmilMalanczak/hookform-input",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Built with ❤️ by Emil Małańczak. MIT Licensed.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-error-line",
          line: "This will error",
        },
        {
          className: "code-block-error-line",
          line: "This will error <br />",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
