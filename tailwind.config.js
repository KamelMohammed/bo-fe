const path = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const generatePalette = require(path.resolve(__dirname, ('src/infrastructure/@fuse/tailwind/utils/generate-palette')));

/**
 * Custom palettes
 *
 * Uses the generatePalette helper method to generate
 * Tailwind-like color palettes automatically
 */
const customPalettes = {
    brand: generatePalette('#2196F3'),
    primary: generatePalette('#1A9776')
};

/**
 * Themes
 */
const themes = {
    // Default theme is required for theming system to work correctly
    'default': {
        primary: {
            ...customPalettes.primary,
            DEFAULT: customPalettes.primary[500]
        },
        accent: {
            ...colors.slate,
            DEFAULT: colors.slate[800]
        },
        warn: {
            ...colors.red,
            DEFAULT: colors.red[600]
        },
        'on-warn': {
            500: colors.red['50']
        }
    },
    // Rest of the themes will use the 'default' as the base theme
    // and extend them with their given configuration
    'brand': {
        primary: customPalettes.brand
    },
    'teal': {
        primary: {
            ...colors.teal,
            DEFAULT: colors.teal[600]
        }
    },
    'rose': {
        primary: colors.rose
    },
    'purple': {
        primary: {
            ...colors.purple,
            DEFAULT: colors.purple[600]
        }
    },
    'amber': {
        primary: colors.amber
    }
};

/**
 * Tailwind configuration
 */
