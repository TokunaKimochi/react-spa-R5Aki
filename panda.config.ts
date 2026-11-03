import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  html: {
    minHeight: '100lvh',
    backgroundColor: '#dcd0c0',
    backgroundImage:
      "linear-gradient(175deg in oklch shorter hue, oklch(1 0 0 / 0%) 0lvh, oklch(0.7157 0.1324 48.77 / 0%) 75lvh, oklch(0.5305 0.2037 17.32 / 35%) 200lvh, oklch(0.2957 0.1699 287.56 / 55%) 300lvh), url('/_bg.svg')",
    backgroundRepeat: 'repeat, repeat',
    backgroundAttachment: 'scroll, scroll',
    color: '#0e0e0e',
    fontFamily: '"Segoe UI Emoji", "BIZ UDPGothic", sans-serif',
    fontSize: 'clamp(12px, 1.74vw, 16px)',
    lineHeight: '1.75rem',

    '&.cloud-theme': {
      backgroundImage:
      "linear-gradient(175deg in oklch shorter hue, oklch(1 0 0 / 0%) 0lvh, oklch(0.7157 0.1324 48.77 / 0%) 75lvh, oklch(0.5305 0.2037 17.32 / 35%) 200lvh, oklch(0.2957 0.1699 287.56 / 55%) 300lvh), url('/bg.svg'), url('/bgbg.svg')",
      backgroundRepeat: 'repeat, repeat, no-repeat',
      backgroundSize: 'auto, min(608px, 100svw), max(1920px, 100lvw)',
      backgroundPositionY: 'bottom',
      backgroundAttachment: 'scroll, scroll, fixed',
    },

    '&:has(iframe.pdf-viewer)': {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      margin: 0,
      padding: 0,
      height: '100vh',
      overflow: 'hidden',

      '& #root:has(> iframe)': {
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#525659',

        '& iframe': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'fit-content',
          border: 'none',
          display: 'block',
          aspectRatio: '297 / 210',
          maxWidth: '100%',
          maxHeight: '100vh',
          margin: 0,
          padding: 0,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

// shadows by Gemini 3 Pro
// https://www.joshwcomeau.com/css/designing-shadows
const SHADOW_HUE = '0 0% 0%';
const ROOT_FONT_SIZE = 16; // 基準となるフォントサイズ

/**
 * 数値を rem 文字列に変換するヘルパー
 */
function toRem(value: number) {
  if (value === 0)
    return '0';
  // 最大小数点以下5桁まで出力 (例: 0.5px -> 0.03125rem)
  return `${Number.parseFloat((value / ROOT_FONT_SIZE).toFixed(5))}rem`;
}

/**
 * 11時の光源（X軸ズレ）を維持しつつ、
 * 多層レイヤーによる滑らかな減衰を生成するヘルパー
 * 入力は px 相当の数値で行い、出力時に rem に変換します
 * @param layers [x, y, blur, alpha][] (数値は px 単位の感覚で指定)
 * @param isInset
 */
function createShadow(layers: [number, number, number, number][], isInset = false) {
  return {
    value: layers
      .map(([x, y, blur, alpha]) => {
        const color = `hsl(${SHADOW_HUE} / ${alpha})`;
        const type = isInset ? 'inset ' : '';

        // ここですべて rem に変換されます
        return `${type}${toRem(x)} ${toRem(y)} ${toRem(blur)} ${color}`;
      })
      .join(', '),
  };
}

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        shadows: {
          // ページのヘッダー専用
          sticky: {
            value: '0 .25rem 1rem rgba(0,0,0,.1),0 1px 0 rgba(0,0,0,.01)',
          },
          // --- 外側影 (Drop Shadows) ---
          // ポイント: 全てのサイズで [0.5, 1, 1] の最小レイヤーを含めることで
          // どんなに大きく浮いても「地面との接点」を感じさせます。

          '2xs': createShadow([
            // 控えめな存在感
            [0.5, 1, 1, 0.19],
          ]),

          xs: createShadow([
            // ここから多層化開始
            [0.5, 1, 1, 0.12],
            [0.5, 2, 2, 0.12],
          ]),

          sm: createShadow([
            [0.5, 1, 1, 0.1], // 接地レイヤー
            [1, 2, 2, 0.1],
            [2, 4, 4, 0.1], // 拡散レイヤー
          ]),

          md: createShadow([
            [0.5, 1, 1, 0.1],
            [1, 2, 2, 0.09],
            [2, 4, 4, 0.09],
            [4, 8, 8, 0.09],
          ]),

          lg: createShadow([
            [0.5, 1, 1, 0.09],
            [1, 2, 2, 0.08],
            [2, 4, 4, 0.08],
            [4, 8, 8, 0.08],
            [8, 16, 16, 0.08],
          ]),

          xl: createShadow([
            // 接地感を出すため 0.5px から積み上げ
            [0.5, 1, 1, 0.09], // 強い接地
            [1, 2, 2, 0.07],
            [2, 4, 4, 0.07],
            [4, 8, 8, 0.07],
            [8, 16, 16, 0.07],
            [12, 32, 32, 0.07], // 少し広げた拡散
          ]),

          '2xl': createShadow([
            [0.5, 1, 1, 0.09],
            [1, 2, 2, 0.06],
            [2, 4, 4, 0.06],
            [4, 8, 8, 0.06],
            [8, 16, 16, 0.06],
            [16, 32, 32, 0.06],
            [24, 64, 64, 0.06], // 非常に大きく、しかし薄く広がる影
          ]),

          // --- 内側影 (Inset Shadows) ---
          // 窪み表現のため、接地感（鋭い影）は外側影ほど重要ではありませんが、
          // 滑らかさを出すためにレイヤー数は確保しています。
          'inset-2xs': createShadow([
            [0.5, 1, 1, 0.22],
          ], true),

          'inset-xs': createShadow([
            [0.5, 1, 1, 0.1],
            [0.5, 2, 2, 0.1],
          ], true),

          'inset-sm': createShadow([
            [0.5, 2, 2, 0.12],
            [1, 4, 4, 0.1],
            [2, 6, 6, 0.07],
          ], true),

          'inset-md': createShadow([
            [0.5, 2, 2, 0.1],
            [1, 4, 4, 0.08],
            [2, 8, 8, 0.08],
          ], true),

          'inset-lg': createShadow([
            [1, 4, 4, 0.08],
            [2, 8, 8, 0.08],
            [4, 16, 16, 0.07],
          ], true),

          'inset-xl': createShadow([
            [2, 8, 8, 0.08],
            [4, 16, 16, 0.07],
            [8, 32, 32, 0.06],
          ], true),

          'inset-2xl': createShadow([
            [4, 16, 16, 0.07],
            [8, 32, 32, 0.06],
            [16, 64, 64, 0.05],
          ], true),
        },
      },
      keyframes: {
        depthFadeIn: {
          '0%': {
            opacity: 0,
            transform: 'translateZ(-40px) scale(0.96)',
            filter: 'blur(8px)',
          },
          '60%': {
            opacity: 1,
            transform: 'translateZ(0) scale(1.02)',
            filter: 'blur(0)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        depthFadeOut: {
          '0%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateZ(-30px) scale(0.95)',
            filter: 'blur(6px)',
          },
        },
      },
    },
  },

  // JSX スタイル
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',

  // グローバルスタイル
  globalCss,
});