const config = {
    darkMode: 'class',
    content: ['./src/**/*.{html,scss,ts}'],
    important: true,
    safelist: [{
        pattern: /^p-/
    }, {
        pattern: /^p(r|b|l|t|y|x)-/,
        variants: ['sm', 'md', 'lg', 'xl', '2xl', '']
    }, {
        pattern: /^m-/,
        variants: ['sm', 'md', 'lg', 'xl', '2xl', '']
    }, {
        pattern: /^m(r|b|l|t|y|x)-/,
        variants: ['sm', 'md', 'lg', 'xl', '2xl', '']
    }, {
        pattern: /^w-/,
        variants: ['sm', 'md', 'lg', 'xl', '2xl', '']
    }, {
        pattern: /^text-/
    }, {
        pattern: /^top-/
    }, {
        pattern: /^right-/
    }, {
        pattern: /^left-/
    }, {
        pattern: /^bottom-/
    }, {
        pattern: /^border-/
    }],
    theme: {
        fontSize: {
            'xs': '0.625rem',
            'sm': '0.75rem',
            'md': '0.8125rem',
            'base': '0.875rem',
            'lg': '1rem',
            'xl': '1.125rem',
            '2xl': '1.25rem',
            '3xl': '1.5rem',
            '4xl': '2rem',
            '5xl': '2.25rem',
            '6xl': '2.5rem',
            '7xl': '3rem',
            '8xl': '4rem',
            '9xl': '6rem',
            '10xl': '8rem'
        },
        screens: {
            sm: '600px',
            md: '960px',
            lg: '1280px',
            xl: '1440px'
        },
        extend: {
            animation: {
                'spin-slow': 'spin 3s linear infinite'
            },
            colors: {
                gray: colors.slate
            },
            flex: {
                '0': '0 0 auto'
            },
            fontFamily: {
                sans: `"Inter var", ${defaultTheme.fontFamily.sans.join(',')}`,
                mono: `"IBM Plex Mono", ${defaultTheme.fontFamily.mono.join(',')}`
            },
            opacity: {
                12: '0.12',
                38: '0.38',
                87: '0.87'
            },
            rotate: {
                '-270': '270deg',
                '15': '15deg',
                '30': '30deg',
                '60': '60deg',
                '270': '270deg'
            },
            scale: {
                '-1': '-1'
            },
            width: {
                '1-pc': '1%',
                '2-pc': '2%',
                '3-pc': '3%',
                '4-pc': '4%',
                '5-pc': '5%',
                '6-pc': '6%',
                '7-pc': '7%',
                '8-pc': '8%',
                '9-pc': '9%',
                '10-pc': '10%',
                '11-pc': '11%',
                '12-pc': '12%',
                '13-pc': '13%',
                '14-pc': '14%',
                '15-pc': '15%',
                '16-pc': '16%',
                '17-pc': '17%',
                '18-pc': '18%',
                '19-pc': '19%',
                '20-pc': '20%',
                '21-pc': '21%',
                '22-pc': '22%',
                '23-pc': '23%',
                '24-pc': '24%',
                '25-pc': '25%',
                '26-pc': '26%',
                '27-pc': '27%',
                '28-pc': '28%',
                '29-pc': '29%',
                '30-pc': '30%',
                '31-pc': '31%',
                '32-pc': '32%',
                '33-pc': '33%',
                '34-pc': '34%',
                '35-pc': '35%',
                '36-pc': '36%',
                '37-pc': '37%',
                '38-pc': '38%',
                '39-pc': '39%',
                '40-pc': '40%',
                '41-pc': '41%',
                '42-pc': '42%',
                '43-pc': '43%',
                '44-pc': '44%',
                '45-pc': '45%',
                '46-pc': '46%',
                '47-pc': '47%',
                '48-pc': '48%',
                '49-pc': '49%',
                '50-pc': '50%',
                '51-pc': '51%',
                '52-pc': '52%',
                '53-pc': '53%',
                '54-pc': '54%',
                '55-pc': '55%',
                '56-pc': '56%',
                '57-pc': '57%',
                '58-pc': '58%',
                '59-pc': '59%',
                '60-pc': '60%',
                '61-pc': '61%',
                '62-pc': '62%',
                '63-pc': '63%',
                '64-pc': '64%',
                '65-pc': '65%',
                '66-pc': '66%',
                '67-pc': '67%',
                '68-pc': '68%',
                '69-pc': '69%',
                '70-pc': '70%',
                '71-pc': '71%',
                '72-pc': '72%',
                '73-pc': '73%',
                '74-pc': '74%',
                '75-pc': '75%',
                '76-pc': '76%',
                '77-pc': '77%',
                '78-pc': '78%',
                '79-pc': '79%',
                '80-pc': '80%',
                '81-pc': '81%',
                '82-pc': '82%',
                '83-pc': '83%',
                '84-pc': '84%',
                '85-pc': '85%',
                '86-pc': '86%',
                '87-pc': '87%',
                '88-pc': '88%',
                '89-pc': '89%',
                '90-pc': '90%',
                '91-pc': '91%',
                '92-pc': '92%',
                '93-pc': '93%',
                '94-pc': '94%',
                '95-pc': '95%',
                '96-pc': '96%',
                '97-pc': '97%',
                '98-pc': '98%',
                '99-pc': '99%',
                '100-pc': '100%',
            },
            zIndex: {
                '-1': -1,
                '49': 49,
                '60': 60,
                '70': 70,
                '80': 80,
                '90': 90,
                '99': 99,
                '999': 999,
                '9999': 9999,
                '99999': 99999
            },
            spacing: {
                '13': '3.25rem',
                '15': '3.75rem',
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '50': '12.5rem',
                '90': '22.5rem',

                // Bigger values
                '100': '25rem',
                '120': '30rem',
                '128': '32rem',
                '140': '35rem',
                '160': '40rem',
                '180': '45rem',
                '192': '48rem',
                '200': '50rem',
                '240': '60rem',
                '256': '64rem',
                '280': '70rem',
                '320': '80rem',
                '360': '90rem',
                '400': '100rem',
                '480': '120rem',

                // Fractional values
                '1/2': '50%',
                '1/3': '33.333333%',
                '2/3': '66.666667%',
                '1/4': '25%',
                '2/4': '50%',
                '3/4': '75%'
            },
            minHeight: ({ theme }) => ({
                ...theme('spacing')
            }),
            maxHeight: {
                none: 'none'
            },
            minWidth: ({ theme }) => ({
                ...theme('spacing'),
                screen: '100vw'
            }),
            maxWidth: ({ theme }) => ({
                ...theme('spacing'),
                screen: '100vw'
            }),
            transitionDuration: {
                '400': '400ms'
            },
            transitionTimingFunction: {
                'drawer': 'cubic-bezier(0.25, 0.8, 0.25, 1)'
            },

            // @tailwindcss/typography
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        color: 'var(--fuse-text-default)',
                        '[class~="lead"]': {
                            color: 'var(--fuse-text-secondary)'
                        },
                        a: {
                            color: 'var(--fuse-primary-500)'
                        },
                        strong: {
                            color: 'var(--fuse-text-default)'
                        },
                        'ol > li::before': {
                            color: 'var(--fuse-text-secondary)'
                        },
                        'ul > li::before': {
                            backgroundColor: 'var(--fuse-text-hint)'
                        },
                        hr: {
                            borderColor: 'var(--fuse-border)'
                        },
                        blockquote: {
                            color: 'var(--fuse-text-default)',
                            borderLeftColor: 'var(--fuse-border)'
                        },
                        h1: {
                            color: 'var(--fuse-text-default)'
                        },
                        h2: {
                            color: 'var(--fuse-text-default)'
                        },
                        h3: {
                            color: 'var(--fuse-text-default)'
                        },
                        h4: {
                            color: 'var(--fuse-text-default)'
                        },
                        'figure figcaption': {
                            color: 'var(--fuse-text-secondary)'
                        },
                        code: {
                            color: 'var(--fuse-text-default)',
                            fontWeight: '500'
                        },
                        'a code': {
                            color: 'var(--fuse-primary)'
                        },
                        pre: {
                            color: theme('colors.white'),
                            backgroundColor: theme('colors.gray.800')
                        },
                        thead: {
                            color: 'var(--fuse-text-default)',
                            borderBottomColor: 'var(--fuse-border)'
                        },
                        'tbody tr': {
                            borderBottomColor: 'var(--fuse-border)'
                        },
                        'ol[type="A" s]': false,
                        'ol[type="a" s]': false,
                        'ol[type="I" s]': false,
                        'ol[type="i" s]': false
                    }
                },
                sm: {
                    css: {
                        code: {
                            fontSize: '1em'
                        },
                        pre: {
                            fontSize: '1em'
                        },
                        table: {
                            fontSize: '1em'
                        }
                    }
                }
            })
        }
    },
    corePlugins: {
        appearance: false,
        container: false,
        float: false,
        clear: false,
        placeholderColor: false,
        placeholderOpacity: false,
        verticalAlign: false
    },
    plugins: [

        // Fuse - Tailwind plugins
        require(path.resolve(__dirname, ('src/infrastructure/@fuse/tailwind/plugins/utilities'))),
        require(path.resolve(__dirname, ('src/infrastructure/@fuse/tailwind/plugins/icon-size'))),
        require(path.resolve(__dirname, ('src/infrastructure/@fuse/tailwind/plugins/theming')))({ themes }),

        // Other third party and/or custom plugins
        require('@tailwindcss/typography')({ modifiers: ['sm', 'lg'] }),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp')
    ]
};

module.exports = config;
